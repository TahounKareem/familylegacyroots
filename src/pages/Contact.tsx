import React, { useState } from "react";
import { HelpCircle, MessageSquare, PhoneCall, Book, ArrowLeft, Send, CheckCircle2, Search } from "lucide-react";
import { Link } from "react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Contact() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    adminName: "",
    deviceInfo: "",
    privacyType: "طلب حذف بيانات",
    isProjectRelated: "لا",
    subject: "",
    message: ""
  });

  const categories = [
    {
      id: "sales",
      title: "الاستفسار عن الخدمة",
      desc: "تفاصيل سجل تراث العائلة، المنهجية، نطاق التوثيق، المدة والتسعير"
    },
    {
      id: "project",
      title: "متابعة مشروع قائم",
      desc: "تحديثات المشروع، التصحيحات، حالة الطلب"
    },
    {
      id: "support",
      title: "الدعم الفني والمنصة",
      desc: "مشاكل الدخول، الدفع، الأعطال التقنية"
    },
    {
      id: "privacy",
      title: "الخصوصية والوثائق",
      desc: "طلبات الخصوصية، حذف البيانات، الموافقات القانونية"
    },
    {
      id: "partnerships",
      title: "الشراكات والإعلام",
      desc: "التعاون، الإعلام، الشراكات المؤسسية"
    },
    {
      id: "other",
      title: "أخرى",
      desc: "للاستفسارات العامة"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const generatedId = `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      const categoryTitle = categories.find(c => c.id === selectedCategory)?.title || "غير محدد";
      
      const payload = {
        ...formData,
        categoryId: selectedCategory,
        categoryTitle,
        ticketNumber: generatedId,
        status: "جديدة",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "support_tickets"), payload);
      setTicketId(generatedId);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("حدث خطأ أثناء إرسال رسالتكم. يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-brand-50 min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-12 text-center shadow-sm border border-brand-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">تم استلام رسالتكم</h2>
          <p className="text-brand-700 leading-relaxed mb-6">
            تمت إحالة طلبكم إلى القسم المختص، وسيتم التواصل معكم عبر البريد الإلكتروني خلال الفترة التشغيلية المعتادة.
          </p>
          <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 font-mono text-brand-800 font-bold mb-8 text-lg">
            رقم المرجع: {ticketId || `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="px-6 py-3 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 transition">العودة للصفحة الرئيسية</Link>
            <Link to="/guide" className="px-6 py-3 bg-white text-brand-700 border border-brand-200 rounded-xl font-bold hover:bg-brand-50 transition">استعراض الدليل الإرشادي</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <div className="bg-white py-16 mb-12 shadow-sm border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-brand-900 mb-4">كيف يمكننا مساعدتك؟</h1>
          <p className="text-lg text-brand-600 max-w-2xl mx-auto">قبل إرسال رسالتك، قد تجد الإجابة مباشرة عبر الدليل الإرشادي أو الأسئلة الشائعة أو المرشد الذكي.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row-reverse gap-12">
        
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          
          {/* Quick Support Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/guide" className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-md hover:border-brand-300 transition group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-brand-900 mb-2">الدليل الإرشادي</h3>
              <p className="text-sm text-brand-600 mb-6 flex-1">شرح تفصيلي للخدمة والمنهجية والعقود وآلية التوثيق.</p>
              <div className="w-full py-3 bg-brand-50 text-brand-800 rounded-xl font-bold group-hover:bg-brand-900 group-hover:text-white transition-colors">استكشف الدليل</div>
            </Link>

            <Link to="/faq" className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-md hover:border-brand-300 transition group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-brand-900 mb-2">الأسئلة الشائعة</h3>
              <p className="text-sm text-brand-600 mb-6 flex-1">إجابات مختصرة لأكثر الأسئلة والاستفسارات شيوعًا.</p>
              <div className="w-full py-3 bg-brand-50 text-brand-800 rounded-xl font-bold group-hover:bg-brand-900 group-hover:text-white transition-colors">عرض الأسئلة</div>
            </Link>

            <button onClick={() => window.dispatchEvent(new Event('open-chatbot'))} className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-md hover:border-brand-300 transition group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-brand-900 mb-2">المرشد الذكي</h3>
              <p className="text-sm text-brand-600 mb-6 flex-1">مساعد ذكي للإجابة عن الأسئلة المتعلقة بالخدمة والمنصة.</p>
              <div className="w-full py-3 bg-brand-50 text-brand-800 rounded-xl font-bold group-hover:bg-brand-900 group-hover:text-white transition-colors">ابدأ المحادثة</div>
            </button>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-brand-100">
            <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4">إرسال طلب أو استفسار</h2>
            <p className="text-brand-600 mb-10">يرجى اختيار نوع الطلب لمساعدتنا على توجيه رسالتكم إلى القسم المناسب.</p>

            {/* Category Selection */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border text-right transition-all ${selectedCategory === cat.id ? 'bg-brand-50 border-brand-500 shadow-sm' : 'bg-white border-brand-200 hover:border-brand-300 hover:bg-gray-50'}`}
                >
                  <div className="font-bold text-brand-900 mb-1">{cat.title}</div>
                  <div className="text-xs text-brand-500 leading-relaxed">{cat.desc}</div>
                </button>
              ))}
            </div>

            {selectedCategory === "sales" && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
                <h4 className="font-bold text-brand-900 mb-3 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-brand-600" /> قد تساعدك هذه المواضيع قبل التواصل:</h4>
                <ul className="list-disc list-inside space-y-2 text-brand-700 text-sm mb-4">
                  <li>ما الذي يشمله سجل تراث العائلة؟</li>
                  <li>ما مدة تنفيذ المشروع؟</li>
                  <li>هل يشمل السجل تشجير العائلة؟</li>
                  <li>ما الفرق بين السجل والمشجرة التقليدية؟</li>
                  <li>كيف تتم حماية الخصوصية؟</li>
                </ul>
                <Link to="/faq" className="text-brand-600 font-bold text-sm hover:underline">عرض الأسئلة الشائعة &larr;</Link>
              </div>
            )}

            {selectedCategory && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-bold text-2xl text-brand-900 mb-6 border-b border-brand-100 pb-4">تفاصيل الطلب</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-800 mb-2">الاسم الكامل *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-800 mb-2">البريد الإلكتروني *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border text-left" dir="ltr" />
                    </div>
                  </div>

                  {(selectedCategory === "project" || selectedCategory === "support") && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-brand-800 mb-2">رقم الطلب (إن وجد)</label>
                        <input type="text" value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border text-left" dir="ltr" />
                      </div>
                      {selectedCategory === "project" && (
                        <div>
                          <label className="block text-sm font-bold text-brand-800 mb-2">اسم أمين السجل</label>
                          <input type="text" value={formData.adminName} onChange={(e) => setFormData({...formData, adminName: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" />
                        </div>
                      )}
                      {selectedCategory === "support" && (
                        <div>
                          <label className="block text-sm font-bold text-brand-800 mb-2">نوع الجهاز / المتصفح</label>
                          <input type="text" value={formData.deviceInfo} onChange={(e) => setFormData({...formData, deviceInfo: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" placeholder="مثال: آيفون، كروم" />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedCategory === "privacy" && (
                    <div className="grid md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-bold text-brand-800 mb-2">نوع الطلب</label>
                          <select value={formData.privacyType} onChange={(e) => setFormData({...formData, privacyType: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border">
                            <option>طلب حذف بيانات</option>
                            <option>استفسار عن الخصوصية</option>
                            <option>موافقة قانونية</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-brand-800 mb-2">هل الطلب متعلق بمشروع قائم؟</label>
                          <select value={formData.isProjectRelated} onChange={(e) => setFormData({...formData, isProjectRelated: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border">
                            <option>نعم</option>
                            <option>لا</option>
                          </select>
                        </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-brand-800 mb-2">عنوان الموضوع *</label>
                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" placeholder="" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-800 mb-2">تفاصيل الرسالة *</label>
                    <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" placeholder="يرجى توضيح طلبكم أو استفساركم بصورة مختصرة وواضحة."></textarea>
                  </div>

                  {/* Dummy Captcha */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 w-max">
                    <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-600" />
                    <span className="text-sm font-medium text-gray-700">أنا لست برنامج روبوت</span>
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="h-8 max-w-none opacity-50 mr-4" />
                  </div>

                  <div className="pt-6 border-t border-brand-100">
                    <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 py-4 bg-brand-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-brand-800 transition shadow-md disabled:bg-gray-400">
                      {isSubmitting ? "جاري الإرسال..." : (
                        <>إرسال الطلب <Send className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-xs text-brand-500 mt-4 leading-relaxed max-w-md">
                      ملاحظة: نظرًا لطبيعة العمل البحثي والتوثيقي، تتم مراجعة الرسائل وتصنيفها قبل الرد عليها من الفريق المختص.
                    </p>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar Desktop */}
        <div className="lg:w-80 space-y-6 hidden lg:block">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-100 sticky top-24">
            <h3 className="font-bold text-brand-900 mb-6 text-lg border-b border-brand-100 pb-4">قبل التواصل</h3>
            
            <ul className="space-y-4">
              <li><Link to="/guide" className="text-brand-700 hover:text-brand-900 hover:mr-2 transition-all block">الدليل الإرشادي</Link></li>
              <li><Link to="/faq" className="text-brand-700 hover:text-brand-900 hover:mr-2 transition-all block">الأسئلة الشائعة</Link></li>
              <li><button onClick={() => window.dispatchEvent(new Event('open-chatbot'))} className="text-brand-700 hover:text-brand-900 hover:mr-2 transition-all block text-right w-full">المرشد الذكي</button></li>
              <li><Link to="/legal/privacy" className="text-brand-700 hover:text-brand-900 hover:mr-2 transition-all block">سياسة الخصوصية</Link></li>
              <li><Link to="/legal/terms" className="text-brand-700 hover:text-brand-900 hover:mr-2 transition-all block">شروط الخدمة</Link></li>
            </ul>

            <div className="mt-8 pt-8 border-t border-brand-100">
               <div className="bg-brand-50 rounded-2xl p-5 border border-brand-100 text-center">
                 <h4 className="font-bold text-brand-900 mb-2">سجل تراث العائلة</h4>
                 <p className="text-xs text-brand-600 mb-4 leading-relaxed">سجل يوثق عمود النسب والذاكرة العائلية.</p>
                 <Link to="/auth" className="block w-full py-2 bg-white border border-brand-200 text-brand-700 text-sm font-bold rounded-xl hover:border-brand-500 hover:text-brand-900 transition">ابدأ سجل عائلتك</Link>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
