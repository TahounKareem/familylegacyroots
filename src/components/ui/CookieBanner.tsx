import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsentToArchive = async (level: 'all' | 'essential') => {
    try {
      // Generate a random visitor ID if not exists
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
      }

      await addDoc(collection(db, 'visitor_consents'), {
        visitorId,
        consentLevel: level,
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'cookie_consent'
      });
    } catch (error) {
      console.error("Error archiving visitor consent:", error);
    }
  };

  const acceptAll = async () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
    await saveConsentToArchive('all');
  };

  const acceptEssential = async () => {
    localStorage.setItem('cookie-consent', 'essential');
    setIsVisible(false);
    await saveConsentToArchive('essential');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:max-w-[28rem] bg-white sm:rounded-2xl shadow-2xl z-[100] border border-brand-100 overflow-hidden"
          dir="rtl"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-brand-900 font-serif">خصوصيتك تهمنا</h3>
              <button 
                onClick={acceptEssential}
                className="text-brand-400 hover:text-brand-600 transition p-1 hover:bg-brand-50 rounded-full"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-brand-700 leading-relaxed mb-6">
              نحن نستخدم ملفات تعريف الارتباط (الكوكيز) لنقدم لك أفضل تجربة ممكنة على موقعنا، ولتحليل التصفح، وتقديم محتوى مخصص. بمواصلة تصفح الموقع، فإنك توافق على{' '}
              <Link to="/legal#cookies" className="text-brand-600 font-medium underline hover:text-brand-800 transition">
                سياسة الكوكيز
              </Link>{' '}
              و{' '}
              <Link to="/legal#privacy" className="text-brand-600 font-medium underline hover:text-brand-800 transition">
                سياسة الخصوصية
              </Link>{' '}
              و{' '}
              <Link to="/legal#terms" className="text-brand-600 font-medium underline hover:text-brand-800 transition">
                شروط الاستخدام
              </Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={acceptAll}
                className="w-full sm:w-auto flex-1 bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition drop-shadow-sm"
              >
                الموافقة على الكل
              </button>
              <button 
                onClick={acceptEssential}
                className="w-full sm:w-auto flex-1 bg-brand-50 hover:bg-brand-100 text-brand-800 px-4 py-3 rounded-xl text-sm font-semibold transition border border-brand-200"
              >
                الأساسية فقط
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
