"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, ArrowLeft, Sparkles, Scale } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error("يرجى إدخال الاسم الرباعي");
      return;
    }
    
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني أو رقم الهاتف كحد أدنى");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء التسجيل");
      }

      const data = await res.json();
      router.push(`/apply?id=${data.applicant_id}`);
    } catch (error) {
      toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-slate-50 font-inter" dir="rtl" lang="ar">
      <Toaster position="top-center" />
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-[100px] mix-blend-multiply opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-300/20 blur-[120px] mix-blend-multiply opacity-70"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[80px] mix-blend-multiply opacity-50"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full p-6 z-10 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-sora font-bold text-xl text-slate-800 tracking-tight">المستشار</h1>
            <p className="text-xs text-slate-500 font-medium">للمحاماة والاستشارات القانونية</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-slate-600 tracking-wider uppercase">HireFlow</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="z-10 w-full max-w-md px-6 pt-20 pb-12">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-orange-900/5 rounded-3xl p-8 relative">
          
          <div className="absolute -top-12 inset-x-0 flex justify-center">
            <div className="bg-gradient-to-tr from-orange-500 to-amber-400 text-white p-4 rounded-2xl shadow-lg shadow-orange-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <User className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center mt-6 mb-8">
            <h2 className="text-2xl font-sora font-bold text-slate-800 mb-2">التقديم على وظيفة محاسب</h2>
            <p className="text-slate-500 text-sm">سجل بياناتك للبدء في خطوات التقديم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 mr-1 flex items-center gap-1">
                الاسم الرباعي <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="محمد أحمد عبدالله علي"
                  className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 pr-10 pl-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 mr-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@domain.com"
                  dir="ltr"
                  className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 pr-10 pl-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-left shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 mr-1">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05x xxx xxxx"
                  dir="ltr"
                  className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 pr-10 pl-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-left shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-slate-900 text-white rounded-xl py-3.5 px-4 font-semibold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>بدء التقديم</span>
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 z-10 text-center">
        <p className="text-xs text-slate-500 font-medium">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} المستشار للمحاماة
        </p>
      </footer>
    </div>
  );
}
