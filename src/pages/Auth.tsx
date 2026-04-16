import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !agreeTerms) {
      alert("الرجاء الموافقة على شروط الاستخدام وسياسة الخصوصية لإتمام التسجيل.");
      return;
    }
    if (email && password) {
      // Simulation: if email is admin, make them admin. Otherwise user.
      const role = email.includes("admin") ? "admin" : "user";
      login({
        id: Math.random().toString(36).substr(2, 9),
        name: name || (isLogin ? "مستخدم العائلة" : "مستخدم جديد"),
        email,
        role
      });
      navigate(role === "admin" ? "/admin" : "/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-brand-900">
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>
        <p className="mt-2 text-center text-sm text-brand-700">
          أو{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-brand-600 hover:text-brand-500 transition border-b border-brand-600">
            {isLogin ? "سجل كعضو جديد" : "سجل دخولك لحسابك"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-brand-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-brand-800">الاسم الكامل</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-brand-200 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-800">البريد الإلكتروني</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brand-200 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-800">كلمة المرور</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brand-200 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-brand-300 rounded"
                  />
                </div>
                <div className="ml-3 mr-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-brand-800">
                    أوافق على <a href="/legal" target="_blank" className="text-brand-600 hover:text-brand-500 underline">شروط الاستخدام</a>، <a href="/legal" target="_blank" className="text-brand-600 hover:text-brand-500 underline">سياسة الخصوصية</a>، و <a href="/legal" target="_blank" className="text-brand-600 hover:text-brand-500 underline">سياسة الكوكيز</a>.
                  </label>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-brand-300 rounded" />
                  <label htmlFor="remember-me" className="mr-2 block text-sm text-brand-800">
                    تذكرني
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                    نسيت كلمة المرور؟
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition"
              >
                {isLogin ? "الدخول لملف العائلة" : "إنشاء حساب"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
