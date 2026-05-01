import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createSupportTicket } from '@/lib/emailService';
import { useAppStore } from '@/lib/store';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

const QA_DB = [
  {
    q: "كم يستغرق البحث عن سجل العائلة؟",
    a: "مدة البحث تعتمد على الباقة المختارة ومدى توفر الوثائق في السجلات الرسمية، وعادةً ما تستغرق العملية من 4 إلى 12 أسبوعاً للتوثيق المعتمد."
  },
  {
    q: "ما هي تكلفة الباقات؟",
    a: "تبدأ باقاتنا من 1999 دولار للباقة الأساسية، وتختلف التكلفة بناءً على عمق التوثيق المطلوب، والتسلسل الزمني، وما إذا كنت ترغب في الحصول على كتاب مطبوع ومجلد."
  },
  {
    q: "كيف أضمن صحة المعلومات؟",
    a: "نحن نعتمد فقط على السجلات الحكومية الموثقة، المحفوظات الوطنية، والمصادر التاريخية المعترف بها لضمان دقة لا تقبل الشك."
  },
  {
    q: "هل الدفع آمن؟",
    a: "نعم بالتأكيد! يتم الدفع عن طريق بوابات الدفع الإلكتروني الموثقة عالمياً لضمان أعلى معايير الأمان لحساباتكم."
  }
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTicketMode, setIsTicketMode] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const currentUser = useAppStore(state => state.currentUser);

  const [ticketData, setTicketData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    message: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        id: '1', 
        sender: 'bot', 
        text: 'أهلاً بك في مركز آدم للبحوث. كيف يمكنني مساعدتك اليوم؟ يرجى اختيار أحد الأسئلة الشائعة أو التحدث لفريق الدعم.' 
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (currentUser) {
      setTicketData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTicketMode]);

  const handleQA = (qa: typeof QA_DB[0]) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: qa.q }
    ]);
    
    // محاكاة كتابة البوت للحيوية
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'bot', text: qa.a }
      ]);
    }, 600);
  };

  const handleOpenTicket = () => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: 'أريد التحدث مع خدمة العملاء' }
    ]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'bot', text: 'سأقوم بمساعدتك لفتح تذكرة وسيتم الرد عليك عبر البريد الإلكتروني خلال 24 ساعة.' }
      ]);
      setIsTicketMode(true);
    }, 600);
  };

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketData.name || !ticketData.email || !ticketData.message) {
      alert("الرجاء إكمال جميع الحقول");
      return;
    }

    setTicketStatus('submitting');
    try {
      await createSupportTicket(ticketData.name, ticketData.email, ticketData.message);
      setTicketStatus('success');
      setTimeout(() => {
        setTicketStatus('idle');
        setIsTicketMode(false);
        setTicketData(prev => ({ ...prev, message: '' }));
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), sender: 'bot', text: 'تم استلام تذكرتك بنجاح ومراجعتها، تفقد بريدك الإلكتروني.' }
        ]);
      }, 2500);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setTicketStatus('idle');
      alert('حدث خطأ، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <>
      {/* زر فتح الشات بوت */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 p-4 bg-brand-800 text-white rounded-full shadow-2xl transition hover:bg-brand-900 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="التواصل مع خدمة العملاء"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* نافذة الشات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-[100] w-full max-w-[360px] h-[500px] max-h-[80vh] flex flex-col bg-white overflow-hidden shadow-2xl rounded-2xl border border-brand-200"
            dir="rtl"
          >
            {/* الهيدر */}
            <div className="bg-brand-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-700 rounded-full flex justify-center items-center">
                  <span className="font-serif text-lg font-bold">آدم</span>
                </div>
                <div>
                  <h3 className="font-semibold leading-tight text-sm">المساعد الآلي</h3>
                  <p className="text-xs text-brand-200">مركز آدم للبحوث</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-brand-700 rounded-full transition"
                aria-label="إغلاق الشات"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* منطقة الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-800 text-white rounded-tl-sm' 
                        : 'bg-white border border-brand-100 text-gray-800 rounded-tr-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {!isTicketMode && (
                <div className="flex flex-col gap-2 mt-4 animate-fade-in">
                  <p className="text-xs text-center text-gray-500 mb-1">اختر استفساراً:</p>
                  {QA_DB.map((qa, index) => (
                    <button
                      key={index}
                      onClick={() => handleQA(qa)}
                      className="text-right text-sm px-4 py-2 bg-white border border-brand-200 text-brand-800 rounded-xl hover:bg-brand-50 transition shadow-sm"
                    >
                      {qa.q}
                    </button>
                  ))}
                  <button
                    onClick={handleOpenTicket}
                    className="text-right text-sm px-4 py-2 bg-brand-50 border border-brand-300 text-brand-900 font-semibold rounded-xl hover:bg-brand-100 transition shadow-sm"
                  >
                    التحدث مع ممثل خدمة العملاء
                  </button>
                </div>
              )}

              {/* نموذج فتح التذكرة */}
              {isTicketMode && ticketStatus !== 'success' && (
                <form onSubmit={submitTicket} className="mt-2 bg-white p-4 border border-brand-200 rounded-xl shadow-sm animate-fade-in flex flex-col gap-3">
                  <h4 className="font-semibold text-brand-900 border-b border-brand-100 pb-2 mb-1 text-sm">ارسل استفسارك وسنرد عليك</h4>
                  
                  {!currentUser && (
                    <>
                      <input 
                        type="text" 
                        required 
                        value={ticketData.name} 
                        onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                        placeholder="الاسم" 
                        className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" 
                      />
                      <input 
                        type="email" 
                        required 
                        value={ticketData.email} 
                        onChange={(e) => setTicketData({...ticketData, email: e.target.value})}
                        placeholder="البريد الإلكتروني" 
                        className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" 
                      />
                    </>
                  )}
                  
                  <textarea 
                    required
                    value={ticketData.message} 
                    onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                    placeholder="اكتب رسالتك أو استفسارك هنا تفصيلاً..." 
                    className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={ticketStatus === 'submitting'}
                    className="w-full bg-brand-800 text-white font-semibold py-2 rounded-lg text-sm hover:bg-brand-900 transition flex items-center justify-center gap-2"
                  >
                    {ticketStatus === 'submitting' ? 'جاري الإرسال...' : (
                      <>إرسال التذكرة <Send className="w-4 h-4 ml-1" /></>
                    )}
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsTicketMode(false)}
                     className="w-full mt-1 text-xs text-gray-500 hover:text-brand-800 transition"
                  >
                    إلغاء والعودة
                  </button>
                </form>
              )}

              {ticketStatus === 'success' && (
                <div className="mt-2 text-center p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <p className="font-semibold text-sm">تم إرسال التذكرة بنجاح!</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
