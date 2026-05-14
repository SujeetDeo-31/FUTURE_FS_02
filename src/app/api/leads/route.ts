
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import { createLeadSchema } from '@/lib/validation';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-helpers';
import { withApiAuth } from '@/lib/auth-utils';

async function getHandler(request: NextRequest, context: { params: any }) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return successResponse(leads);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

async function postHandler(request: NextRequest, context: { params: any }) {
  try {
    await dbConnect();
    const body = await request.json();

    const validation = createLeadSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.formErrors.fieldErrors);
    }

    const lead = await Lead.create(validation.data);

    await Activity.create({
      type: 'lead',
      leadId: lead._id,
      leadName: lead.name,
      content: `New lead created: ${lead.name}`,
    });

    return successResponse(lead, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const GET = withApiAuth(getHandler);
export const POST = withApiAuth(postHandler);
