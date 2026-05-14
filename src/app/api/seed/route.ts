import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { subMonths, subDays } from 'date-fns';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await Lead.deleteMany({});

    const now = new Date();
    const sampleLeads = [
      {
        name: 'Sarah Jenkins',
        company: 'TechCorp Solutions',
        email: 'sarah.j@techcorp.io',
        source: 'Website',
        status: 'New',
        priority: 'High',
        createdAt: subDays(now, 2),
      },
      {
        name: 'Michael Chen',
        company: 'Global Infra',
        email: 'm.chen@globalinfra.com',
        source: 'Referral',
        status: 'Qualified',
        priority: 'Medium',
        createdAt: subMonths(now, 1),
      },
      {
        name: 'Elena Rodriguez',
        company: 'Creative Pulse',
        email: 'elena@creative-pulse.net',
        source: 'Event',
        status: 'Converted',
        priority: 'High',
        createdAt: subMonths(now, 2),
      },
      {
        name: 'James Miller',
        company: 'Vertex Systems',
        email: 'james@vertex.io',
        source: 'LinkedIn',
        status: 'Proposal Sent',
        priority: 'High',
        createdAt: subDays(now, 5),
      },
      {
        name: 'Sofia Garcia',
        company: 'Bright Designs',
        email: 'sofia@bright.net',
        source: 'Referral',
        status: 'Contacted',
        priority: 'Medium',
        createdAt: subDays(now, 10),
      },
    ];

    await Lead.insertMany(sampleLeads);

    return successResponse({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
