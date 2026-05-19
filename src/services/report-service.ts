'use client';

/**
 * @fileOverview Client-side service for managing AI reports via API.
 */

export const ReportService = {
  /**
   * Fetches the latest generated reports.
   */
  getReports: async () => {
    const response = await fetch('/api/reports');
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  /**
   * Saves a newly generated AI report.
   */
  saveReport: async (data: any) => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save report');
    return response.json();
  },

  /**
   * Deletes a specific report by ID.
   */
  deleteReport: async (id: string) => {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete report');
    return response.json();
  }
};
