import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { ProductionService } from '@/lib/services/production.service';

async function getHandler(req) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams);
    
    const result = await ProductionService.getAll(searchParams, req.user);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
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
    const production = await ProductionService.create(body, req.user);
    
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

export const GET = withAuth(getHandler, ['admin', 'supervisor', 'operator']);
export const POST = withAuth(postHandler, ['admin', 'supervisor', 'operator']);
