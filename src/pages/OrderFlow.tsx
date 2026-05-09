import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Check, ArrowRight, ArrowLeft, UserPlus, X } from "lucide-react";
import { useAppStore, FamilyData } from "@/lib/store";

export function OrderFlow() {
  const [step, setStep] = useState(1);
  const { currentUser, placeOrder, orders } = useAppStore();
  const navigate = useNavigate();

  // Redirect if they already have an order
  useEffect(() => {
    if (orders.find(o => o.userId === currentUser?.id)) {
      navigate("/dashboard", { replace: true });
    }
  }, [orders, currentUser, navigate]);

  const [formData, setFormData] = useState<FamilyData>({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    familyName: "",
    tribeName: "",
    country: "",
    homeland: "",
    startingPoint: "",
    designTemplate: "فاخر",
    documents: [],
    photos: [],
    historicalNotes: "",
    treeData: { nodes: [], edges: [] }
  });

  const [agreedToService, setAgreedToService] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleInviteSubmit = async () => {
    if (inviteCode !== "alpha24") {
      setInviteError("الكود المدخل غير صحيح");
      return;
    }
    setInviteError("");
    setIsSubmitting(true);
    try {
      if (!currentUser) return;
      
      const orderId = currentUser.id;
      await placeOrder({
        id: orderId,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        plan: "standard",
        printRequested: false,
        status: "بانتظار الدفع", // It's immediately upgraded to "قيد البحث" by Dashboard.tsx using ?success=true
        totalAmount: 0,
        data: formData,
      });

      // Navigate to success page mimicking Stripe
      window.location.href = `/?success=true&order_id=${orderId}&invite=true`;
    } catch (e) {
      console.error(e);
      alert("حدث خطأ");
      setIsSubmitting(false);
    }
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    try {
      // User must be logged in to reach here due to routes, but just in case
      if (!currentUser) {
        alert("يجب تسجيل الدخول لإتمام الطلب");
        return;
      }
      
      const orderId = currentUser.id; // Using User ID as Order ID ensures 1 order per user
      const planPrice = 1999;
      
      // Save order in Firestore with local pending state 
      await placeOrder({
        id: orderId,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        plan: "standard",
        printRequested: false,
        status: "بانتظار الدفع",
        totalAmount: planPrice,
        data: formData,
      });

      // Call Express Backend to create a Stripe Session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          userName: currentUser?.name || "عميل المركز",
          userEmail: currentUser?.email || "pending@example.com",
          packagePrice: planPrice,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "حدث خطأ أثناء الاتصال ببوابة الدفع. برجاء وضع مفتاح Stripe بالخادم.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Order submission error", error);
      alert("حدث خطأ غير متوقع.");
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { title: "تقديم البيانات", subtitle: "بيانات أمين السجل/العميل" },
    { title: "تحديد المسار", subtitle: "نقطة البدء وقالب التصميم" },
    { title: "تأكيد الإصدار", subtitle: "مراجعة الطلب والموافقة" },
    { title: "بدء التنفيذ", subtitle: "إتمام الدفع" }
  ];

  return (
    <div className="bg-brand-50 min-h-screen py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Navigation Back */}
        <div className="mb-6">
          <Link to={currentUser ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-medium transition">
            <ArrowRight className="w-4 h-4" /> العودة {currentUser ? "للوحة التحكم" : "للرئيسية"}
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-200 -z-10 translate-y-[-50%]"></div>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 ${
                step >= s ? 'bg-brand-600 border-brand-100 text-white' : 'bg-white border-brand-200 text-brand-400'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-center px-1">
            {stepsList.map((stepItem, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-sm md:text-base ${step >= i + 1 ? 'text-brand-900 font-bold' : 'text-brand-600 font-medium'}`}>{stepItem.title}</span>
                <span className={`text-[10px] md:text-xs mt-1 ${step >= i + 1 ? 'text-brand-700' : 'text-brand-400'}`}>{stepItem.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Content */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 p-8 md:p-12 mb-8">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تقديم البيانات</h2>
                <p className="text-brand-600">أدخل بيانات أمين السجل / العميل المعتمد للتواصل</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الإسم الأول (العميل وأمين السجل) *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.firstName} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} placeholder="الاسم الأول" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">اسم الأب *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.fatherName} onChange={(e)=>setFormData({...formData, fatherName: e.target.value})} placeholder="اسم الأب" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">اسم الجد *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.grandfatherName} onChange={(e)=>setFormData({...formData, grandfatherName: e.target.value})} placeholder="اسم الجد" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">اسم العائلة / اللقب *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.familyName} onChange={(e)=>setFormData({...formData, familyName: e.target.value})} placeholder="اسم العائلة" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">القبيلة (اختياري)</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.tribeName || ""} onChange={(e)=>setFormData({...formData, tribeName: e.target.value})} placeholder="القبيلة إن وجدت" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الدولة *</label>
                  <input type="text" placeholder="مثال: السعودية، الكويت، مصر..." className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.country} onChange={(e)=>setFormData({...formData, country: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-800 mb-2">الموطن الأصلي للعائلة *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.homeland || ""} onChange={(e)=>setFormData({...formData, homeland: e.target.value})} placeholder="" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تحديد المسار</h2>
                <p className="text-brand-600">حدد المعطيات الأساسية لتوثيق السجل</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xl font-medium text-brand-900 mb-2">
                  <UserPlus className="w-6 h-6 text-brand-600" />
                  نقطة بدء عمود النسب *
                </label>
                <div className="text-sm font-light text-brand-700 mb-6 bg-brand-50 p-6 rounded-xl border border-brand-100 leading-relaxed">
                  يقوم السجل على عنصر أساسي وهو توثيق عمود نسب أمين السجل / العميل ، ويمكن لأمين السجل إختيار أحد اسلافه (المشهورين) بدءاً من الأب او أحد الأجداد الذين يختارهم لبدء توثيق عمود النسب ، وبالطبع سيتم سرد سلسلة النسب التي تشمل أمين السجل / العميل تصاعدياً مروراً بنقطة البدء التي اختارها .
                </div>
                
                <div className="space-y-4 mb-8">
                  <label className="flex items-center gap-3 p-4 border border-brand-200 rounded-xl cursor-pointer hover:bg-brand-50 transition">
                    <input type="radio" name="startingPointType" className="w-5 h-5 text-brand-600 focus:ring-brand-500 border-gray-300" 
                      checked={formData.startingPointType === "أنا أمين السجل"} 
                      onChange={() => {
                        setFormData({...formData, startingPointType: "أنا أمين السجل", startingPoint: "أنا أمين السجل"});
                      }} 
                    />
                    <span className="font-medium text-brand-800">أنا أمين السجل سأكون نقطة البدء .</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-4 border border-brand-200 rounded-xl cursor-pointer hover:bg-brand-50 transition">
                    <input type="radio" name="startingPointType" className="w-5 h-5 text-brand-600 focus:ring-brand-500 border-gray-300" 
                      checked={formData.startingPointType === "اسم العائلة"} 
                      onChange={() => {
                        setFormData({...formData, startingPointType: "اسم العائلة", startingPoint: "اسم العائلة"});
                      }} 
                    />
                    <span className="font-medium text-brand-800">اسم العائلة سيكون نقطة البدء .</span>
                  </label>
                  
                  <div className="border border-brand-200 rounded-xl p-4 transition hover:bg-brand-50">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="pt-1">
                        <input type="radio" name="startingPointType" className="w-5 h-5 text-brand-600 focus:ring-brand-500 border-gray-300" 
                          checked={formData.startingPointType === "احد الأسلاف"} 
                          onChange={() => {
                            setFormData({...formData, startingPointType: "احد الأسلاف"});
                          }} 
                        />
                      </div>
                      <span className="font-medium text-brand-800 leading-tight">احد الأسلاف التاليين سيكون نقطة البدء - الجد الثالث بحد اقصى ( حدد مع ذكر الإسم ) .</span>
                    </label>
                    
                    {formData.startingPointType === "احد الأسلاف" && (
                      <div className="mt-4 mr-8 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <select className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500"
                          value={formData.startingPointAncestor || ""}
                          onChange={(e) => {
                            const ancestor = e.target.value;
                            let name = formData.startingPointName || "";
                            if (ancestor === "الأب") name = formData.fatherName || "";
                            if (ancestor === "الجد الاول") name = formData.grandfatherName || "";
                            if (ancestor === "الجد الثاني" || ancestor === "الجد الثالث") name = "";
                            const newVal = `${ancestor} - ${name}`;
                            setFormData({...formData, startingPointAncestor: ancestor, startingPointName: name, startingPoint: newVal});
                          }}
                        >
                          <option value="" disabled>اختر السلف...</option>
                          <option value="الأب">الأب</option>
                          <option value="الجد الاول">الجد الاول</option>
                          <option value="الجد الثاني">الجد الثاني</option>
                          <option value="الجد الثالث">الجد الثالث</option>
                        </select>
                        
                        {(formData.startingPointAncestor === "الجد الثاني" || formData.startingPointAncestor === "الجد الثالث") && (
                          <input type="text" className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 animate-in fade-in slide-in-from-top-2" 
                            placeholder="أدخل اسم السلف هنا..."
                            value={formData.startingPointName || ""}
                            onChange={(e) => {
                              const name = e.target.value;
                              const newVal = `${formData.startingPointAncestor || "السلف"} - ${name}`;
                              setFormData({...formData, startingPointName: name, startingPoint: newVal});
                            }}
                          />
                        )}
                        {(formData.startingPointAncestor === "الأب" || formData.startingPointAncestor === "الجد الاول") && (
                          <div className="text-sm text-brand-600 bg-brand-50 p-3 rounded-lg border border-brand-100">
                            تم تحديد الاسم تلقائياً: <strong>{formData.startingPointName}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-100">
                <label className="block text-xl font-medium text-brand-900 mb-2">اختيار القالب :</label>
                <div className="text-sm font-light text-brand-700 mb-6 bg-brand-50 p-4 rounded-xl border border-brand-100">
                  اختر نموذج قالب التصميم الفني الذي ترغب فيه لسجلك ( نوفر نوعين من التصاميم المميزة لكي يظهر فيه سجلك ) .
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <label className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center text-center gap-4 transition-all ${formData.designTemplate === "مودرن" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}`}>
                    <input type="radio" name="design" value="مودرن" className="hidden" checked={formData.designTemplate === "مودرن"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white shadow-inner mb-2 overflow-hidden relative">
                       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop')] opacity-40 bg-cover bg-center mix-blend-overlay"></div>
                       <span className="font-sans font-bold text-lg relative z-10">مودرن</span>
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج حديث "مودرن"</span>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center text-center gap-4 transition-all ${formData.designTemplate === "كلاسيكي" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}`}>
                    <input type="radio" name="design" value="كلاسيكي" className="hidden" checked={formData.designTemplate === "كلاسيكي"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-24 h-24 bg-gradient-to-br from-[#8c7355] to-[#4a3a28] rounded-2xl flex items-center justify-center text-white shadow-inner mb-2 overflow-hidden relative">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=200&auto=format&fit=crop')] opacity-40 bg-cover bg-center mix-blend-overlay"></div>
                      <span className="font-serif font-bold text-lg relative z-10">عتيق</span>
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج كلاسيكي</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تأكيد الإصدار</h2>
                <p className="text-brand-600">مراجعة بيانات الطلب والموافقة على الشروط</p>
              </div>

              <div className="bg-brand-50 p-6 rounded-2xl border border-brand-200 space-y-4">
                <h3 className="font-bold text-brand-900 border-b border-brand-200 pb-2">ملخص بيانات أمين السجل</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div className="col-span-2 md:col-span-1"><span className="text-brand-600">الاسم:</span> <strong className="text-brand-900">{formData.firstName} {formData.fatherName} {formData.grandfatherName} {formData.familyName}</strong></div>
                  <div><span className="text-brand-600">الدولة:</span> <strong className="text-brand-900">{formData.country}</strong></div>
                  <div><span className="text-brand-600">الموطن الأصلي:</span> <strong className="text-brand-900">{formData.homeland}</strong></div>
                  <div><span className="text-brand-600">القبيلة:</span> <strong className="text-brand-900">{formData.tribeName || "غير محدد"}</strong></div>
                </div>

                <h3 className="font-bold text-brand-900 border-b border-brand-200 pb-2 mt-4 pt-4">المسار والمخرجات</h3>
                <div className="grid grid-cols-1 gap-y-4 gap-x-2 text-sm pt-2">
                  <div>
                    <span className="text-brand-600">نقطة البدء:</span> 
                    <strong className="text-brand-900">
                      {formData.startingPointType === "أنا أمين السجل" ? `أنا أمين السجل (${formData.firstName} بن ${formData.fatherName})` :
                       formData.startingPointType === "اسم العائلة" ? `اسم العائلة (${formData.familyName})` :
                       formData.startingPointType === "احد الأسلاف" ? `${formData.startingPointAncestor || "احد الأسلاف"} (${formData.startingPointName})` :
                       formData.startingPoint || "-"}
                    </strong>
                  </div>
                  <div><span className="text-brand-600">قالب التصميم:</span> <strong className="text-brand-900">{formData.designTemplate}</strong></div>
                  <div className="mt-4 border-t border-brand-100 pt-4">
                    <span className="text-brand-600 block mb-2 font-bold text-base">الباقة</span>
                    <strong className="text-brand-900 block text-lg mb-2">السجل الأساسي ($1999) ويشمل</strong>
                    <ul className="list-disc list-inside text-brand-800 space-y-1">
                      <li>نسخة رقمية "الكترونية"</li>
                      <li>عدد 10 نسخ ورقية مطبوعة</li>
                      <li>بوستر مشجر عمود النسب الشامل</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-brand-100 p-6 rounded-2xl">
                <div className="mb-6 p-6 bg-brand-50 rounded-xl border border-brand-100 flex flex-col items-center text-center shadow-sm">
                  <span className="text-brand-800 block mb-3 font-bold text-sm">يجب الإطلاع على تفاصيل التعاقد ووثيقة تقديم الخدمة قبل الإقرار</span>
                  <a href="/legal" target="_blank" className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition shadow hover:shadow-md">
                    الإطلاع على عقد الخدمة <ArrowLeft className="w-4 h-4" />
                  </a>
                </div>
                <label className="flex items-start gap-4 cursor-pointer">
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                      checked={agreedToService}
                      onChange={(e) => setAgreedToService(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm text-brand-700 leading-relaxed font-semibold pt-0.5">
                    أقر بمراجعتي وموافقتي على تقديم الخدمة ، وأفهم أن العقد يصبح نافذاً بعد إتمام الدفع .
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-8 relative">
              {showInviteModal ? (
                <div className="bg-brand-50 p-8 rounded-3xl border border-brand-200 max-w-md mx-auto relative z-10 shadow-lg">
                  <button onClick={() => setShowInviteModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-bold text-brand-900 mb-2">كود دعوة</h3>
                  <p className="text-brand-600 mb-6 text-sm">أدخل كود الدعوة الخاص بك للمتابعة</p>
                  
                  <input 
                    type="text" 
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value);
                      setInviteError("");
                    }}
                    placeholder="أدخل الكود هنا" 
                    className="w-full text-center text-lg tracking-widest font-mono border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-4 mb-4" 
                  />
                  
                  {inviteError && <p className="text-red-500 text-sm mb-4">{inviteError}</p>}
                  
                  <button 
                    onClick={handleInviteSubmit}
                    disabled={isSubmitting || !inviteCode}
                    className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "جاري المعالجة..." : "تفعيل الكود والبدء"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">بدء التنفيذ والإعتماد</h2>
                  <p className="text-brand-700 text-lg mb-8 max-w-lg mx-auto">
                    سيتم تحويلك الآن لإتمام عملية الدفع (بشكل آمن عبر بوابة Stripe). بعد نجاح الدفع، سيتم تفعيل حسابك كأمين سجل لتبدأ بإدراج بياناتك الاختيارية والتواصل مع فريق البحث لمعرفة المستجدات.
                  </p>
                  
                  <div className="text-5xl font-mono text-brand-900 mb-8 font-bold border-y border-brand-100 py-6 mx-auto max-w-xs">
                    $1,999<span className="text-2xl text-brand-500 font-light">.00</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="flex justify-center items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 border border-brand-200 hover:border-brand-300 font-bold px-6 py-2 rounded-full mx-auto shadow-sm transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    لدي كود دعوة
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100">
          <button 
            type="button" 
            onClick={handlePrev} 
            disabled={step === 1 || isSubmitting || showInviteModal}
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 disabled:opacity-30 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={
                (step === 1 && (!formData.firstName || !formData.fatherName || !formData.grandfatherName || !formData.familyName || !formData.country || !formData.homeland)) ||
                (step === 2 && !formData.startingPoint) ||
                (step === 3 && !agreedToService)
              }
              className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={submitOrder} 
              disabled={isSubmitting || showInviteModal}
              className="px-10 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-500 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && !showInviteModal ? (
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>إتمام الدفع واعتماد الطلب <Check className="w-5 h-5 mr-2" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
