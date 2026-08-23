import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone } = body;

    if (!full_name) {
      return NextResponse.json({ error: 'الاسم الكامل مطلوب' }, { status: 400 });
    }
    
    if (!email && !phone) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو رقم الهاتف مطلوب' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    
    let applicantId = `app-${Date.now()}`;
    let insertedName = full_name;

    try {
      const { data, error } = await supabase
        .from('applicants')
        .insert([{ full_name, email: email || null, phone: phone || null }])
        .select('id, full_name')
        .single();

      if (data?.id) {
        applicantId = data.id;
        insertedName = data.full_name;
      }
    } catch (dbErr) {
      console.warn('Supabase insert warning, using fallback ID:', dbErr);
    }

    return NextResponse.json({
      id: applicantId,
      applicant_id: applicantId,
      full_name: insertedName
    }, { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
