import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { MachineService } from '@/lib/services/machine.service';

async function getHandler() {
  try {
    const machines = await MachineService.getAll({ isActive: true });
    
    return NextResponse.json({
      success: true,
      data: machines,
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
    const machine = await MachineService.create(body);
    
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

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler, ['admin']);
