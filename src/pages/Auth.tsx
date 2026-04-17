import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useNavigate, Navigate, Link } from "react-router";
import { Home } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    
    if (email && password) {
      setLoading(true);
      try {
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          if (!userCredential.user.emailVerified) {
            await signOut(auth);
            setError("برجاء تفعيل حسابك أولاً من خلال الرابط المرسل إلى بريدك الإلكتروني.");
            return;
          }
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await updateProfile(user, { displayName: name });
          
          const role = email.toLowerCase() === "kareem.tahoun@adamresearchcenter.net" ? "admin" : "user";
          await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            name: name,
            email: email,
            role: role
          });

          // Send verification email and sign out to wait for verification
          await sendEmailVerification(user);
          await signOut(auth);
          
          // Clear inputs and show success message
          setError("تم إنشاء الحساب بنجاح! برجاء تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني قبل تسجيل الدخول.");
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
        } else if (err.code === "permission-denied") {
          errorMessage = "مرفوض: يرجى التأكد من تفعيل وتحديث Security Rules في Firestore." + (err.message || "");
        } else if (err.message) {
          errorMessage += " " + err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
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
                    أوافق على <a href="https://adam.tahoun.live/legal#agreement" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-500 underline">شروط الاستخدام</a>، <a href="https://adam.tahoun.live/legal#agreement" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-500 underline">سياسة الخصوصية</a>، و <a href="https://adam.tahoun.live/legal#agreement" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-500 underline">سياسة الكوكيز</a>.
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
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${loading ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
              >
                {loading ? "جاري المعالجة..." : (isLogin ? "الدخول لملف العائلة" : "إنشاء حساب")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
