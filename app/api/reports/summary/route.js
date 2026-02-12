import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { ReportService } from '@/lib/services/report.service';

async function getHandler() {
  try {
    const summary = await ReportService.getSummary();
    
    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ['admin', 'supervisor']);
