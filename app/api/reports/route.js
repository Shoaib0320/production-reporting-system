import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { ReportService } from '@/lib/services/report.service';

async function getHandler(req) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date');
    
    if (date) {
      const report = await ReportService.getDailyReport(date);
      return NextResponse.json({
        success: true,
        data: report,
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Date parameter required',
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ['admin', 'supervisor']);
