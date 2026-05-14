import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {
  successResponse,
  errorResponse,
} from '@/lib/api-helpers';
import { withApiAuth } from '@/lib/auth-utils';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';

async function getHandler(request: NextRequest, context: { params: any }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return errorResponse('Unauthorized', 401);
    }
    
    const email = session.user.email;
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a default one
      user = await User.create({ 
        email, 
        name: session.user.name || 'Admin User', 
        bio: 'Sales Lead at LeadFlow Enterprise.',
        aiCredits: 500
      });
    }

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

async function putHandler(request: NextRequest, context: { params: any }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return errorResponse('Unauthorized', 401);
    }

    const email = session.user.email;
    const body = await request.json();

    const { name, bio } = body;

    const user = await User.findOneAndUpdate(
      { email },
      { name, bio },
      { new: true, upsert: true }
    );

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// Special handler for deducting credits
async function patchHandler(request: NextRequest, context: { params: any }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return errorResponse('Unauthorized', 401);
    }

    const email = session.user.email;
    const { amount } = await request.json();

    const user = await User.findOne({ email });
    if (!user) return errorResponse('User not found', 404);

    if (user.aiCredits < amount) {
      return errorResponse('Insufficient AI credits', 400);
    }

    user.aiCredits -= amount;
    await user.save();

    return successResponse({ credits: user.aiCredits });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const GET = withApiAuth(getHandler);
export const PUT = withApiAuth(putHandler);
export const PATCH = withApiAuth(patchHandler);
