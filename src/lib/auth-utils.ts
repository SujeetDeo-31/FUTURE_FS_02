
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/**
 * A generic API handler type that accepts a `params` object of a specific shape.
 * @template P The shape of the `params` object, defaulting to `any`.
 * @template R The resolved return type of the handler, which must be a `Response`.
 */
export type ApiHandler<P = any, R extends Response = NextResponse> = (
  req: NextRequest,
  context: { params: Promise<P> }
) => Promise<R>;

/**
 * A higher-order function to protect API routes with NextAuth session validation.
 * It is a generic function that preserves the parameter types of the wrapped handler.
 *
 * @template P The expected shape of the `params` object for the route handler.
 * @template R The resolved return type of the handler, which must be a `Response`.
 * @param {ApiHandler<P, R>} handler The API route handler to protect.
 * @returns {ApiHandler<P, Response>} The wrapped handler with authentication checks.
 */
export function withApiAuth<P, R extends Response>(
  handler: ApiHandler<P, R>
): ApiHandler<P, Response> {
  return async (req: NextRequest, context: { params: Promise<P> }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Authentication required. Please log in to access this resource.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // If authenticated, call the original handler.
    return handler(req, context);
  };
}

/**
 * A utility function to get the server session directly.
 * This can be used in components or other parts of the app that need to check for a session.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}
