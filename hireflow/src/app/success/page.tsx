"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Sparkles, Search } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden" dir="rtl">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-300/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative z-10">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-sora font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h1>
        
        <div className="my-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 font-inter">رقم الطلب</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xl font-mono font-bold text-gray-900" dir="ltr">#{code || "APP-XXXXX"}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <p className="text-gray-600 mb-8 font-inter leading-relaxed">
          تم استلام طلبك وسيقوم فريق التوظيف بمراجعته قريباً. يمكنك متابعة حالة طلبك باستخدام رقم الطلب.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/track" 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors font-medium"
          >
            <Search className="w-5 h-5" />
            متابعة حالة الطلب
          </Link>
          <Link 
            href="/" 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-medium border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
