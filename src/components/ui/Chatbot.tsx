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
    a: "تعتمد مدة البحث على مدى توفر الوثائق والمخطوطات في السجلات الرسمية والتاريخية. وعادةً ما تستغرق العملية التدقيقية والتنقيب من 4 إلى 12 أسبوعاً للحصول على توثيق دقيق ومعتمد."
  },
  {
    q: "ما هي تكلفة خدمة التوثيق؟",
    a: "نقدم الخدمة بباقة واحدة شاملة بتكلفة 1780 دولار للدفع الكامل، أو 1980 دولار عند نظام الدفعات، وتغطي هذه القيمة مراحل البحث العميق، التدقيق التاريخي، واستخراج الوثائق وتأكيدها بواسطة الخبراء."
  },
  {
    q: "كيف أضمن صحة المعلومات؟",
    a: "نعتمد في بحثنا حصرياً على السجلات الحكومية الموثقة، المحفوظات الوطنية، الوثائق العثمانية، والمصادر التاريخية المعترف بها لضمان دقة لا تقبل الشك في نسب العائلة."
  },
  {
    q: "ما هي آلية البحث المتبعة لديكم؟",
    a: "نقوم بعملية بحث استقصائي تبدأ بجمع البيانات الأولية من العميل، ثم ننتقل إلى الفحص الأرشيفي في وثائق دار الوثائق والمخطوطات والمصادر المعنية. حيث يتم مطابقة التواريخ، والأسماء، والمناطق الجغرافية بحرفية تامة."
  },
  {
    q: "من يقوم بإجراء عمليات البحث؟",
    a: "نفتخر في مركز آدم بوجود كوادر مدربة وباحثين مميزين ذوي خبرة طويلة وشهادات أكاديمية عليا في التاريخ وعلم الأنساب، مما يتيح لهم قراءة المخطوطات والوثائق القديمة وتحليلها بدقة."
  },
  {
    q: "هل الدفع آمن؟",
    a: "نعم بالتأكيد! يتم الدفع عن طريق بوابات الدفع الإلكتروني الموثقة عالمياً لضمان أعلى معايير الأمان ولسريّة بياناتكم المالية."
  }
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
        text: 'أهلاً بك. أنا "المرشد الذكي"، المساعد الإرشادي لمنصة سجل تراث العائلة. كيف يمكنني مساعدتك؟' 
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

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), sender: 'user', text: text.trim() }
    ];

    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'bot', text: data.reply }
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error.message.includes('API key') 
        ? 'عذراً، مفتاح API الخاص بـ Gemini غير مهيأ. يرجى إضافته في إعدادات التطبيق.' 
        : 'عذراً، حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.';
        
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'bot', text: errorMessage }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                  <span className="font-serif text-lg font-bold">مـ</span>
                </div>
                <div>
                  <h3 className="font-semibold leading-tight text-sm">المرشد الذكي</h3>
                  <p className="text-xs text-brand-200">مساعد إرشادي تشغيلي</p>
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
                <div className="flex flex-col gap-2 mt-2 animate-fade-in">
                  <button
                    onClick={() => setIsTicketMode(true)}
                    className="text-right text-xs px-4 py-2 bg-brand-50 border border-brand-300 text-brand-900 font-semibold rounded-xl hover:bg-brand-100 transition shadow-sm mx-auto"
                  >
                    لفتح تذكرة لفريق الدعم، اضغط هنا
                  </button>
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-100 text-gray-500 rounded-2xl rounded-tr-sm p-3 shadow-sm text-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
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

            {/* إدخال النص */}
            {!isTicketMode && (
              <div className="p-3 bg-white border-t border-brand-100">
                <div className="relative flex items-center">
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    className="absolute left-2 text-brand-800 disabled:text-gray-300 p-2 hover:bg-brand-50 rounded-full transition"
                  >
                    <Send className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-3 pr-4 pl-12 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    dir="rtl"
                  />
                </div>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
