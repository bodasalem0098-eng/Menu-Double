import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interview_id, technical, communication, experience, problem_solving, culture_fit, recommendation, notes } = body;

    if (!interview_id) {
      return NextResponse.json({ error: 'معرف المقابلة مطلوب' }, { status: 400 });
    }

    const scores = [technical, communication, experience, problem_solving, culture_fit].map(s => Number(s) || 0);
    const overall_score = scores.reduce((a, b) => a + b, 0) / scores.length;

    const supabase = createServerSupabase();
    
    // Insert evaluation
    const { data, error } = await supabase
      .from('interview_evaluations')
      .insert([{
        interview_id,
        technical,
        communication,
        experience,
        problem_solving,
        culture_fit,
        overall_score,
        recommendation,
        notes
      }])
      .select()
      .single();

    if (error) throw error;

    // Update interview status
    await supabase
      .from('interviews')
      .update({ attendance_status: 'COMPLETED' })
      .eq('id', interview_id);

    // Get interview for application_id
    const { data: interview } = await supabase.from('interviews').select('application_id').eq('id', interview_id).single();

    if (interview) {
      await supabase.from('activity_logs').insert([{
        application_id: interview.application_id,
        action: 'تم تقييم المقابلة',
        created_by: 'admin'
      }]);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
