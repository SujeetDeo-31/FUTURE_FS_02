'use client';

import { Lead, LeadStatus } from '@/types/crm';

export const LeadService = {
  createLead: async (data: Partial<Lead>) => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
  },

  updateLeadStatus: async (leadId: string, oldStatus: LeadStatus, newStatus: LeadStatus) => {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        statusUpdate: { timestamp: new Date().toISOString(), oldStatus, newStatus }
      }),
    });
    if (!response.ok) throw new Error('Failed to update lead status');
    return response.json();
  },

  seedSampleData: async () => {
    const response = await fetch('/api/seed', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to seed sample data');
    return response.json();
  }
};