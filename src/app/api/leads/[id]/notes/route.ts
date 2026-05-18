
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const { content, authorName } = await request.json();

    if (!content || !authorName) {
      return NextResponse.json({ message: 'Content and author are required' }, { status: 400 });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    lead.notes.push({ content, author: authorName });
    await lead.save();

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
