import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import Note from '@/models/Note';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const lead = await Lead.findById(id).lean();
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Fetch associated history
    const notes = await Note.find({ leadId: id }).sort({ createdAt: -1 });
    const activities = await Activity.find({ leadId: id }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      ...lead, 
      notesHistory: notes,
      statusHistory: activities.filter(a => a.type === 'status').map(a => ({
        timestamp: a.createdAt.toISOString(),
        oldStatus: a.metadata?.oldStatus || 'Unknown',
        newStatus: a.metadata?.newStatus || 'Unknown'
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const oldLead = await Lead.findById(id);
    if (!oldLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const lead = await Lead.findByIdAndUpdate(id, body, { new: true });
    
    // Log Status Change Activity if changed
    if (body.status && body.status !== oldLead.status) {
      await Activity.create({
        type: 'status',
        leadId: lead._id,
        leadName: lead.name,
        content: `Status updated from ${oldLead.status} to ${body.status}`,
        metadata: {
          oldStatus: oldLead.status,
          newStatus: body.status
        }
      });
    }

    // Log General Update Activity
    if (!body.statusUpdate && !body.status) {
      await Activity.create({
        type: 'note',
        leadId: lead._id,
        leadName: lead.name,
        content: `Lead profile details updated.`
      });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Lead deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
