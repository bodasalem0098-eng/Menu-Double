/* ============================================
   HireFlow — Database Types
   ============================================ */

export interface Applicant {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  app_code: string; // APP-XXXXX
  applicant_id: string;
  job_id: string;
  status: string;
  // Personal info
  full_name: string;
  age: string;
  nationality: string;
  qualification: string;
  marital_status: string;
  city: string;
  // Professional info
  current_job: string | null;
  years_experience: string | null;
  expected_salary: string | null;
  accounting_software: string | null;
  excel_level: string | null;
  has_vat_experience: boolean | null;
  has_ifrs_experience: boolean | null;
  // Files
  cv_url: string | null;
  cv_filename: string | null;
  photo_url: string | null;
  photo_filename: string | null;
  // Tracking
  cv_viewed: boolean;
  cv_viewed_at: string | null;
  submitted_at: string;
  updated_at: string;
  // Relations
  applicant?: Applicant;
  interviews?: Interview[];
  activity_logs?: ActivityLog[];
  recruiter_notes?: RecruiterNote[];
}

export interface Interview {
  id: string;
  application_id: string;
  scheduled_by: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: string;
  meet_link: string | null;
  interviewer: string;
  notes: string | null;
  attendance_status: "SCHEDULED" | "WAITING" | "JOINED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";
  joined_at: string | null;
  created_at: string;
  // Relations
  application?: Application;
  evaluation?: InterviewEvaluation;
}

export interface InterviewEvaluation {
  id: string;
  interview_id: string;
  evaluator_id: string;
  technical: number;
  communication: number;
  experience: number;
  problem_solving: number;
  culture_fit: number;
  overall_score: number;
  recommendation: "STRONG_HIRE" | "HIRE" | "MAYBE" | "REJECT";
  notes: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  user_type: "applicant" | "recruiter";
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  application_id: string;
  action: string;
  details: string | null;
  performed_by: string;
  created_at: string;
}

export interface RecruiterNote {
  id: string;
  application_id: string;
  author_name: string;
  content: string;
  created_at: string;
}
