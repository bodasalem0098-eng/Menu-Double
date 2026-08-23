'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Upload, FileText, Image as ImageIcon, ArrowRight, ArrowLeft, 
  Check, AlertCircle, User, Briefcase, GraduationCap, ChevronRight,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const NATIONALITIES = [
  'سعودي/ة', 'مصري/ة', 'أردني/ة', 'سوري/ة', 'يمني/ة', 'سوداني/ة', 
  'فلسطيني/ة', 'لبناني/ة', 'عراقي/ة', 'تونسي/ة', 'مغربي/ة', 
  'جزائري/ة', 'باكستاني/ة', 'هندي/ة', 'فلبيني/ة', 'بنغلاديشي/ة', 'أخرى'
];

const QUALIFICATIONS = [
  'ثانوية عامة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', 'أخرى'
];

const MARITAL_STATUS = [
  'أعزب/عزباء', 'متزوج/ة', 'مطلق/ة', 'أرمل/ة'
];

const EXCEL_LEVELS = [
  'مبتدئ', 'متوسط', 'متقدم', 'خبير'
];

function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicantId = searchParams.get('id');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    nationality: '',
    qualification: '',
    marital_status: '',
    city: '',
    
    current_job: '',
    years_experience: '',
    expected_salary: '',
    accounting_software: '',
    excel_level: '',
    vat_experience: '',
    ifrs_experience: '',
  });

  // Files
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Ref for file inputs
  const cvInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If we want to pre-fill name from registration API, we could do it here
    // For now, we'll just require it
  }, [applicantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        toast.error('صيغة الملف غير مدعومة. يرجى رفع PDF أو Word.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الملف يتجاوز 5 ميجابايت.');
        return;
      }
      setCvFile(file);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('صيغة الصورة غير مدعومة. يرجى رفع JPG أو PNG.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم الصورة يتجاوز 2 ميجابايت.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.full_name) {
        toast.error('يرجى إدخال الاسم الكامل');
        return false;
      }
    }
    if (step === 3) {
      if (!cvFile) {
        toast.error('يرجى رفع السيرة الذاتية');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      if (applicantId) submitData.append('applicant_id', applicantId);
      
      // Append text data
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Append files
      if (cvFile) submitData.append('cv', cvFile);
      if (photoFile) submitData.append('photo', photoFile);

      const res = await fetch('/api/apply', {
        method: 'POST',
        body: submitData,
      });

      if (!res.ok) {
        throw new Error('حدث خطأ أثناء إرسال الطلب');
      }

      const data = await res.json();
      toast.success('تم إرسال الطلب بنجاح');
      router.push(`/success?code=${data.app_code || 'SUCCESS'}`);
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, title: 'المعلومات الشخصية', icon: User },
      { id: 2, title: 'المعلومات المهنية', icon: Briefcase },
      { id: 3, title: 'المستندات', icon: FileText },
      { id: 4, title: 'المراجعة', icon: Check }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border)] -z-10 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 right-0 h-1 bg-[var(--primary)] -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-[var(--bg)] px-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border-2
                    ${isActive ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 
                      isCompleted ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' : 
                      'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]'}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs md:text-sm font-medium ${isActive || isCompleted ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] font-inter text-[var(--text)]" dir="rtl">
      {/* Top Bar */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-sora font-bold text-[var(--primary)]">
            المستشار للمحاماة
          </h1>
          <div className="text-sm text-[var(--text-muted)] font-medium">
            طلب توظيف
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {renderStepIndicator()}

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm p-6 md:p-8 relative overflow-hidden">
          {/* Step 1 */}
          <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            <h2 className="text-2xl font-sora font-bold mb-6 text-[var(--text)] flex items-center gap-2">
              <User className="text-[var(--primary)] w-6 h-6" />
              المعلومات الشخصية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">الاسم الكامل <span className="text-[var(--danger)]">*</span></label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">العمر</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="مثال: 25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">الجنسية</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                >
                  <option value="">اختر الجنسية</option>
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">المؤهل العلمي</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                >
                  <option value="">اختر المؤهل</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">الحالة الاجتماعية</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                >
                  <option value="">اختر الحالة الاجتماعية</option>
                  {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">المدينة</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="المدينة التي تقيم بها"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`transition-all duration-300 ${step === 2 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            <h2 className="text-2xl font-sora font-bold mb-6 text-[var(--text)] flex items-center gap-2">
              <Briefcase className="text-[var(--primary)] w-6 h-6" />
              المعلومات المهنية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">الوظيفة الحالية</label>
                <input
                  type="text"
                  name="current_job"
                  value={formData.current_job}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="المسمى الوظيفي الحالي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">سنوات الخبرة</label>
                <input
                  type="number"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="عدد سنوات الخبرة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">الراتب المتوقع</label>
                <input
                  type="text"
                  name="expected_salary"
                  value={formData.expected_salary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="مثال: 5000 ريال"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">البرامج المحاسبية المستخدمة</label>
                <input
                  type="text"
                  name="accounting_software"
                  value={formData.accounting_software}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                  placeholder="مثال: قيود، سماك، زوهو..."
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">مستوى Excel</label>
                <select
                  name="excel_level"
                  value={formData.excel_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:border-[var(--primary)] transition-all"
                >
                  <option value="">اختر المستوى</option>
                  {EXCEL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-[var(--text)]">هل لديك خبرة في ضريبة القيمة المضافة؟</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggle('vat_experience', 'yes')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                      formData.vat_experience === 'yes' 
                        ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' 
                        : 'border-[var(--border-strong)] hover:border-[var(--primary)] bg-[var(--bg)]'
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle('vat_experience', 'no')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                      formData.vat_experience === 'no' 
                        ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' 
                        : 'border-[var(--border-strong)] hover:border-[var(--primary)] bg-[var(--bg)]'
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-[var(--text)]">هل لديك خبرة في معايير IFRS؟</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggle('ifrs_experience', 'yes')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                      formData.ifrs_experience === 'yes' 
                        ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' 
                        : 'border-[var(--border-strong)] hover:border-[var(--primary)] bg-[var(--bg)]'
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle('ifrs_experience', 'no')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                      formData.ifrs_experience === 'no' 
                        ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' 
                        : 'border-[var(--border-strong)] hover:border-[var(--primary)] bg-[var(--bg)]'
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`transition-all duration-300 ${step === 3 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            <h2 className="text-2xl font-sora font-bold mb-6 text-[var(--text)] flex items-center gap-2">
              <FileText className="text-[var(--primary)] w-6 h-6" />
              المستندات
            </h2>
            
            <div className="space-y-6">
              {/* CV Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">السيرة الذاتية <span className="text-[var(--danger)]">*</span></label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer
                    ${cvFile ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-[var(--border-strong)] hover:border-[var(--primary)] bg-[var(--bg)]'}`}
                  onClick={() => cvInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={cvInputRef}
                    onChange={handleCvChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  {cvFile ? (
                    <div className="flex flex-col items-center gap-2 text-[var(--primary)]">
                      <FileText className="w-10 h-10" />
                      <span className="font-medium">{cvFile.name}</span>
                      <span className="text-xs opacity-75">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                        className="mt-2 text-sm text-[var(--danger)] hover:underline flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> إزالة
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                      <Upload className="w-10 h-10 mb-2" />
                      <span className="font-medium text-[var(--text)]">اضغط لرفع السيرة الذاتية</span>
                      <span className="text-sm">أو قم بسحب وإفلات الملف هنا</span>
                      <span className="text-xs mt-2">صيغ مدعومة: PDF, DOC, DOCX (الحد الأقصى 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">الصورة الشخصية (اختياري)</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer
                    ${photoFile ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-[var(--border-strong)] hover:border-[var(--primary)] bg-[var(--bg)]'}`}
                  onClick={() => photoInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoChange}
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                  />
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-3 text-[var(--primary)]">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--primary)] shadow-sm">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{photoFile?.name}</span>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setPhotoFile(null); 
                          setPhotoPreview(null);
                        }}
                        className="text-sm text-[var(--danger)] hover:underline flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> إزالة
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="font-medium text-[var(--text)]">اضغط لرفع الصورة الشخصية</span>
                      <span className="text-xs mt-2">صيغ مدعومة: JPG, PNG (الحد الأقصى 2MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Review */}
          <div className={`transition-all duration-300 ${step === 4 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            <h2 className="text-2xl font-sora font-bold mb-6 text-[var(--text)] flex items-center gap-2">
              <Check className="text-[var(--primary)] w-6 h-6" />
              المراجعة والإرسال
            </h2>
            
            <div className="space-y-6">
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-5">
                <h3 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
                  <User className="w-5 h-5 text-[var(--primary)]" />
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-muted)] block mb-1">الاسم الكامل:</span> <span className="font-medium">{formData.full_name || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">العمر:</span> <span className="font-medium">{formData.age || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">الجنسية:</span> <span className="font-medium">{formData.nationality || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">المؤهل:</span> <span className="font-medium">{formData.qualification || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">المدينة:</span> <span className="font-medium">{formData.city || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">الحالة الاجتماعية:</span> <span className="font-medium">{formData.marital_status || '-'}</span></div>
                </div>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-5">
                <h3 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
                  <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                  المعلومات المهنية
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-muted)] block mb-1">الوظيفة الحالية:</span> <span className="font-medium">{formData.current_job || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">سنوات الخبرة:</span> <span className="font-medium">{formData.years_experience || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">الراتب المتوقع:</span> <span className="font-medium">{formData.expected_salary || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">مستوى Excel:</span> <span className="font-medium">{formData.excel_level || '-'}</span></div>
                  <div className="col-span-2"><span className="text-[var(--text-muted)] block mb-1">البرامج المحاسبية:</span> <span className="font-medium">{formData.accounting_software || '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">خبرة VAT:</span> <span className="font-medium">{formData.vat_experience === 'yes' ? 'نعم' : formData.vat_experience === 'no' ? 'لا' : '-'}</span></div>
                  <div><span className="text-[var(--text-muted)] block mb-1">خبرة IFRS:</span> <span className="font-medium">{formData.ifrs_experience === 'yes' ? 'نعم' : formData.ifrs_experience === 'no' ? 'لا' : '-'}</span></div>
                </div>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-5">
                <h3 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
                  <FileText className="w-5 h-5 text-[var(--primary)]" />
                  المستندات
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)]">السيرة الذاتية:</span>
                    <span className="font-medium truncate">{cvFile ? cvFile.name : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)]">الصورة الشخصية:</span>
                    <span className="font-medium truncate">{photoFile ? photoFile.name : 'لم يتم الرفع'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 p-4 bg-[var(--info-soft)] text-[var(--info-text)] rounded-xl items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">أقر بأن جميع البيانات المدخلة صحيحة، وأتحمل المسؤولية في حال ثبوت عكس ذلك.</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors
                ${step === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-[var(--text)] hover:bg-[var(--surface-alt)] border border-[var(--border)]'}`}
            >
              <ArrowRight className="w-5 h-5" />
              السابق
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
              >
                التالي
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>جاري الإرسال...</>
                ) : (
                  <>
                    إرسال الطلب
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--surface)] p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-sm w-full mx-4">
            <div className="w-12 h-12 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            <p className="text-lg font-bold text-[var(--text)]">جاري إرسال طلبك...</p>
            <p className="text-sm text-[var(--text-muted)] text-center">يرجى الانتظار وعدم إغلاق الصفحة</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)]" dir="rtl"><div className="animate-spin w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full"></div></div>}>
      <ApplicationForm />
    </Suspense>
  );
}
