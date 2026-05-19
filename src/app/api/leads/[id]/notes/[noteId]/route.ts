import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  await dbConnect();
  try {
    const { id, noteId } = await params;
    
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    // Filter out the note
    const originalLength = lead.notes.length;
    // @ts-ignore - mongoose subdoc array pull
    lead.notes.pull({ _id: noteId });
    
    if (lead.notes.length === originalLength) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    await lead.save();

    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
