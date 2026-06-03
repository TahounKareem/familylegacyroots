import React, { useState } from "react";
import { useAppStore, AppRole } from "@/lib/store";
import { useNavigate, Navigate, Link } from "react-router";
import { Home, Eye, EyeOff, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentUser = useAppStore((state) => state.currentUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && !agreeTerms) {
      alert("الرجاء الموافقة على شروط الاستخدام وسياسة الخصوصية لإتمام التسجيل.");
      return;
    }
    
    // Password strictness validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^\-])[A-Za-z\d@$!%*?&_#^\-]{8,}$/;
    if (!isLogin && !passwordRegex.test(password)) {
      setError("كلمة المرور يجب أن تتكون من 8 أحرف كحد أدنى وتتضمن حرفاً كبيراً ورقم ورمز.");
      return;
    }
    
    if (email && password) {
      setLoading(true);
      try {
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          if (!passwordRegex.test(password)) {
            alert("إشعار أمان: نظراً لسياسات الأمان الجديدة، يرجى تغيير كلمة المرور الخاصة بك لتتوافق مع المتطلبات الحالية (8 أحرف كحد أدنى تتضمن حرفاً كبيراً ورقم ورمز) وذلك من خلال خيار استعادة كلمة المرور.");
          }

          if (!userCredential.user.emailVerified) {
            await signOut(auth);
            setError("برجاء تفعيل حسابك أولاً من خلال الرابط المرسل إلى بريدك الإلكتروني.");
            return;
          }
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await updateProfile(user, { displayName: name });
          
          let role: AppRole = "user";
          const lowerEmail = email.toLowerCase();
          if (lowerEmail === "kareem.tahoun@adamresearchcenter.net") {
            role = "maestro";
          } else if (lowerEmail === "hassan.alamri@adamresearchcenter.net") {
            role = "admin";
          }
          const cookieConsent = localStorage.getItem('cookie-consent') || 'none';
          
          let country = "غير محدد";
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.country_name) country = data.country_name;
          } catch (e) {
            console.error("Could not fetch country:", e);
          }

          await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            country: country,
            legalConsent: {
              agreedToTerms: agreeTerms,
              agreedToTermsAt: agreeTerms ? new Date().toISOString() : null,
              cookieConsentLevel: cookieConsent,
              cookieConsentAt: cookieConsent !== 'none' ? new Date().toISOString() : null,
              ipAddress: "تم تسجيلها بواسطة سيرفر أمان النظام",
            }
          });

          // Send verification email and sign out to wait for verification
          await sendEmailVerification(user);
          await signOut(auth);
          
          // Clear inputs and show success message
          setError("تم إنشاء الحساب بنجاح! برجاء تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني قبل تسجيل الدخول. (إذا لم تجد الرسالة، يرجى تفقد مجلد الرسائل المزعجة Spam / Junk).");
          setIsLogin(true);
          setPassword("");
          return;
        }
      } catch (err: any) {
        console.error("Auth/Firestore error:", err);
        
        let errorMessage = "حدث خطأ في المصادقة.";
        if (err.code === "auth/email-already-in-use") {
          errorMessage = "البريد الإلكتروني هذا مستخدم مسبقاً.";
        } else if (err.code === "auth/invalid-credential") {
          errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        } else if (err.code === "auth/network-request-failed") {
          errorMessage = "حدث خطأ في الاتصال بخوادم المصادقة (Network Request Failed). الغالب أن النطاق الحالي غير مضاف في قائمة النطاقات المسموحة (Authorized Domains) في إعدادات Firebase أو تمت إعاقته بسبب إضافة حجب إعلانات.";
        } else if (err.code === "permission-denied") {
          errorMessage = "مرفوض: يرجى التأكد من تفعيل وتحديث Security Rules في Firestore." + (err.message || "");
        } else if (err.message) {
          errorMessage += "\n" + err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
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
      setError("حدث خطأ أثناء محاولة إرسال رابط الاستعادة. تأكد من صحة البريد الإلكتروني.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <Link to="/" className="flex items-center gap-2 text-brand-600 hover:text-brand-800 transition bg-white py-2 px-4 rounded-full shadow-sm">
          <Home className="w-5 h-5" />
          <span className="font-medium">العودة للرئيسية</span>
        </Link>
      </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-3xl transform scale-75 origin-top mb-1 mt-10">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2 lg:gap-4 hidden md:flex" dir="rtl">
          {[
            { title: "ابدأ سجل عائلتك", desc: "قم بإنشاء حسابك وإعداد النطاق الأولي للسجل" },
            { title: "حدثنا عن عائلتك", desc: "أدخل البيانات والمعلومات الأولية المتوفرة لديك" },
            { title: "نقوم بالبحث والتوثيق", desc: "فريقنا يبدأ جمع ومراجعة وتوثيق الروايات والوثائق" },
            { title: "استلم السجل", desc: "احصل على سجل عائلتك مطبوعاً ورقمياً بتصميم فاخر" }
          ].map((step, idx) => (
            <div key={idx} className="relative flex-1 flex items-stretch group">
              <div 
                className="bg-[#f8e6e5] z-10 text-brand-900 border border-[#f5d7d5] shadow-sm py-4 px-4 flex-1 text-center h-full flex flex-col justify-center transition-colors"
                style={{
                  clipPath: idx === 0 
                    ? 'polygon(100% 0%, 15% 0%, 0% 50%, 15% 100%, 100% 100%)' 
                    : idx === 3 
                      ? 'polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%, 85% 50%)' 
                      : 'polygon(100% 0%, 15% 0%, 0% 50%, 15% 100%, 100% 100%, 85% 50%)',
                  borderRadius: idx === 0 ? '0 1rem 1rem 0' : idx === 3 ? '1rem 0 0 1rem' : '0'
                }}
              >
                <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-[10px] opacity-80 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center pb-2">
          <Link to="/services" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition text-sm">
            أعرف المزيد عن السجل <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-brand-900">
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-brand-100">
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center ${error.includes('بنجاح') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {error}
            </div>
          )}
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
                  className="appearance-none block w-full px-3 py-2 border border-brand-200 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-left dir-ltr"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-800">كلمة المرور</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brand-200 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 pl-10 text-left dir-ltr"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-500 hover:text-brand-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                    أوافق على <Link to="/legal/terms" target="_blank" className="text-brand-600 hover:text-brand-500 underline">شروط الاستخدام</Link> و <Link to="/legal/privacy" target="_blank" className="text-brand-600 hover:text-brand-500 underline">سياسة الخصوصية</Link> وأقر بصحة البيانات المدخلة.
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
                  <a href="#" onClick={handleForgotPassword} className="font-medium text-brand-600 hover:text-brand-500">
                    نسيت كلمة المرور؟
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${loading ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
              >
                {loading ? "جاري المعالجة..." : (isLogin ? "الدخول لملف العائلة" : "إنشاء حساب")}
              </button>
            </div>
          </form>
        </div>

                {!isLogin ? (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-50 text-brand-500">لديك حساب بالفعل؟</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-brand-500 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <button 
                onClick={() => setIsLogin(true)} 
                className="relative flex items-center justify-center gap-2 w-full py-4 bg-white border border-brand-200 rounded-[2rem] text-brand-700 font-bold hover:text-brand-900 transition shadow-sm hover:shadow-md"
              >
                <Home className="w-5 h-5 text-brand-600" />
                تسجيل الدخول
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-50 text-brand-500">مستخدم جديد؟</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center relative group">
              <button 
                onClick={() => setIsLogin(false)} 
                className="relative flex items-center justify-center gap-2 w-full py-4 bg-white border border-brand-200 rounded-[2rem] text-brand-700 font-bold hover:text-brand-900 transition shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-5 h-5 text-brand-600" />
                إنشاء حساب جديد الآن
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
