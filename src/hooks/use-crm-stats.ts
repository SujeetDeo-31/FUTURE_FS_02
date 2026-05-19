'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lead, LeadStatus } from '@/types/crm';
import { format, subMonths, subDays, isAfter, parseISO, startOfYear, isWithinInterval } from 'date-fns';

export type TimeRange = '7d' | '30d' | '90d' | 'year' | 'all';

export function useCRMStats(timeRange: TimeRange = '30d') {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = useMemo(() => {
    if (!leads.length) return null;

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d': startDate = subDays(now, 7); break;
      case '30d': startDate = subDays(now, 30); break;
      case '90d': startDate = subDays(now, 90); break;
      case 'year': startDate = startOfYear(now); break;
      default: startDate = new Date(0);
    }

    const filteredLeads = leads.filter(lead => {
      const createdDate = parseISO(lead.createdAt);
      return isAfter(createdDate, startDate);
    });

    const statusBreakdown: Record<LeadStatus, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      Converted: 0,
      Lost: 0,
    };

    const sourceBreakdown: Record<string, number> = {};
    let convertedCount = 0;
    let highPriorityCount = 0;
    let followUpsDueCount = 0;

    const monthlyGrowth: Record<string, { month: string; leads: number; active: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthKey = format(monthDate, 'MMM');
      monthlyGrowth[monthKey] = { month: monthKey, leads: 0, active: 0 };
    }

    filteredLeads.forEach((lead) => {
      if (lead.status in statusBreakdown) {
        statusBreakdown[lead.status]++;
      }
      if (lead.status === 'Converted') convertedCount++;
      if (lead.priority === 'High') highPriorityCount++;
      
      sourceBreakdown[lead.source] = (sourceBreakdown[lead.source] || 0) + 1;

      if (lead.followUpDate && isAfter(now, parseISO(lead.followUpDate)) && lead.status !== 'Converted' && lead.status !== 'Lost') {
        followUpsDueCount++;
      }

      const createdDate = parseISO(lead.createdAt);
      const monthName = format(createdDate, 'MMM');
      if (monthlyGrowth[monthName]) {
        monthlyGrowth[monthName].leads++;
        if (lead.status !== 'Lost') {
          monthlyGrowth[monthName].active++;
        }
      }
    });

    return {
      totalLeads: filteredLeads.length,
      convertedCount,
      newLeadsCount: statusBreakdown['New'],
      highPriorityCount,
      followUpsDueCount,
      statusBreakdown,
      sourceBreakdown,
      sourceData: Object.entries(sourceBreakdown).map(([name, value]) => ({ name, value })),
      growthData: Object.values(monthlyGrowth),
      conversionRate: filteredLeads.length > 0 ? (convertedCount / filteredLeads.length) * 100 : 0,
    };
  }, [leads, timeRange]);

  return { stats, leads, loading, error, refresh: fetchLeads };
}