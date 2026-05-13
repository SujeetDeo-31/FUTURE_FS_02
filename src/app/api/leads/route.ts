import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    let query: any = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("API /api/leads error:", error);
  
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const lead = await Lead.create(body);
    
    // Log Activity
    await Activity.create({
      type: 'lead',
      leadId: lead._id,
      leadName: lead.name,
      content: `New lead created: ${lead.name} from ${lead.company || 'N/A'}`
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error("API /api/leads error:", error);
  
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}