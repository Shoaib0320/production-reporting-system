import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { AuthService } from '@/lib/services/auth.service';

async function handler(req) {
  try {
    const user = await AuthService.getCurrentUser(req.user.id);
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
