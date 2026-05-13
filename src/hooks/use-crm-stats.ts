
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Lead, LeadStatus, CRMStats } from '@/types/crm';
import { startOfMonth, format, subMonths, isAfter, parseISO } from 'date-fns';

export function useCRMStats() {
  const firestore = useFirestore();
  const leadsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: leads, loading, error } = useCollection<Lead>(leadsQuery);

  const stats = useMemo(() => {
    if (!leads) return null;

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

    // Growth and Monthly Trends
    const monthlyGrowth: Record<string, { month: string; leads: number; active: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthKey = format(monthDate, 'MMM');
      monthlyGrowth[monthKey] = { month: monthKey, leads: 0, active: 0 };
    }

    leads.forEach((lead) => {
      // Basic counts
      if (lead.status in statusBreakdown) {
        statusBreakdown[lead.status]++;
      }
      if (lead.status === 'Converted') convertedCount++;
      
      // Source breakdown
      sourceBreakdown[lead.source] = (sourceBreakdown[lead.source] || 0) + 1;

      // Follow-ups
      if (lead.followUpDate && isAfter(now, parseISO(lead.followUpDate)) && lead.status !== 'Converted' && lead.status !== 'Lost') {
        followUpsDueCount++;
      }

      // Growth mapping
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

  return { stats, leads, loading, error };
}
