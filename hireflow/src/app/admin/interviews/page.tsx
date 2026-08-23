"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Clock,
  Video,
  UserX,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GripVertical
} from "lucide-react";

interface Interview {
  _id: string;
  applicant_id: string;
  applicant_name: string;
  date: string;
  time: string;
  duration_minutes: number;
  meet_link: string;
  attendance_status: string;
  evaluation_summary?: string;
}

interface Applicant {
  _id: string;
  name: string;
  status: string;
}

export default function InterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Modal State
  const [newInterview, setNewInterview] = useState({
    applicant_id: "",
    date: "",
    time: "",
    duration_minutes: 30,
    meet_link: "",
    notes: ""
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_session");
    if (!isAdmin) {
      router.push("/admin");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [interviewsRes, applicantsRes] = await Promise.all([
        fetch("/api/admin/interviews"),
        fetch("/api/admin/applications")
      ]);
      
      if (interviewsRes.ok) {
        const data = await interviewsRes.json();
        setInterviews(data);
      }
      
      if (applicantsRes.ok) {
        const data = await applicantsRes.json();
        // Only keep shortlisted or interview scheduled applicants for new scheduling
        setApplicants(data.filter((a: Applicant) => 
          ["SHORTLISTED", "INTERVIEW_SCHEDULED"].includes(a.status)
        ));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/interviews`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, attendance_status: status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInterview),
      });
      
      if (res.ok) {
        setShowScheduleModal(false);
        setNewInterview({
          applicant_id: "",
          date: "",
          time: "",
          duration_minutes: 30,
          meet_link: "",
          notes: ""
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const upcomingInterviews = interviews
    .filter(i => !["COMPLETED", "NO_SHOW", "CANCELLED"].includes(i.attendance_status))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const completedInterviews = interviews
    .filter(i => ["COMPLETED", "NO_SHOW", "CANCELLED"].includes(i.attendance_status))
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  // Simple overlap check logic
  const hasConflict = (interview: Interview) => {
    const startTime = new Date(`${interview.date}T${interview.time}`).getTime();
    const endTime = startTime + (interview.duration_minutes * 60000);
    
    return upcomingInterviews.some(other => {
      if (other._id === interview._id) return false;
      const otherStart = new Date(`${other.date}T${other.time}`).getTime();
      const otherEnd = otherStart + (other.duration_minutes * 60000);
      
      return (startTime < otherEnd && endTime > otherStart);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">مجدولة</span>;
      case 'WAITING': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">قيد الانتظار</span>;
      case 'JOINED': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">تم الحضور</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">مكتملة</span>;
      case 'NO_SHOW': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">لم يحضر</span>;
      case 'CANCELLED': return <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-md">ملغاة</span>;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-sora font-bold text-amber-600">المستشار</h1>
          <p className="text-sm text-gray-500 font-inter">بوابة التوظيف</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">لوحة القيادة</span>
          </Link>
          <Link href="/admin/pipeline" className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <GripVertical className="w-5 h-5" />
            <span className="font-medium">خط الأنابيب</span>
          </Link>
          <Link href="/admin/applicants" className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">المتقدمين</span>
          </Link>
          <Link href="/admin/interviews" className="flex items-center space-x-3 space-x-reverse px-4 py-3 bg-amber-50 text-amber-700 rounded-xl transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">المقابلات</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">الإعدادات</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center space-x-3 space-x-reverse px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-sora font-bold text-gray-800">المقابلات</h2>
            <p className="text-gray-500 font-inter mt-1">إدارة وجدولة المقابلات الشخصية</p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            جدولة مقابلة
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              القادمة
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "completed"
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              المكتملة
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div>
              {activeTab === "upcoming" ? (
                <div className="space-y-6">
                  {upcomingInterviews.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد مقابلات قادمة</h3>
                      <p className="text-gray-500">قم بجدولة مقابلة جديدة للبدء</p>
                    </div>
                  ) : (
                    <div className="relative border-r-2 border-amber-200 pr-6 space-y-8">
                      {upcomingInterviews.map((interview) => (
                        <div key={interview._id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -right-[31px] top-4 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm"></div>
                          
                          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">{interview.applicant_name}</h3>
                                  {getStatusBadge(interview.attendance_status)}
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                    <span dir="ltr">{interview.time}</span>
                                    <span>-</span>
                                    <span>{interview.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <span>المدة: {interview.duration_minutes} دقيقة</span>
                                  </div>
                                </div>

                                {hasConflict(interview) && (
                                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>تنبيه: يوجد تعارض في الوقت مع مقابلة أخرى!</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 min-w-[200px]">
                                {interview.meet_link && (
                                  <a 
                                    href={interview.meet_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
                                  >
                                    <Video className="w-4 h-4" />
                                    رابط الاجتماع
                                  </a>
                                )}
                                
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <button
                                    onClick={() => updateAttendance(interview._id, 'JOINED')}
                                    className="py-1.5 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded border border-gray-200 hover:border-green-200 text-xs font-medium transition-colors"
                                  >
                                    تم الحضور
                                  </button>
                                  <button
                                    onClick={() => updateAttendance(interview._id, 'COMPLETED')}
                                    className="py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded border border-gray-200 hover:border-blue-200 text-xs font-medium transition-colors"
                                  >
                                    اكتملت
                                  </button>
                                  <button
                                    onClick={() => updateAttendance(interview._id, 'NO_SHOW')}
                                    className="py-1.5 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded border border-gray-200 hover:border-red-200 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                  >
                                    <UserX className="w-3 h-3" />
                                    لم يحضر
                                  </button>
                                  <button
                                    onClick={() => updateAttendance(interview._id, 'CANCELLED')}
                                    className="py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {completedInterviews.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد مقابلات مكتملة</h3>
                    </div>
                  ) : (
                    completedInterviews.map((interview) => (
                      <div key={interview._id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{interview.applicant_name}</h3>
                            {getStatusBadge(interview.attendance_status)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {interview.date} | {interview.time} | {interview.duration_minutes} دقيقة
                          </div>
                          {interview.evaluation_summary && (
                            <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {interview.evaluation_summary}
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/admin/applicants/${interview.applicant_id}`}
                          className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
                        >
                          عرض الملف
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">جدولة مقابلة جديدة</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSchedule} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المتقدم</label>
                <select
                  required
                  value={newInterview.applicant_id}
                  onChange={(e) => setNewInterview({...newInterview, applicant_id: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="">اختر المتقدم...</option>
                  {applicants.map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({...newInterview, date: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
                  <input
                    type="time"
                    required
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({...newInterview, time: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدة (بالدقائق)</label>
                <input
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={newInterview.duration_minutes}
                  onChange={(e) => setNewInterview({...newInterview, duration_minutes: parseInt(e.target.value)})}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الاجتماع</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={newInterview.meet_link}
                  onChange={(e) => setNewInterview({...newInterview, meet_link: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-left"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
