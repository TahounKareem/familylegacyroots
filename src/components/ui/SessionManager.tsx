import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SESSION_TIMEOUT = 90 * 60 * 1000; // 90 minutes
const WARNING_TIMEOUT = 88 * 60 * 1000; // 88 minutes

export function SessionManager() {
  const { currentUser, logout } = useAppStore();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const writeAuditLog = async (action: string) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'session_audit_logs'), {
        userId: currentUser.id,
        email: currentUser.email,
        action,
        timestamp: serverTimestamp(),
      });
    } catch {
      // Ignore
    }
  };

  const handleLogout = useCallback(async () => {
    const role = currentUser?.role;
    await writeAuditLog('auto_logout_inactivity');
    await logout();
    setShowWarning(false);
    
    if (["admin", "maestro", "research", "design", "marketing", "accounting", "compliance", "shipping"].includes(role || '')) {
      window.location.href = '/team/login';
    } else {
      window.location.href = '/auth';
    }
  }, [logout, currentUser]);

  const getSessionTimeout = (role: string) => {
    // 15 min for admins/maestro, 30 min for users
    if (["admin", "maestro", "research", "design", "marketing", "accounting", "compliance", "shipping"].includes(role)) {
      return { total: 15 * 60 * 1000, warning: 13 * 60 * 1000 };
    }
    return { total: 30 * 60 * 1000, warning: 28 * 60 * 1000 };
  };

  const resetTimers = useCallback(() => {
    if (!currentUser) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setShowWarning(false);
    setTimeLeft(120);

    const timeouts = getSessionTimeout(currentUser.role || 'user');

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, timeouts.warning);

    timerRef.current = setTimeout(handleLogout, timeouts.total);
  }, [currentUser, handleLogout]);

  useEffect(() => {
    if (currentUser) {
      writeAuditLog('session_started');
      resetTimers();
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      const handler = () => resetTimers();
      
      events.forEach(e => window.addEventListener(e, handler));
      return () => {
        events.forEach(e => window.removeEventListener(e, handler));
        if (timerRef.current) clearTimeout(timerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
      };
    } else {
      setShowWarning(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [currentUser, resetTimers]);

  const stayLoggedIn = () => {
    writeAuditLog('session_extended');
    resetTimers();
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تنبيه انتهاء الجلسة</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                سيتم تسجيل خروجك تلقائياً بعد <span className="font-bold text-brand-600">{timeLeft} ثانية</span> بسبب عدم وجود نشاط.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={stayLoggedIn}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition"
                >
                  البقاء متصلاً
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl transition border border-gray-200"
                >
                  تسجيل الخروج الآن
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
