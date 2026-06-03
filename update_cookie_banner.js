import fs from 'fs';

let content = `import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, personalization: false });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getIp = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const saveConsentToArchive = async (level: string, details: any = {}) => {
    try {
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
      }
      
      const ip = await getIp();

      await addDoc(collection(db, 'legal_audit_logs'), {
        visitorId,
        documentVersion: '1.0',
        action: 'cookie_consent_accepted',
        consentLevel: level,
        details,
        ipAddress: ip,
        userAgent: navigator.userAgent,
        url: window.location.href,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error archiving visitor consent:", error);
    }
  };

  const acceptAll = async () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
    await saveConsentToArchive('all', { analytics: true, personalization: true });
  };

  const acceptEssential = async () => {
    localStorage.setItem('cookie-consent', 'essential');
    setIsVisible(false);
    await saveConsentToArchive('essential', { analytics: false, personalization: false });
  };

  const savePreferences = async () => {
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-prefs', JSON.stringify(prefs));
    setIsVisible(false);
    await saveConsentToArchive('custom', prefs);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 sm:bottom-4 px-2 sm:px-0 w-full sm:w-[320px] sm:left-4 z-[100]"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col scale-95 transform-origin-bottom">
            <div className="p-4 sm:p-5">
              <h3 className="text-base font-bold text-gray-800 leading-tight mb-1">خصوصيتك تهمنا</h3>
              <p className="text-xs text-gray-500 font-medium mb-4">إعدادات الخصوصية وملفات الارتباط</p>
              
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                نستخدم ملفات تعريف الارتباط لتحسين أداء المنصة وحماية الجلسات وتخصيص تجربة الاستخدام.
              </p>

              <div className="border border-gray-100 bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">الملفات الأساسية</span>
                  <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 mr-auto">مفعلة دائمًا</span>
                </div>
                <p className="text-[10px] text-gray-500">تسجيل الدخول – حماية الجلسات – الأمان الأساسي.</p>
              </div>

              <div className="mb-4">
                <button 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-600 py-2 border-b border-gray-100"
                >
                  التفضيلات
                  {showPreferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <AnimatePresence>
                  {showPreferences && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="py-3 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="mt-0.5 w-3.5 h-3.5 rounded-sm border-gray-300 text-gray-600 focus:ring-gray-600"
                            checked={prefs.analytics}
                            onChange={(e) => setPrefs({...prefs, analytics: e.target.checked})}
                          />
                          <div>
                            <div className="text-xs font-bold text-gray-700 mb-0.5">ملفات الأداء والتحليلات</div>
                            <div className="text-[10px] text-gray-500">تحسين الأداء وفهم استخدام المنصة.</div>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="mt-0.5 w-3.5 h-3.5 rounded-sm border-gray-300 text-gray-600 focus:ring-gray-600"
                            checked={prefs.personalization}
                            onChange={(e) => setPrefs({...prefs, personalization: e.target.checked})}
                          />
                          <div>
                            <div className="text-xs font-bold text-gray-700 mb-0.5">ملفات التخصيص</div>
                            <div className="text-[10px] text-gray-500">حفظ اللغة والتفضيلات وإعدادات العرض.</div>
                          </div>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3 text-[10px] justify-center mb-5 border-t border-gray-100 pt-4">
                <Link to="/legal" className="text-gray-500 hover:text-gray-800 underline transition">سياسة الخصوصية</Link>
                <span className="text-gray-300">|</span>
                <Link to="/legal" className="text-gray-500 hover:text-gray-800 underline transition">سياسة الكوكيز</Link>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={acceptAll}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 px-2 rounded-lg text-xs font-bold transition border border-gray-800"
                  >
                    قبول الكل
                  </button>
                  <button 
                    onClick={savePreferences}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-2 rounded-lg text-xs font-bold transition border border-gray-300 shadow-sm"
                  >
                    حفظ التفضيلات
                  </button>
                </div>
                <button 
                  onClick={acceptEssential}
                  className="w-full bg-white hover:bg-gray-50 text-gray-600 py-2 px-2 rounded-lg text-[10px] font-bold transition border border-gray-200"
                >
                  الملفات الأساسية (إجباري)
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
`;
fs.writeFileSync('src/components/ui/CookieBanner.tsx', content);
