import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        applications (*)
      `)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { application_id, date, time, duration, type, meet_link, interviewer, notes } = body;

    const supabase = createServerSupabase();

    const { data: interview, error } = await supabase
      .from('interviews')
      .insert([{ application_id, date, time, duration, type, meet_link, interviewer, notes, attendance_status: 'SCHEDULED' }])
      .select()
      .single();

    if (error) throw error;

    // Update app status
    await supabase
      .from('applications')
      .update({ status: 'INTERVIEW_SCHEDULED' })
      .eq('id', application_id);

    // Log activity
    await supabase.from('activity_logs').insert([{
      application_id,
      action: 'تم جدولة مقابلة',
      created_by: 'admin'
    }]);

    // Get applicant ID for notification
    const { data: appData } = await supabase.from('applications').select('applicant_id').eq('id', application_id).single();

    if (appData) {
      await supabase.from('notifications').insert([{
        user_id: appData.applicant_id,
        user_type: 'applicant',
        type: 'INTERVIEW_SCHEDULED',
        title: 'تم تحديد موعد مقابلة',
        message: `تم تحديد موعد مقابلة بتاريخ ${date} الساعة ${time}`,
        read: false
      }]);
    }

    return NextResponse.json(interview, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, attendance_status, ...otherUpdates } = body;

    const supabase = createServerSupabase();
    let updates = { ...otherUpdates };
    
    if (attendance_status) {
      updates.attendance_status = attendance_status;
    }

    const { data, error } = await supabase
      .from('interviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
