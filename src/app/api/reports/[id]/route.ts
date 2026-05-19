import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { withApiAuth } from '@/lib/auth-utils';

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return errorResponse('Report not found', 404);
    }
    
    return successResponse({ message: 'Report deleted successfully' });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const DELETE = withApiAuth(deleteHandler);
