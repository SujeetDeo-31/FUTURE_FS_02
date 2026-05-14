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

  updateLead: async (leadId: string, data: Partial<Lead>) => {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update lead');
    return response.json();
  },

  addNote: async (leadId: string, content: string) => {
    const response = await fetch(`/api/leads/${leadId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, authorName: 'Admin' }),
    });
    if (!response.ok) throw new Error('Failed to add note');
    return response.json();
  },

  seedSampleData: async () => {
    const response = await fetch('/api/seed', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to seed sample data');
    return response.json();
  }
};
