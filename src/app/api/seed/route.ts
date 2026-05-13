import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { subMonths, subDays } from 'date-fns';

export async function POST() {
  try {
    await dbConnect();
    
    // Clear existing data (optional, but good for consistent demo)
    await Lead.deleteMany({});

    const now = new Date();
    const samples = [
      { 
        name: 'Sarah Jenkins', 
        company: 'TechCorp Solutions', 
        email: 'sarah.j@techcorp.io', 
        source: 'Website', 
        status: 'New', 
        priority: 'High', 
        createdAt: subDays(now, 2)
      },
      { 
        name: 'Michael Chen', 
        company: 'Global Infra', 
        email: 'm.chen@globalinfra.com', 
        source: 'Referral', 
        status: 'Qualified', 
        priority: 'Medium', 
        createdAt: subMonths(now, 1)
      },
      { 
        name: 'Elena Rodriguez', 
        company: 'Creative Pulse', 
        email: 'elena@creative-pulse.net', 
        source: 'Event', 
        status: 'Converted', 
        priority: 'High', 
        createdAt: subMonths(now, 2)
      },
      { 
        name: 'James Miller', 
        company: 'Vertex Systems', 
        email: 'james@vertex.io', 
        source: 'LinkedIn', 
        status: 'Proposal Sent', 
        priority: 'High', 
        createdAt: subDays(now, 5)
      },
      { 
        name: 'Sofia Garcia', 
        company: 'Bright Designs', 
        email: 'sofia@bright.net', 
        source: 'Referral', 
        status: 'Contacted', 
        priority: 'Medium', 
        createdAt: subDays(now, 10)
      }
    ];

    await Lead.insertMany(samples);

    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}