import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    if (!decoded) return null;

    // Verify user still exists in database
    await dbConnect();
    const user = await User.findById(decoded.id).select('_id email role name isActive');
    
    if (!user || !user.isActive) return null;
    
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
  } catch (error) {
    return null;
  }
}

export function withAuth(handler, allowedRoles = []) {
  return async (req, ...args) => {
    try {
      const user = await verifyAuth(req);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Please login again' },
          { status: 401 }
        );
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { success: false, error: 'Forbidden - You do not have permission' },
          { status: 403 }
        );
      }

      // Add user to request
      req.user = user;
      
      return handler(req, ...args);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
