import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { UserService } from '@/lib/services/user.service';

async function getHandler(req) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');

    // pass requester for scoping (supervisor -> operators only)
    const requester = req.user;
    const users = await UserService.getAll(role ? { role } : {}, requester);
    
    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function postHandler(req) {
  try {
    const body = await req.json();
    const user = await UserService.create(body);
    
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

export const GET = withAuth(getHandler, ['admin', 'supervisor']);
export const POST = withAuth(postHandler, ['admin']);
