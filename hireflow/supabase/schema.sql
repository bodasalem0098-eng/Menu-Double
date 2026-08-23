-- ============================================
-- HireFlow — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Applicants (registered via the public form)
CREATE TABLE IF NOT EXISTS applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_code TEXT UNIQUE NOT NULL, -- APP-XXXXX
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL DEFAULT 'accountant-001',
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  -- Personal
  full_name TEXT NOT NULL,
  age TEXT,
  nationality TEXT,
  qualification TEXT,
  marital_status TEXT,
  city TEXT,
  -- Professional
  current_job TEXT,
  years_experience TEXT,
  expected_salary TEXT,
  accounting_software TEXT,
  excel_level TEXT,
  has_vat_experience BOOLEAN DEFAULT FALSE,
  has_ifrs_experience BOOLEAN DEFAULT FALSE,
  -- Files
  cv_url TEXT,
  cv_filename TEXT,
  photo_url TEXT,
  photo_filename TEXT,
  -- Tracking
  cv_viewed BOOLEAN DEFAULT FALSE,
  cv_viewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Interviews
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_by TEXT DEFAULT 'عبدالرحمن',
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  type TEXT DEFAULT 'Google Meet',
  meet_link TEXT,
  interviewer TEXT DEFAULT 'عبدالرحمن',
  notes TEXT,
  attendance_status TEXT DEFAULT 'SCHEDULED',
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Interview Evaluations
CREATE TABLE IF NOT EXISTS interview_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  evaluator_id TEXT DEFAULT 'admin',
  technical INTEGER CHECK (technical BETWEEN 1 AND 5),
  communication INTEGER CHECK (communication BETWEEN 1 AND 5),
  experience INTEGER CHECK (experience BETWEEN 1 AND 5),
  problem_solving INTEGER CHECK (problem_solving BETWEEN 1 AND 5),
  culture_fit INTEGER CHECK (culture_fit BETWEEN 1 AND 5),
  overall_score NUMERIC(3,1),
  recommendation TEXT CHECK (recommendation IN ('STRONG_HIRE','HIRE','MAYBE','REJECT')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'applicant',
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  performed_by TEXT DEFAULT 'النظام',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Recruiter Notes
CREATE TABLE IF NOT EXISTS recruiter_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  author_name TEXT DEFAULT 'عبدالرحمن',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_app_code ON applications(app_code);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_application ON activity_logs(application_id);

-- ============================================
-- Row Level Security (public access for now — tighten later)
-- ============================================
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notes ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for applicants (registration)
CREATE POLICY "Allow public insert" ON applicants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own" ON applicants FOR SELECT USING (true);

-- Applications: public insert, read own
CREATE POLICY "Allow public insert" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON applications FOR UPDATE USING (true);

-- Interviews: public read
CREATE POLICY "Allow public select" ON interviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON interviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON interviews FOR UPDATE USING (true);

-- Evaluations
CREATE POLICY "Allow all" ON interview_evaluations FOR ALL USING (true);

-- Notifications
CREATE POLICY "Allow all" ON notifications FOR ALL USING (true);

-- Activity logs
CREATE POLICY "Allow all" ON activity_logs FOR ALL USING (true);

-- Recruiter notes
CREATE POLICY "Allow all" ON recruiter_notes FOR ALL USING (true);

-- ============================================
-- Storage buckets (run separately or via dashboard)
-- ============================================
-- Create these buckets in Supabase Dashboard → Storage:
-- 1. "cvs" (private)
-- 2. "photos" (public)
