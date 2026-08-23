'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Accept any email/password for now
      localStorage.setItem('adminSession', JSON.stringify({
        loggedIn: true,
        name: 'عبدالرحمن',
        email: email || 'moabdo038@gmail.com'
      }));
      
      router.push('/admin/dashboard');
    }, 1000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--surface-alt,#f8fafc)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[var(--primary,#f59e0b)]">
          <Scale className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text,#0f172a)] font-sora">
          المستشار للمحاماة
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-muted,#64748b)]">
          بوابة HireFlow - لوحة التحكم
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[var(--border,#e2e8f0)]">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text,#0f172a)]">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="moabdo038@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[var(--border,#e2e8f0)] rounded-md shadow-sm placeholder-[var(--text-faint,#94a3b8)] focus:outline-none focus:ring-[var(--primary,#f59e0b)] focus:border-[var(--primary,#f59e0b)] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text,#0f172a)]">
                كلمة المرور
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[var(--border,#e2e8f0)] rounded-md shadow-sm placeholder-[var(--text-faint,#94a3b8)] focus:outline-none focus:ring-[var(--primary,#f59e0b)] focus:border-[var(--primary,#f59e0b)] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary,#f59e0b)] hover:bg-[var(--primary-hover,#d97706)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary,#f59e0b)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الدخول...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
