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
  Save,
  User,
  Building2,
  GripVertical
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  const [accountInfo, setAccountInfo] = useState({
    name: "عبدالرحمن",
    email: "moabdo038@gmail.com"
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: "المستشار للمحاماة",
    slogan: "نسعى لتقديم أفضل الخدمات القانونية والاستشارية"
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_session");
    if (!isAdmin) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("تم حفظ معلومات الحساب بنجاح");
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("تم حفظ معلومات الشركة بنجاح");
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
          <Link href="/admin/interviews" className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">المقابلات</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 space-x-reverse px-4 py-3 bg-amber-50 text-amber-700 rounded-xl transition-colors">
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
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-6 shrink-0">
          <h2 className="text-2xl font-sora font-bold text-gray-800">الإعدادات</h2>
          <p className="text-gray-500 font-inter mt-1">إدارة إعدادات النظام ومعلومات الحساب</p>
        </header>

        <div className="p-6 max-w-4xl space-y-8">
          
          {/* Account Settings */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
              <User className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-800 text-lg">معلومات الحساب</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveAccount} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    required
                    value={accountInfo.name}
                    onChange={(e) => setAccountInfo({...accountInfo, name: e.target.value})}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    readOnly
                    value={accountInfo.email}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني الخاص بمسؤول النظام الأساسي.</p>
                </div>
                <div className="pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Company Settings */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
              <Building2 className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-800 text-lg">معلومات الشركة</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveCompany} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة</label>
                  <input
                    type="text"
                    required
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الشعار اللفظي (Slogan)</label>
                  <input
                    type="text"
                    value={companyInfo.slogan}
                    onChange={(e) => setCompanyInfo({...companyInfo, slogan: e.target.value})}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3 bg-red-50/50">
              <LogOut className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-700 text-lg">تسجيل الخروج</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm">سيتم تسجيل خروجك من النظام وسيتعين عليك تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم.</p>
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                تسجيل الخروج من الحساب
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
