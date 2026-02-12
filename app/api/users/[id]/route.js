import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { UserService } from '@/lib/services/user.service';

async function getHandler(req, { params }) {
  try {
    const user = await UserService.getById(params.id);
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

async function putHandler(req, { params }) {
  try {
    const body = await req.json();
    const user = await UserService.update(params.id, body);
    
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

async function deleteHandler(req, { params }) {
  try {
    await UserService.delete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ['admin']);
export const PUT = withAuth(putHandler, ['admin']);
export const DELETE = withAuth(deleteHandler, ['admin']);
