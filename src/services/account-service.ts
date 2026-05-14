'use client';

export const AccountService = {
  getAccount: async () => {
    const response = await fetch('/api/account');
    if (!response.ok) throw new Error('Failed to fetch account');
    return response.json();
  },

  updateAccount: async (data: { name: string; bio: string }) => {
    const response = await fetch('/api/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update account');
    return response.json();
  },

  deductCredits: async (amount: number) => {
    const response = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to deduct credits');
    }
    return response.json();
  }
};
