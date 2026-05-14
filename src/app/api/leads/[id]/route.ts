
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import Note from '@/models/Note';
import { updateLeadSchema } from '@/lib/validation';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-helpers';
import { withApiAuth } from '@/lib/auth-utils';

async function getLeadDetails(id: string) {
  const lead = await Lead.findById(id).lean();
  if (!lead) return null;

  const notes = await Note.find({ leadId: id }).sort({ createdAt: -1 });
  const activities = await Activity.find({ leadId: id }).sort({ createdAt: -1 });

  return {
    ...lead,
    notesHistory: notes,
    statusHistory: activities
      .filter((a) => a.type === 'status')
      .map((a) => ({
        timestamp: a.createdAt.toISOString(),
        oldStatus: a.metadata?.oldStatus || 'Unknown',
        newStatus: a.metadata?.newStatus || 'Unknown',
      })),
  };
}

async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const leadDetails = await getLeadDetails(id);

    if (!leadDetails) {
      return errorResponse('Lead not found', 404);
    }

    return successResponse(leadDetails);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

async function patchHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const validation = updateLeadSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.formErrors.fieldErrors);
    }

    const oldLead = await Lead.findById(id);
    if (!oldLead) {
      return errorResponse('Lead not found', 404);
    }

    const lead = await Lead.findByIdAndUpdate(id, validation.data, {
      new: true,
    });
    if (!lead) {
      return errorResponse('Lead not found', 404);
    }

    if (validation.data.status && validation.data.status !== oldLead.status) {
      await Activity.create({
        type: 'status',
        leadId: lead._id,
        leadName: lead.name,
        content: `Status updated from ${oldLead.status} to ${validation.data.status}`,
        metadata: {
          oldStatus: oldLead.status,
          newStatus: validation.data.status,
        },
      });
    } else {
      await Activity.create({
        type: 'note',
        leadId: lead._id,
        leadName: lead.name,
        content: `Lead profile details updated.`,
      });
    }

    return successResponse(lead);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await Lead.findByIdAndDelete(id);
    return successResponse({ message: 'Lead deleted' });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const GET = withApiAuth(getHandler);
export const PATCH = withApiAuth(patchHandler);
export const DELETE = withApiAuth(deleteHandler);
