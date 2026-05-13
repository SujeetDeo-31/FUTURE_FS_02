'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lead, LeadStatus, CRMStats } from '@/types/crm';
import { format, subMonths, isAfter, parseISO } from 'date-fns';

export function useCRMStats() {
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
    let followUpsDueCount = 0;
    const now = new Date();

    const monthlyGrowth: Record<string, { month: string; leads: number; active: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthKey = format(monthDate, 'MMM');
      monthlyGrowth[monthKey] = { month: monthKey, leads: 0, active: 0 };
    }

    leads.forEach((lead) => {
      if (lead.status in statusBreakdown) {
        statusBreakdown[lead.status]++;
      }
      if (lead.status === 'Converted') convertedCount++;
      
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
      totalLeads: leads.length,
      convertedCount,
      newLeadsCount: statusBreakdown['New'],
      followUpsDueCount,
      statusBreakdown,
      sourceBreakdown,
      sourceData: Object.entries(sourceBreakdown).map(([name, value]) => ({ name, value })),
      growthData: Object.values(monthlyGrowth),
      conversionRate: leads.length > 0 ? (convertedCount / leads.length) * 100 : 0,
    };
  }, [leads]);

  return { stats, leads, loading, error, refresh: fetchLeads };
}