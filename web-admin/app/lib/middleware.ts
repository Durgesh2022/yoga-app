// lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate requests
 */
export async function authenticate(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            message: 'Authentication required. Please login.',
          },
          { status: 401 }
        ),
      };
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            message: 'Invalid or expired token. Please login again.',
          },
          { status: 401 }
        ),
      };
    }

    return {
      authenticated: true,
      user: decoded,
    };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          message: 'Authentication failed',
        },
        { status: 401 }
      ),
    };
  }
}

/**
 * Middleware to check if user is admin
 */
export async function requireAdmin(request: NextRequest): Promise<{
  authorized: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  const authResult = await authenticate(request);

  if (!authResult.authenticated) {
    return {
      authorized: false,
      response: authResult.response,
    };
  }

  if (authResult.user?.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: 'Access denied. Admin privileges required.',
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: authResult.user,
  };
}

/**
 * Middleware to check if user is astrologer
 */
export async function requireAstrologer(request: NextRequest): Promise<{
  authorized: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  const authResult = await authenticate(request);

  if (!authResult.authenticated) {
    return {
      authorized: false,
      response: authResult.response,
    };
  }

  if (authResult.user?.role !== 'astrologer') {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: 'Access denied. Astrologer privileges required.',
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: authResult.user,
  };
}