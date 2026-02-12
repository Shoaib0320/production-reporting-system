import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.password || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'تمام فیلڈز ضروری ہیں' },
        { status: 400 }
      );
    }

    const result = await AuthService.register(body);
    
    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'رجسٹریشن ناکام ہو گئی' },
      { status: 400 }
    );
  }
}
