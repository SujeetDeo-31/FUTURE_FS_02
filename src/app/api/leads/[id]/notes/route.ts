import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Note from '@/models/Note';
import Activity from '@/models/Activity';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { content, authorName } = await request.json();

    const lead = await Lead.findById(id);
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const note = await Note.create({
      leadId: id,
      content,
      authorName: authorName || 'Admin'
    });

    // Log as activity
    await Activity.create({
      type: 'note',
      leadId: id,
      leadName: lead.name,
      content: `Note added: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
