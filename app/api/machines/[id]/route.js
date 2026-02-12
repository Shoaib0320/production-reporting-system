import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { MachineService } from '@/lib/services/machine.service';

async function getHandler(req, { params }) {
  try {
    const machine = await MachineService.getById(params.id);
    
    return NextResponse.json({
      success: true,
      data: machine,
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
    const machine = await MachineService.update(params.id, body);
    
    return NextResponse.json({
      success: true,
      data: machine,
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
    await MachineService.delete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Machine deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler, ['admin']);
export const DELETE = withAuth(deleteHandler, ['admin']);
