import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'ای میل اور پاس ورڈ ضروری ہیں' },
        { status: 400 }
      );
    }

    const result = await AuthService.login(email, password);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'لاگ ان ناکام ہو گیا' },
      { status: 401 }
    );
  }
}
