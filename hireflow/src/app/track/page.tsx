"use client";

import { useState } from "react";
import { Search, CheckCircle2, Circle, Clock, Video, FileText, ArrowLeft, Loader2, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";

const STAGES = [
  { id: "SUBMITTED", label: "تم الإرسال" },
  { id: "RECEIVED", label: "تم الاستلام" },
  { id: "CV_VIEWED", label: "تم مراجعة السيرة الذاتية" },
  { id: "SHORTLISTED", label: "في القائمة المختصرة" },
  { id: "INTERVIEW_SCHEDULED", label: "تم جدولة المقابلة" },
  { id: "INTERVIEW_COMPLETED", label: "تمت المقابلة" },
  { id: "UNDER_REVIEW", label: "تحت المراجعة" },
  { id: "DECISION", label: "القرار النهائي" },
];

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // MOCK FETCH /api/track?q={query}
      // Since there's no backend provided, we'll simulate a response.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (query.includes("404")) {
        setError("لم يتم العثور على طلب بهذه البيانات");
      } else {
        setResult({
          code: query.startsWith("APP-") ? query : "APP-98765",
          jobTitle: "محامي شركات",
          currentStage: "INTERVIEW_SCHEDULED",
          interview: {
            date: "2026-08-30",
            time: "10:00 ص",
            link: "https://meet.google.com/abc-defg-hij"
          }
        });
      }
    } catch (err) {
      setError("حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const currentStageIndex = result ? STAGES.findIndex(s => s.id === result.currentStage) : -1;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-sora font-bold text-gray-900 mb-3">متابعة حالة الطلب</h1>
            <p className="text-gray-500 font-inter">أدخل رقم الطلب (APP-XXXXX) أو البريد الإلكتروني للتحقق من حالة طلبك</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="رقم الطلب أو البريد الإلكتروني أو رقم الهاتف..."
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-900 font-inter"
                dir="auto"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="py-3.5 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center min-w-[120px] disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "بحث"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-sora font-bold text-gray-900">{result.jobTitle}</h2>
                </div>
                <div className="text-gray-500 font-mono text-sm" dir="ltr">{result.code}</div>
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                {STAGES[currentStageIndex]?.label}
              </div>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute right-4 top-4 bottom-4 w-0.5 bg-gray-100" />

              <div className="space-y-8 relative">
                {STAGES.map((stage, index) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  const isFuture = index > currentStageIndex;

                  return (
                    <div key={stage.id} className={`flex items-start gap-4 ${isFuture ? 'opacity-50' : ''}`}>
                      <div className="relative z-10 bg-white rounded-full">
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                        ) : isCurrent ? (
                          <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center bg-amber-50">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          </div>
                        ) : (
                          <Circle className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className={`flex-1 pt-1 ${isCurrent ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {stage.label}
                        
                        {isCurrent && stage.id === "INTERVIEW_SCHEDULED" && result.interview && (
                          <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl font-normal">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              تفاصيل المقابلة
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span>{result.interview.date}</span>
                              </div>
                              <div className="flex items-center gap-3 text-gray-700">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span>{result.interview.time}</span>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-amber-200/50">
                              <a 
                                href={result.interview.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
                              >
                                <Video className="w-5 h-5" />
                                الانضمام للاجتماع (Google Meet)
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
