import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { ProductionService } from '@/lib/services/production.service';

async function getHandler(req, { params }) {
  try {
    const production = await ProductionService.getById(params.id);
    // If requester is operator, ensure they own this production
    const requester = req.user;
    if (requester && requester.role === 'operator') {
      if (production.operatorId?._id?.toString() !== requester.id && production.operatorId?.toString() !== requester.id) {
        return NextResponse.json({ success: false, error: 'Forbidden - cannot view this production' }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      data: production,
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
    // attach requester for permission checks in service
    body._user = req.user;
    const production = await ProductionService.update(params.id, body);
    
    return NextResponse.json({
      success: true,
      data: production,
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
    await ProductionService.delete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Production deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ['admin', 'supervisor', 'operator']);
export const PUT = withAuth(putHandler, ['admin', 'supervisor']);
export const DELETE = withAuth(deleteHandler, ['admin']);
