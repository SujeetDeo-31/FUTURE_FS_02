import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { withApiAuth } from '@/lib/auth-utils';

async function getHandler() {
  try {
    await dbConnect();
    const reports = await Report.find({}).sort({ createdAt: -1 }).limit(10);
    return successResponse(reports);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

async function postHandler(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const report = await Report.create(body);
    return successResponse(report, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const GET = withApiAuth(getHandler);
export const POST = withApiAuth(postHandler);