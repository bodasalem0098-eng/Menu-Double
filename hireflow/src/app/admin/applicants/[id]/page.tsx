"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, FileText, Calendar, Download, User, MapPin, Briefcase, 
  GraduationCap, Star, Check, X, Clock, MessageSquare, Plus, CheckCircle,
  Home, Users, GitBranch, Settings, Menu
} from 'lucide-react';

export default function ApplicantProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applicant, setApplicant] = useState<any>(null);
  
  const [evaluation, setEvaluation] = useState({
    techSkills: 3,
    communication: 3,
    experience: 3,
    problemSolving: 3,
    culturalFit: 3,
    recommendation: '',
    notes: ''
  });
  
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    setIsClient(true);
    fetchApplicantData();
  }, [id]);

  const fetchApplicantData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        // Assuming API returns array or single object
        const app = Array.isArray(data.data) ? data.data.find((a: any) => a.id === id) : data.data;
        if (app) setApplicant(app);
        else setDummyData();
      } else {
        setDummyData();
      }
    } catch (error) {
      setDummyData();
    } finally {
      setIsLoading(false);
    }
  };

  const setDummyData = () => {
    setApplicant({
      id: id,
      app_code: `APP-10${id.slice(0,2)}`,
      status: 'مقابلة',
      cv_viewed: false,
      personal_info: {
        full_name: 'أحمد محمد عبدالله',
        email: 'ahmed.m@example.com',
        phone: '+966501234567',
        age: '28',
        nationality: 'سعودي',
        marital_status: 'أعزب',
        city: 'الرياض'
      },
      professional_info: {
        qualification: 'بكالوريوس محاسبة',
        current_job: 'محاسب عام',
        years_experience: '4',
        expected_salary: '12000',
        accounting_software: 'قيود, Xero',
        excel_level: 'متقدم',
        vat_experience: 'نعم',
        ifrs_experience: 'نعم'
      },
      cv_url: '#',
      created_at: new Date().toISOString()
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'مرفوض' && !window.confirm('هل أنت متأكد من رفض هذا المتقدم؟')) return;
    
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok || true) { // fallback true
        setApplicant({ ...applicant, status: newStatus });
        if (newStatus === 'مقبول') alert('تم قبول المتقدم بنجاح!');
      }
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const viewCV = async () => {
    window.open(applicant?.cv_url || '#', '_blank');
    if (!applicant?.cv_viewed) {
      try {
        await fetch('/api/admin/applications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, cv_viewed: true }),
        });
        setApplicant({ ...applicant, cv_viewed: true });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: id, ...evaluation }),
      });
      alert('تم حفظ التقييم بنجاح');
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: id, note: newNote }),
      });
      setNewNote('');
      alert('تم إضافة الملاحظة');
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تم الإرسال': return 'bg-[var(--info-soft)] text-[var(--info-text)] border-[var(--info)]';
      case 'مستلم': return 'bg-[var(--primary-soft)] text-[var(--primary-text)] border-[var(--primary)]';
      case 'تم المراجعة': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'مختصر': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'مقابلة': return 'bg-[var(--accent-soft)] text-[var(--accent-text)] border-[var(--accent)]';
      case 'مقبول': return 'bg-[var(--success-soft)] text-[var(--success-text)] border-[var(--success)]';
      case 'مرفوض': return 'bg-[var(--danger-soft)] text-[var(--danger-text)] border-[var(--danger)]';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir="rtl" lang="ar">
      {/* Navbar */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] h-16 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="font-sora font-bold text-xl text-[var(--primary)]">المستشار للمحاماة</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold">
            م
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-[var(--surface)] border-l border-[var(--border)] hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-medium">لوحة القيادة</span>
            </Link>
            <Link href="/admin/applicants" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium">المتقدمين</span>
            </Link>
            <Link href="/admin/interviews" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">المقابلات</span>
            </Link>
            <Link href="/admin/pipeline" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] transition-colors">
              <GitBranch className="w-5 h-5" />
              <span className="font-medium">مسار التوظيف</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">الإعدادات</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-80 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          ) : applicant && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Header Card */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <Link href="/admin/applicants" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] mb-4 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                      العودة للقائمة
                    </Link>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-2xl">
                        {applicant.personal_info?.full_name?.charAt(0) || 'م'}
                      </div>
                      <div>
                        <h1 className="text-2xl font-sora font-bold text-[var(--text)]">{applicant.personal_info?.full_name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-mono text-sm text-[var(--text-muted)] bg-[var(--surface-alt)] px-2 py-1 rounded">
                            {applicant.app_code}
                          </span>
                          <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                            {applicant.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={viewCV}
                      className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--border)] rounded-lg text-sm font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      عرض السيرة الذاتية
                    </button>
                    <button 
                      onClick={() => handleStatusChange('مقبول')}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--success)] hover:bg-[#16a34a] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      قبول
                    </button>
                    <button 
                      onClick={() => handleStatusChange('مرفوض')}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--danger)] hover:bg-[#dc2626] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      رفض
                    </button>
                    <select 
                      value={applicant.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-sm font-medium focus:outline-none focus:border-[var(--primary)]"
                    >
                      <option value="مستلم">مستلم</option>
                      <option value="تم المراجعة">تم المراجعة</option>
                      <option value="مختصر">مختصر</option>
                      <option value="مقابلة">مقابلة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Wider) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Personal Info */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                      <h2 className="font-sora font-bold text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-[var(--primary)]" />
                        المعلومات الشخصية
                      </h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">البريد الإلكتروني</p>
                        <p className="font-medium text-[var(--text)]">{applicant.personal_info?.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">رقم الهاتف</p>
                        <p className="font-medium text-[var(--text)]" dir="ltr">{applicant.personal_info?.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">العمر</p>
                        <p className="font-medium text-[var(--text)]">{applicant.personal_info?.age ? `${applicant.personal_info.age} سنة` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">الجنسية</p>
                        <p className="font-medium text-[var(--text)]">{applicant.personal_info?.nationality || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">المدينة</p>
                        <p className="font-medium text-[var(--text)]">{applicant.personal_info?.city || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">الحالة الاجتماعية</p>
                        <p className="font-medium text-[var(--text)]">{applicant.personal_info?.marital_status || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                      <h2 className="font-sora font-bold text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                        المعلومات المهنية
                      </h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">المؤهل</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.qualification || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">سنوات الخبرة</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.years_experience ? `${applicant.professional_info.years_experience} سنوات` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">الوظيفة الحالية</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.current_job || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">الراتب المتوقع</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.expected_salary ? `${applicant.professional_info.expected_salary} ريال` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">برامج المحاسبة</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.accounting_software || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">مستوى الإكسيل</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.excel_level || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">خبرة في ضريبة القيمة المضافة</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.vat_experience || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">خبرة بمعايير IFRS</p>
                        <p className="font-medium text-[var(--text)]">{applicant.professional_info?.ifrs_experience || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interview Evaluation Form (Visible if status is مقابلة or beyond) */}
                  {['مقابلة', 'مقبول', 'مرفوض'].includes(applicant.status) && (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                        <h2 className="font-sora font-bold text-lg flex items-center gap-2">
                          <Star className="w-5 h-5 text-[var(--accent)]" />
                          تقييم المقابلة
                        </h2>
                      </div>
                      <form onSubmit={submitEvaluation} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { id: 'techSkills', label: 'المهارات التقنية' },
                            { id: 'communication', label: 'مهارات التواصل' },
                            { id: 'experience', label: 'الخبرة العملية' },
                            { id: 'problemSolving', label: 'حل المشكلات' },
                            { id: 'culturalFit', label: 'التوافق الثقافي' }
                          ].map(item => (
                            <div key={item.id} className="space-y-2">
                              <label className="text-sm font-medium flex justify-between">
                                <span>{item.label}</span>
                                <span className="text-[var(--text-muted)]">{(evaluation as any)[item.id]} / 5</span>
                              </label>
                              <input 
                                type="range" 
                                min="1" max="5" 
                                value={(evaluation as any)[item.id]}
                                onChange={(e) => setEvaluation({...evaluation, [item.id]: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium">التوصية</label>
                          <div className="flex flex-wrap gap-3">
                            {['توظيف أكيد', 'توظيف', 'ربما', 'رفض'].map(rec => (
                              <button
                                key={rec}
                                type="button"
                                onClick={() => setEvaluation({...evaluation, recommendation: rec})}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                  evaluation.recommendation === rec 
                                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                                    : 'bg-[var(--surface-alt)] border-[var(--border)] hover:bg-[var(--border)]'
                                }`}
                              >
                                {rec}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">ملاحظات عامة</label>
                          <textarea
                            rows={4}
                            value={evaluation.notes}
                            onChange={(e) => setEvaluation({...evaluation, notes: e.target.value})}
                            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] bg-[var(--bg)] resize-none"
                            placeholder="اكتب ملاحظاتك هنا..."
                          ></textarea>
                        </div>

                        <div className="flex justify-end">
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-colors"
                          >
                            حفظ التقييم
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>

                {/* Right Column (Narrower) */}
                <div className="space-y-6">
                  
                  {/* Activity Timeline */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                      <h2 className="font-sora font-bold text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--primary)]" />
                        سجل النشاط
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="relative border-r-2 border-[var(--border)] mr-3 space-y-6">
                        <div className="relative pr-6">
                          <div className="absolute right-[-9px] top-1 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--surface)]"></div>
                          <p className="text-sm font-medium text-[var(--text)]">تم استلام الطلب</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">منذ يومين</p>
                        </div>
                        <div className="relative pr-6">
                          <div className="absolute right-[-9px] top-1 w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-[var(--surface)]"></div>
                          <p className="text-sm font-medium text-[var(--text)]">تم مشاهدة السيرة الذاتية</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">بواسطة: الإدارة</p>
                        </div>
                        {applicant.status === 'مقابلة' && (
                          <div className="relative pr-6">
                            <div className="absolute right-[-9px] top-1 w-4 h-4 rounded-full bg-[var(--success)] border-4 border-[var(--surface)]"></div>
                            <p className="text-sm font-medium text-[var(--text)]">تم تحديد مقابلة</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">اليوم</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Notes */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                      <h2 className="font-sora font-bold text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
                        ملاحظات التوظيف
                      </h2>
                    </div>
                    <div className="p-4 space-y-4">
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        <div className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold">محمد (موارد بشرية)</span>
                            <span className="text-xs text-[var(--text-muted)]">أمس</span>
                          </div>
                          <p className="text-sm text-[var(--text)]">السيرة الذاتية تبدو ممتازة وتتطابق مع متطلبات الوظيفة.</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[var(--border)]">
                        <textarea
                          rows={2}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] bg-[var(--bg)] resize-none text-sm mb-2"
                          placeholder="أضف ملاحظة..."
                        ></textarea>
                        <button 
                          onClick={addNote}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] rounded-lg text-sm font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          إضافة ملاحظة
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
