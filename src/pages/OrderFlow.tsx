import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { Check, ArrowRight, ArrowLeft, UserPlus, X } from "lucide-react";
import { useAppStore, FamilyData } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";

export function OrderFlow() {
  const [step, setStep] = useState(1);
  const { currentUser, placeOrder, orders, pendingOrderData, setPendingOrderData } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if they already have an order
  useEffect(() => {
    if (orders.find(o => o.userId === currentUser?.id)) {
      navigate("/dashboard", { replace: true });
    }
  }, [orders, currentUser, navigate]);

  // Jump to step if returning from other pages
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("payment") === "true") {
      setStep(5);
    } else if (searchParams.get("step") === "2") {
      setStep(2);
    } else if (searchParams.get("step") === "5") {
      setStep(5);
    }
  }, [location.search]);

  const [formData, setFormData] = useState<FamilyData>(pendingOrderData || {
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
    treeData: { nodes: [], edges: [] },
    shippingAddress: {
      name: "",
      phone: "",
      country: "",
      state: "",
      street: "",
      zip: "",
      notes: ""
    }
  });

  // Always update pending order data when formData changes to persist it through the flow
  useEffect(() => {
    setPendingOrderData(formData);
  }, [formData, setPendingOrderData]);

  const [agreedToService, setAgreedToService] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "installment">("full");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) navigate("/service-agreement");
  };

  const handlePrev = () => {
    if (step === 2) setStep(1);
    else if (step === 5) navigate("/e-signature");
  };

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
      const orderNumber = "ORD-" + Math.floor(1000000 + Math.random() * 9000000).toString();
      await placeOrder({
        id: orderId,
        orderNumber,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        plan: "invite",
        printRequested: false,
        status: "بإنتظار إتمام الدفع",
        priority: "عادي",
        recordType: "سجل أساسي",
        paymentStatus: "كود دعوة",
        issueStatus: "جاري التنفيذ",
        actionPhase: "مرحلة البحث",
        totalAmount: 0,
        data: formData,
      });

      // Navigate to success page mimicking Stripe
      window.location.href = `/dashboard?success=true&order_id=${orderId}&invite=true`;
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
      const orderNumber = "ORD-" + Math.floor(1000000 + Math.random() * 9000000).toString();
      const planPrice = paymentType === "full" ? 1780 : 693;
      const totalCost = paymentType === "full" ? 1780 : 1980;
      
      // Save order in Firestore with local pending state 
      await placeOrder({
        id: orderId,
        orderNumber,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        plan: "standard",
        printRequested: false,
        status: "بإنتظار إتمام الدفع",
        priority: "عادي",
        recordType: "سجل أساسي",
        paymentStatus: paymentType === "full" ? "مدفوع بالكامل" : "مدفوع أول دفعة",
        issueStatus: "بإنتظار إتمام الدفع", // Will change to جاري التنفيذ after payment hook, but for now we set it as waiting
        actionPhase: "مرحلة البحث",
        totalAmount: totalCost,
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
        <OrderStepper currentStep={step} />

        {/* Steps Content */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 p-8 md:p-12 mb-8">

          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تقديم البيانات</h2>
                <p className="text-brand-600">أدخل بيانات أمين السجل / العميل المعتمد للتواصل</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-brand-100 pb-12">
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

              <div className="bg-brand-50 p-6 md:p-8 rounded-2xl border border-brand-200 mt-8">
                <h3 className="text-xl font-bold text-brand-900 mb-2 flex items-center gap-2">محطة استلام السجل المطبوع</h3>
                <p className="text-sm text-brand-600 mb-6">احرص على دقة بيانات الشحن لضمان تسليم النسخ الورقية بأمان.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-800 mb-2">اسم المستلم *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.name || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, name: e.target.value}})} placeholder="الاسم الكامل" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">رقم الهاتف *</label>
                    <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" 
                      value={formData.shippingAddress?.phone || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, phone: e.target.value}})} placeholder="+0000000000" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الدولة *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.country || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, country: e.target.value}})} placeholder="الدولة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.state || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, state: e.target.value}})} placeholder="المدينة أو المحافظة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الرمز البريدي (اختياري)</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.zip || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, zip: e.target.value}})} placeholder="الرمز البريدي" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-800 mb-2">العنوان التفصيلي *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.street || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, street: e.target.value}})} placeholder="الحي، الشارع، المبنى، رقم الشقة" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-800 mb-2">ملاحظات الشحن (اختياري)</label>
                    <textarea className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 h-24 resize-none" 
                      value={formData.shippingAddress?.notes || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, notes: e.target.value}})} placeholder="أي ملاحظات تفصيلية لشركة الشحن..." />
                  </div>
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
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-4 transition-all ${formData.designTemplate === "مودرن" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}`}>
                    <input type="radio" name="design" value="مودرن" className="hidden" checked={formData.designTemplate === "مودرن"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm relative">
                       <img src="https://i.postimg.cc/KzTskNLd/Modern.png" alt="مسار مودرن" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج حديث "مودرن"</span>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-4 transition-all ${formData.designTemplate === "كلاسيكي" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}`}>
                    <input type="radio" name="design" value="كلاسيكي" className="hidden" checked={formData.designTemplate === "كلاسيكي"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm relative">
                       <img src="https://i.postimg.cc/cH35gmYj/Classic.png" alt="مسار كلاسيكي" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج كلاسيكي</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Removed Step 4 (Confirm Edition) from here */}

          {step === 5 && (
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
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mx-auto max-w-3xl mb-8">
                    <div 
                      onClick={() => setPaymentType("full")}
                      className={`flex-1 border-2 p-6 rounded-2xl cursor-pointer transition shadow-sm ${paymentType === "full" ? "border-brand-600 bg-brand-50" : "border-brand-100 bg-white hover:border-brand-300"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-brand-900">دفع كامل</h3>
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">خصم خاص</span>
                      </div>
                      <div className="text-4xl font-mono text-brand-900 font-bold mt-4 mb-2">
                        $1,780<span className="text-xl text-brand-500 font-light">.00</span>
                      </div>
                      <p className="text-sm text-brand-600 font-medium">دفعة واحدة ميسرة للمبلغ الإجمالي</p>
                    </div>

                    <div 
                      onClick={() => setPaymentType("installment")}
                      className={`flex-1 border-2 p-6 rounded-2xl cursor-pointer transition shadow-sm ${paymentType === "installment" ? "border-brand-600 bg-brand-50" : "border-brand-100 bg-white hover:border-brand-300"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-brand-900">نظام الدفعات</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">الإجمالي 1980$</span>
                      </div>
                      <div className="text-3xl font-mono text-brand-900 font-bold mt-4 mb-2">
                        $693<span className="text-xl text-brand-500 font-light">.00</span>
                      </div>
                      <p className="text-sm text-brand-600 font-medium leading-relaxed">الدفعة الأولى 35%<br/><span className="text-xs opacity-80">(دفعة ثانية عند التوثيق ونهائية عند التسليم)</span></p>
                    </div>
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
          
          {step < 5 ? (
            <button 
              onClick={handleNext} 
              disabled={
                (step === 1 && (!formData.firstName || !formData.fatherName || !formData.grandfatherName || !formData.familyName || !formData.country || !formData.homeland || !formData.shippingAddress?.name || !formData.shippingAddress?.phone || !formData.shippingAddress?.country || !formData.shippingAddress?.state || !formData.shippingAddress?.street)) ||
                (step === 2 && !formData.startingPoint)
              }
              className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 2 ? "تحويل للمراجعة والعقد" : "التالي"} <ArrowLeft className="w-5 h-5" />
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
