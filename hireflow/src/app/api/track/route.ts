import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ error: 'معلمة البحث مطلوبة' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    let applicationQuery = supabase
      .from('applications')
      .select(`
        *,
        applicants (*),
        interviews (*)
      `);

    if (q.startsWith('APP-')) {
      applicationQuery = applicationQuery.eq('app_code', q.toUpperCase());
    } else {
      // Find applicant first
      const { data: applicants, error: applicantError } = await supabase
        .from('applicants')
        .select('id')
        .or(`email.eq.${q},phone.eq.${q}`);
        
      if (applicantError || !applicants || applicants.length === 0) {
        return NextResponse.json({ error: 'لم يتم العثور على طلب' }, { status: 404 });
      }
      
      const applicantIds = applicants.map(a => a.id);
      applicationQuery = applicationQuery.in('applicant_id', applicantIds);
    }

    const { data: applications, error } = await applicationQuery.order('created_at', { ascending: false }).limit(1);

    if (error || !applications || applications.length === 0) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب' }, { status: 404 });
    }

    return NextResponse.json(applications[0]);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
