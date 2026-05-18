import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const { name, email, phone, company, source, status, priority, assignedTo } = body;

    const updatedLead = await Lead.findByIdAndUpdate(
      params.id,
      {
        name,
        email,
        phone,
        company,
        source,
        status,
        priority,
        assignedTo,
      },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error('Error updating lead:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deletedLead = await Lead.findByIdAndDelete(params.id);
    if (!deletedLead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Lead deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
