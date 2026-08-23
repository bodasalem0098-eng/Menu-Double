import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    
    // Get total applications
    const { count: totalApps, error: err1 } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    // Group by status
    const { data: appsByStatus, error: err2 } = await supabase
      .from('applications')
      .select('status');
      
    const by_status = appsByStatus?.reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {}) || {};

    // New today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: newToday, error: err3 } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // CV viewed
    const { count: cvViewed, error: err4 } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('cv_viewed', true);

    // Interviews stats
    const todayStr = today.toISOString().split('T')[0];
    const { count: upcomingInterviews, error: err5 } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .gte('date', todayStr);

    const { count: completedInterviews, error: err6 } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .eq('attendance_status', 'COMPLETED');

    const { count: noShows, error: err7 } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .eq('attendance_status', 'NO_SHOW');

    if (err1 || err2 || err3 || err4 || err5 || err6 || err7) {
      console.error('Error fetching stats');
    }

    const stats = {
      total_applications: totalApps || 0,
      by_status,
      new_today: newToday || 0,
      cv_viewed: cvViewed || 0,
      upcoming_interviews: upcomingInterviews || 0,
      completed_interviews: completedInterviews || 0,
      no_shows: noShows || 0
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
