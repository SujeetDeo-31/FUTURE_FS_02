
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Note from '@/models/Note';
import Activity from '@/models/Activity';
import { createNoteSchema } from '@/lib/validation';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-helpers';
import { withApiAuth } from '@/lib/auth-utils';

async function postHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const validation = createNoteSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.formErrors.fieldErrors);
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return errorResponse('Lead not found', 404);
    }

    const note = await Note.create({
      leadId: id,
      ...validation.data,
    });

    await Activity.create({
      type: 'note',
      leadId: id,
      leadName: lead.name,
      content: `Note added: ${validation.data.content.substring(0, 50)}${
        validation.data.content.length > 50 ? '...' : ''
      }`,
    });

    return successResponse(note, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const POST = withApiAuth(postHandler);
