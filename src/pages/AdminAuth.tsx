import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useNavigate, Navigate, Link } from "react-router";
import { Home, Eye, EyeOff, ShieldCheck, Key, Lock, Users } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  const currentUser = useAppStore((state) => state.currentUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return;
    
    // Rate Limiting & Account Lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setError(`تم قفل الحساب مؤقتًا. المحاولة القادمة بعد ${minutesLeft} دقيقة.`);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for store to update
      setFailedAttempts(0);
      setLockoutUntil(null);
    } catch (err: any) {
      console.error(err);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutUntil(Date.now() + 15 * 60000);
        setError("تم قفل الحساب مؤقتاً لمدة 15 دقيقة لدواعي أمنية.");
      } else {
        setError(`بيانات الدخول غير صحيحة، أو ليس لديك الصلاحية. (المحاولة ${newAttempts} من 5)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("الرجاء إدخال البريد الإلكتروني أولاً لاستعادة كلمة المرور.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      alert("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.");
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء محاولة إرسال رابط الاستعادة.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    if (currentUser.role === "user") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.03] mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#C3262A]/10 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-brand-900/10 to-transparent rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12 py-12">
        
        {/* Intro/Motivation Section */}
        <div className="flex-1 text-center md:text-right">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md border border-brand-100 text-[#C3262A] mb-6 animate-bounce-slow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-900 leading-tight mb-6">
            منصة إدارة فريق العمل <br/>
            <span className="text-[#C3262A]">سجل تراث العائلة</span>
          </h1>
          <p className="text-lg text-brand-700 leading-relaxed max-w-lg mb-8 font-medium">
            مرحباً بك في البوابة الخاصة لصناع الأثر. كل خطوة تقوم بها هنا تساهم في إحياء الذاكرة وربط الأجيال. معاً نصنع تاريخاً يورث.
          </p>
          <div className="space-y-4">
          </div>
        </div>

        {/* Login Form Section */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-brand-100 relative">
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#C3262A] rounded-full shadow-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-4 border-brand-100 rounded-full"></div>
            
            <h2 className="text-2xl font-serif font-bold text-brand-900 mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#C3262A]" /> تسجيل دخول النظام
            </h2>
            <p className="text-brand-500 text-sm mb-8">يرجى إدخال بيانات الاعتماد الخاصة بك للوصول.</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl text-sm text-center bg-red-50 text-red-700 border border-red-200 font-medium flex items-center justify-center gap-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-brand-800 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-[#C3262A] focus:border-[#C3262A] outline-none transition bg-brand-50/50 text-brand-900"
                    placeholder="name@adamresearchcenter.net"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-800 mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-[#C3262A] focus:border-[#C3262A] outline-none transition bg-brand-50/50 text-brand-900"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3.5 text-brand-400 hover:text-brand-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={handleForgotPassword} className="text-sm text-[#C3262A] hover:text-[#a61c20] font-medium transition">
                    نسيت كلمة المرور؟
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C3262A] text-white py-3.5 px-4 rounded-xl hover:bg-[#a61c20] focus:ring-4 focus:ring-red-100 transition shadow-lg font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "دخول"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
