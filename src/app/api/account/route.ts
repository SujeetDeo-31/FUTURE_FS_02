
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

async function getHandler(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return errorResponse('Unauthorized', 401);
    }
    
    const email = session.user.email;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ 
        email, 
        name: session.user.name || 'Admin User', 
        bio: 'Sales Lead at LeadFlow Enterprise.',
        aiCredits: 500
      });
    } else if (user.aiCredits === undefined || user.aiCredits === null) {
      user.aiCredits = 500;
      await user.save();
    }

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

async function putHandler(request: NextRequest) {
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

async function patchHandler(request: NextRequest) {
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

    // Ensure credits exist
    if (user.aiCredits === undefined || user.aiCredits === null) {
      user.aiCredits = 500;
    }

    // Auto-refill logic for demo/dev experience
    if (user.aiCredits < amount) {
      user.aiCredits = 500;
    }

    // Deduct and prevent negative
    user.aiCredits = Math.max(0, user.aiCredits - amount);
    await user.save();

    return successResponse({ credits: user.aiCredits });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export const GET = withApiAuth(getHandler);
export const PUT = withApiAuth(putHandler);
export const PATCH = withApiAuth(patchHandler);
