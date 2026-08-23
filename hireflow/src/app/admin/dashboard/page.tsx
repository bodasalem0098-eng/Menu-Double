'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Video, GitBranch, Settings, 
  Bell, LogOut, Menu, X, Scale, Briefcase, Eye, 
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('عبدالرحمن');
  const [isLoading, setIsLoading] = useState(true);

  // MOCK DATA
  const mockStats = {
    totalApplications: 124,
    newToday: 12,
    cvsViewed: 89,
    upcomingInterviews: 5
  };

  const mockApplications = [
    { id: 'APP-101', name: 'أحمد محمود', status: 'مستلم', date: '2023-10-25', statusColor: 'orange' },
    { id: 'APP-102', name: 'سارة خالد', status: 'مقابلة', date: '2023-10-24', statusColor: 'blue' },
    { id: 'APP-103', name: 'محمد علي', status: 'مقبول', date: '2023-10-22', statusColor: 'green' },
    { id: 'APP-104', name: 'فاطمة حسن', status: 'مرفوض', date: '2023-10-21', statusColor: 'red' },
    { id: 'APP-105', name: 'عمر مصطفى', status: 'مستلم', date: '2023-10-20', statusColor: 'orange' },
  ];

  const mockInterviews = [
    { id: 1, applicant: 'سارة خالد', time: 'غداً 10:00 ص', type: 'عن بعد' },
    { id: 2, applicant: 'يوسف جمال', time: 'غداً 01:00 م', type: 'حضوري' },
    { id: 3, applicant: 'نورة عبدالله', time: 'الخميس 11:30 ص', type: 'عن بعد' },
  ];

  const funnelData = [
    { name: 'مقدم', count: 124 },
    { name: 'مستلم', count: 98 },
    { name: 'مراجع', count: 65 },
    { name: 'مختصر', count: 24 },
    { name: 'مقابلة', count: 12 },
    { name: 'مقبول', count: 4 },
  ];

  const [stats, setStats] = useState(mockStats);
  const [applications, setApplications] = useState(mockApplications);
  const [interviews, setInterviews] = useState(mockInterviews);

  useEffect(() => {
    // Check auth
    const sessionStr = localStorage.getItem('adminSession');
    if (!sessionStr) {
      router.push('/admin');
      return;
    }

    try {
      const session = JSON.parse(sessionStr);
      if (!session.loggedIn) {
        router.push('/admin');
        return;
      }
      setAdminName(session.name || 'عبدالرحمن');
    } catch (e) {
      router.push('/admin');
      return;
    }

    // Simulate fetch from APIs
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin');
  };

  const getStatusBadge = (status: string, color: string) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorMap[color] || colorMap.orange}`}>
        {status}
      </span>
    );
  };

  const navItems = [
    { name: 'لوحة التحكم', href: '/admin/dashboard', icon: LayoutDashboard, active: true },
    { name: 'المتقدمين', href: '/admin/applicants', icon: Users, active: false },
    { name: 'المقابلات', href: '/admin/interviews', icon: Video, active: false },
    { name: 'خط الأنابيب', href: '/admin/pipeline', icon: GitBranch, active: false },
    { name: 'الإعدادات', href: '/admin/settings', icon: Settings, active: false },
  ];

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin text-orange-500">
          <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] flex font-inter text-[#0f172a]">
      {/* Sidebar - Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-orange-500">
            <Scale className="w-8 h-8" />
            <span className="font-sora font-bold text-xl text-gray-900">المستشار</span>
          </div>
          <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">القائمة الرئيسية</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${item.active 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ml-3 ${item.active ? 'text-orange-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700 ml-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-sora font-bold hidden sm:block">بوابة التوظيف <span className="text-orange-500">HireFlow</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-500 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{adminName}</p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold border border-orange-200">
                {adminName.charAt(0)}
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors mr-2 p-1 rounded-md hover:bg-red-50"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-sora mb-1">مرحباً {adminName} 👋</h2>
            <p className="text-gray-500">إليك ملخص التوظيف اليوم</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
              <div className="p-3 rounded-lg bg-orange-50 mr-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">طلبات جديدة اليوم</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newToday}</p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
              <div className="p-3 rounded-lg bg-green-50 mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">تم مراجعة السيرة الذاتية</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cvsViewed}</p>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 mr-4">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">المقابلات القادمة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingInterviews}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Applications Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg font-sora">أحدث الطلبات</h3>
                <Link href="/admin/applicants" className="text-sm text-orange-600 hover:text-orange-700 font-medium">عرض الكل</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">المتقدم</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ التقديم</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{app.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(app.status, app.statusColor)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-orange-600 hover:text-orange-900 bg-orange-50 px-3 py-1 rounded-md transition-colors">
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Interviews & Funnel */}
            <div className="space-y-8">
              {/* Upcoming Interviews */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg font-sora">المقابلات القادمة</h3>
                  <Link href="/admin/interviews" className="text-sm text-orange-600 hover:text-orange-700 font-medium">الجدول</Link>
                </div>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="flex items-start p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:border-orange-200 transition-colors">
                      <div className="p-2 bg-white rounded-full border border-gray-200 ml-3">
                        <Video className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{interview.applicant}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {interview.time}</span>
                          <span className="flex items-center gap-1 text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">{interview.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pipeline Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-lg font-sora mb-4">خط الأنابيب (التقدم)</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={70} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
