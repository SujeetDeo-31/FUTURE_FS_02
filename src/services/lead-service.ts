'use client';

import { Lead } from '@/types/crm';

export const LeadService = {
  getLeads: async (): Promise<Lead[]> => {
    const response = await fetch('/api/leads');
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    return response.json();
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await fetch(`/api/leads/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lead');
    }
    return response.json();
  },

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

  deleteLead: async (leadId: string) => {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete lead');
    }
    return response.json().catch(() => ({})); 
  },

  addNote: async (leadId: string, content: string, author: string = 'Admin') => {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName: author }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      return response.json();
    },

  deleteNote: async (leadId: string, noteId: string) => {
    const response = await fetch(`/api/leads/${leadId}/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return response.json();
  },

    seedSampleData: async () => {
      const response = await fetch('/api/seed', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to seed sample data');
      return response.json();
    }
};
