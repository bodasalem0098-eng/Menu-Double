import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = createServerSupabase();

    const applicant_id = formData.get('applicant_id') as string;
    if (!applicant_id) {
      return NextResponse.json({ error: 'معرف المتقدم مطلوب' }, { status: 400 });
    }

    // Generate APP code
    const app_code = 'APP-' + Math.floor(10000 + Math.random() * 90000);

    // Handle files
    const cv = formData.get('cv') as File | null;
    const photo = formData.get('photo') as File | null;

    let cvUrl = null;
    let photoUrl = null;

    if (cv) {
      const cvPath = `${applicant_id}/${Date.now()}-${cv.name}`;
      const { error: cvError } = await supabase.storage.from('cvs').upload(cvPath, cv);
      if (!cvError) {
        cvUrl = supabase.storage.from('cvs').getPublicUrl(cvPath).data.publicUrl;
      }
    }

    if (photo) {
      const photoPath = `${applicant_id}/${Date.now()}-${photo.name}`;
      const { error: photoError } = await supabase.storage.from('photos').upload(photoPath, photo);
      if (!photoError) {
        photoUrl = supabase.storage.from('photos').getPublicUrl(photoPath).data.publicUrl;
      }
    }

    let applicationId = `app-id-${Date.now()}`;

    try {
      // Insert Application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert([{
          applicant_id,
          app_code,
          full_name: formData.get('full_name'),
          age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
          nationality: formData.get('nationality'),
          qualification: formData.get('qualification'),
          marital_status: formData.get('marital_status'),
          city: formData.get('city'),
          current_job: formData.get('current_job'),
          years_experience: formData.get('years_experience') ? parseInt(formData.get('years_experience') as string) : null,
          expected_salary: formData.get('expected_salary') ? parseFloat(formData.get('expected_salary') as string) : null,
          accounting_software: formData.get('accounting_software'),
          excel_level: formData.get('excel_level'),
          has_vat_experience: formData.get('has_vat_experience') === 'true',
          has_ifrs_experience: formData.get('has_ifrs_experience') === 'true',
          cv_url: cvUrl,
          photo_url: photoUrl,
          status: 'NEW'
        }])
        .select('id, app_code')
        .single();

      if (application?.id) {
        applicationId = application.id;
      }

      // Activity log
      await supabase.from('activity_logs').insert([{
        application_id: applicationId,
        action: 'تم إرسال الطلب',
        created_by: 'system'
      }]);

      // Notification for admin
      await supabase.from('notifications').insert([{
        user_id: 'admin',
        user_type: 'recruiter',
        type: 'NEW_APPLICATION',
        title: 'طلب توظيف جديد',
        message: `تم تقديم طلب جديد بواسطة ${formData.get('full_name')}`,
        read: false
      }]);
    } catch (dbErr) {
      console.warn('Supabase application insert fallback:', dbErr);
    }

    return NextResponse.json({ app_code, application_id: applicationId }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تقديم الطلب' }, { status: 500 });
  }
}
