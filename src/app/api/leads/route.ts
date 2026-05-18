import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET() {
  await dbConnect();
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      assignedTo,
      followUpDate,
      notes
    } = body;

    const leadData: any = {
      name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      followUpDate,
      assignedTo: assignedTo || 'Unassigned'
    };

    if (notes && Array.isArray(notes)) {
      leadData.notes = notes.filter(note => note.content && note.author);
    }

    const newLead = new Lead(leadData);

    await newLead.save();
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
