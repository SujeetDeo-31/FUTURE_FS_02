'use client';

export const ReportService = {
  getReports: async () => {
    const response = await fetch('/api/reports');
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  saveReport: async (data: any) => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save report');
    return response.json();
  }
};