"use client";

import React, { useState, useEffect, DragEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  GripVertical,
  ExternalLink,
} from "lucide-react";

interface Applicant {
  _id: string;
  name: string;
  application_code: string;
  qualification: string;
  status: string;
}

const COLUMNS = [
  { id: "SUBMITTED", title: "جديد", color: "bg-blue-50 text-blue-700 border-blue-200", borderColor: "border-t-blue-500" },
  { id: "CV_VIEWED", title: "تم المراجعة", color: "bg-yellow-50 text-yellow-700 border-yellow-200", borderColor: "border-t-yellow-500" },
  { id: "SHORTLISTED", title: "مختصر", color: "bg-orange-50 text-orange-700 border-orange-200", borderColor: "border-t-orange-500" },
  { id: "INTERVIEW_SCHEDULED", title: "مقابلة", color: "bg-purple-50 text-purple-700 border-purple-200", borderColor: "border-t-purple-500" },
  { id: "UNDER_REVIEW", title: "مراجعة نهائية", color: "bg-indigo-50 text-indigo-700 border-indigo-200", borderColor: "border-t-indigo-500" },
  { id: "ACCEPTED", title: "مقبول", color: "bg-green-50 text-green-700 border-green-200", borderColor: "border-t-green-500" },
  { id: "REJECTED", title: "مرفوض", color: "bg-red-50 text-red-700 border-red-200", borderColor: "border-t-red-500" },
];

export default function PipelinePage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_session");
    if (!isAdmin) {
      router.push("/admin");
    } else {
      fetchApplications();
    }
  }, [router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedAppId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedAppId) {
      const app = applications.find((a) => a._id === draggedAppId);
      if (app && app.status !== columnId) {
        updateApplicationStatus(draggedAppId, columnId);
      }
      setDraggedAppId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
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
          <Link href="/admin/pipeline" className="flex items-center space-x-3 space-x-reverse px-4 py-3 bg-amber-50 text-amber-700 rounded-xl transition-colors">
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
            <h2 className="text-2xl font-sora font-bold text-gray-800">خط الأنابيب</h2>
            <p className="text-gray-500 font-inter mt-1">إدارة مسار التوظيف وسحب وإفلات المرشحين</p>
          </div>
        </header>

        <div className="flex-1 overflow-x-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="flex space-x-6 space-x-reverse h-full pb-4 items-start min-w-max">
              {COLUMNS.map((column) => {
                const columnApps = applications.filter((app) => app.status === column.id);
                return (
                  <div
                    key={column.id}
                    className={`flex flex-col w-80 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full max-h-full`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className={`p-4 border-t-4 bg-white border-b border-gray-200 ${column.borderColor} flex justify-between items-center`}>
                      <h3 className="font-bold text-gray-800">{column.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${column.color}`}>
                        {columnApps.length}
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {columnApps.length === 0 ? (
                        <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                          اسحب المتقدمين إلى هنا
                        </div>
                      ) : (
                        columnApps.map((app) => (
                          <div
                            key={app._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, app._id)}
                            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 truncate pr-2">{app.name}</h4>
                              <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {app.application_code}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 truncate">{app.qualification}</p>
                            
                            <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                              <Link 
                                href={`/admin/applicants/${app._id}`}
                                className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium"
                              >
                                عرض الملف
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
