import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const supabase = createServerSupabase();

    let query = supabase
      .from('applications')
      .select(`
        *,
        applicants (*)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      // Searching full_name in applications or email/phone in applicants
      query = query.or(`full_name.ilike.%${search}%,app_code.ilike.%${search}%`);
      // Note: Advanced relational filtering requires separate queries or RPC in Supabase,
      // but matching name and code is a good start.
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'المعرف والحالة مطلوبان' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    
    let updates: any = { status };
    
    if (status === 'CV_VIEWED') {
      updates.cv_viewed = true;
      updates.cv_viewed_at = new Date().toISOString();
    }

    const { data: updatedApp, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('activity_logs').insert([{
      application_id: id,
      action: `تم تحديث الحالة إلى ${status}`,
      created_by: 'admin'
    }]);

    // Notify applicant (assuming user_id is the applicant's email or phone for simplicity)
    await supabase.from('notifications').insert([{
      user_id: updatedApp.applicant_id,
      user_type: 'applicant',
      type: 'STATUS_UPDATE',
      title: 'تحديث حالة الطلب',
      message: `تم تحديث حالة طلبك إلى ${status}`,
      read: false
    }]);

    return NextResponse.json(updatedApp);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
