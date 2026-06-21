import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { Check, ArrowRight, ArrowLeft, UserPlus, X, GitMerge, Sparkles, Coins, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore, FamilyData } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import { getPhoneCode } from "../data/countries";
import { CountrySelectOptions } from "../data/CountrySelectOptions";
import { StateSelect } from "../data/StateSelect";

export function OrderFlow() {
  const [step, setStep] = useState(1);
  const { currentUser, placeOrder, orders, pendingOrderData, setPendingOrderData } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if they already have an order
  useEffect(() => {
    const existingOrder = orders.find(o => o.userId === currentUser?.id);
    if (existingOrder && existingOrder.status !== "بإنتظار إتمام الدفع" && existingOrder.status !== "بانتظار الدفع") {
      navigate("/dashboard", { replace: true });
    }
  }, [orders, currentUser, navigate]);

  // Jump to step if returning from other pages
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("payment") === "true") {
      setStep(4);
    } else if (searchParams.get("step") === "2") {
      setStep(2);
    } else if (searchParams.get("step") === "4") {
      setStep(4);
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
    designTemplate: "" as "فاخر" | "مودرن" | "كلاسيك", // temporarily allow empty string, or update type in lib/store.ts
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
    },
    mobileNumber: "",
    email: "",
    currentResidenceCountry: "",
    currentResidenceState: "",
    hasDeliveryAddress: false,
    deliveryAddress: {
      name: "",
      phone: "",
      country: "",
      state: "",
      street: "",
      zip: "",
      notes: ""
    }
  });

  useEffect(() => {
    if (currentUser?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: currentUser.email || "" }));
    }
  }, [currentUser, formData.email]);

  // Always update pending order data when formData changes to persist it through the flow
  useEffect(() => {
    setPendingOrderData(formData);
  }, [formData, setPendingOrderData]);

  const [agreedToService, setAgreedToService] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "installment">("full");
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsSubmitting(false);
        setShowPaymentConfirmationModal(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleNext = () => {
    window.scrollTo(0, 0);
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!formData.designTemplate) {
        alert("يرجى اختيار قالب التصميم قبل المتابعة");
        return;
      }
      navigate("/service-agreement");
    }
  };

  const handlePrev = () => {
    if (step === 2) setStep(1);
    else if (step === 4) navigate("/service-agreement");
  };

  const handleInviteSubmit = async () => {
    if (inviteCode !== "alpha24") {
      setInviteError("الكود المدخل غير صحيح");
      return;
    }
    setInviteError("");
    setIsSubmitting(true);
    try {
      if (!currentUser) {
        setPendingOrderData(formData);
        navigate("/auth?redirect=/order?step=4&invite=" + inviteCode);
        return;
      }
      
      const orderId = currentUser.id;
      const orderNumber = "ORD-" + Math.floor(1000000 + Math.random() * 9000000).toString();
      
      const finalData = { 
        ...formData, 
        contractUrl: pendingOrderData?.contractUrl || "", 
        contractId: pendingOrderData?.contractId || "",
        contractSigned: pendingOrderData?.contractSigned || false,
        signatureName: pendingOrderData?.signatureName || ""
      };

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
        contractSigned: true,
        contractSignedAt: new Date().toISOString(),
        contractUrl: finalData.contractUrl,
        data: finalData,
      });

      import("@/lib/emailService").then(({ sendManagementNewOrderEmail }) => {
        if (sendManagementNewOrderEmail) {
          sendManagementNewOrderEmail(orderNumber, finalData.familyName).catch(console.error);
        }
      });

      // Navigate to success page mimicking Stripe
      navigate(`/dashboard?success=true&order_id=${orderId}&invite=true`);
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
      
      // Merge any contract data generated in ESignature step
      const invoiceNumber = "INV-" + Math.floor(10000000 + Math.random() * 90000000).toString();
      const finalData = { 
        ...formData, 
        contractUrl: pendingOrderData?.contractUrl || "", 
        contractId: pendingOrderData?.contractId || "",
        contractSigned: pendingOrderData?.contractSigned || false,
        signatureName: pendingOrderData?.signatureName || ""
      };

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
        actionPhase: "بإنتظار إتمام الدفع",
        totalAmount: totalCost,
        contractSigned: true,
        contractSignedAt: new Date().toISOString(),
        contractUrl: finalData.contractUrl,
        invoiceNumber: invoiceNumber,
        data: finalData,
      });

      // We redirect directly to Stripe Payment Links with client_reference_id
      const paymentLink = paymentType === "full" 
        ? `https://buy.stripe.com/9B6aEY0Ax1dv3nY8tv8so04?client_reference_id=${orderId}`
        : `https://buy.stripe.com/7sY8wQ82Z6xP8Ii4df8so03?client_reference_id=${orderId}`;

      window.location.href = paymentLink;
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
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="flex items-center gap-2 text-brand-600 hover:text-brand-800 font-bold bg-white px-4 py-2 rounded-full border border-brand-200 shadow-sm transition-all hover:bg-brand-50"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </button>
          
          {currentUser && (
            <div className="flex items-center gap-3 text-sm font-medium text-brand-700 bg-white px-4 py-2 rounded-full border border-brand-100 shadow-sm">
              <UserPlus className="w-4 h-4 text-brand-500" />
              <span>{currentUser.name}</span>
              <button 
                onClick={() => { useAppStore.getState().logout(); navigate("/auth"); }} 
                className="text-red-500 hover:text-red-700 mr-2 text-xs font-bold border-r border-brand-100 pr-3"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="sticky top-0 z-50 bg-brand-50 pt-2 pb-4">
          <OrderStepper currentStep={step} />
        </div>

        {/* Payment Confirmation Modal */}
        {showPaymentConfirmationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden text-right py-8 px-8">
              <h3 className="text-2xl font-bold text-brand-900 mb-4 whitespace-pre-wrap leading-relaxed">
                تأكيد اختيار نظام الدفع
              </h3>
              <p className="text-brand-700 mb-6 font-medium">
                لقد اخترت نظام الدفع: <span className="font-bold text-brand-900">{paymentType === "full" ? "السداد المبكر بالكامل (1780 دولار)" : "الدفع المرن (مقسم على 3 دفعات - الدفعة الحالية 693 دولار)"}</span>.
                <br/><br/>
                هل أنت متأكد من رغبتك في إتمام عملية الدفع بهذا النظام؟
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaymentConfirmationModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
                >
                  رجوع وتعديل
                </button>
                <button
                  onClick={() => {
                    setShowPaymentConfirmationModal(false);
                    submitOrder();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 transition"
                >
                  تأكيد ومتابعة الدفع
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Steps Content */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 p-8 md:p-12 mb-8">

          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">بيانات أمين السجل</h2>
                <p className="text-brand-600 font-bold text-lg">تبدأ رحلة التوثيق من الشخص الذي يحمل مسؤولية حفظ الرواية</p>
              </div>
              
              {/* Section 1 */}
              <div className="bg-white border rounded-2xl p-6 border-brand-200 shadow-sm p-4 md:p-8">
                <div className="border-b border-brand-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-brand-900 mb-1">بيانات أمين السجل</h3>
                  <p className="text-sm text-brand-600">أدخل البيانات الأساسية التي سيُبنى عليها سجل تراث عائلتك</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الإسم الأول (أمين السجل) *</label>
                    <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.firstName} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} placeholder="الاسم الأول" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">اسم الأب *</label>
                    <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.fatherName} onChange={(e)=>setFormData({...formData, fatherName: e.target.value})} placeholder="اسم الأب" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">اسم الجد *</label>
                    <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.grandfatherName} onChange={(e)=>setFormData({...formData, grandfatherName: e.target.value})} placeholder="اسم الجد" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-white border rounded-2xl p-6 border-brand-200 shadow-sm p-4 md:p-8">
                <div className="border-b border-brand-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-brand-900 mb-1">بيانات الإنتماء العائلي</h3>
                  <p className="text-sm text-brand-600">أدخل البيانات الأساسية التي سيُبنى عليها سجل تراث عائلتك</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">إسم العائلة *</label>
                    <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.familyName} onChange={(e)=>setFormData({...formData, familyName: e.target.value})} placeholder="اسم العائلة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">القبيلة (اختياري)</label>
                    <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.tribeName || ""} onChange={(e)=>setFormData({...formData, tribeName: e.target.value})} placeholder="" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الموطن الأصلي للعائلة *</label>
                    <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.homeland || ""} onChange={(e)=>setFormData({...formData, homeland: e.target.value})} placeholder="" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الدولة (حيث الموطن الأصلي) *</label>
                    <select 
                      className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                      value={formData.country} 
                      onChange={(e)=>setFormData({...formData, country: e.target.value})}
                    >
                      <option value="" disabled>اختر الدولة...</option>
                      <CountrySelectOptions />
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-brand-50 border rounded-2xl p-6 border-brand-200 shadow-sm p-4 md:p-8 relative">
                <div className="border-b border-brand-200 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-brand-900 mb-1">بيانات التواصل والإقامة</h3>
                  <p className="text-sm text-brand-600">تُستخدم هذه البيانات للتواصل مع أمين السجل وإدارة الطلب وتسليم النسخ المطبوعة</p>
                </div>
                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">البريد الإلكتروني *</label>
                    <input autoComplete="new-password" type="email" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.email || ""} onChange={(e)=>setFormData({...formData, email: e.target.value})} placeholder="البريد الإلكتروني" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">دولة الإقامة الحالية *</label>
                    <select 
                      className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                      value={formData.currentResidenceCountry || ""} 
                      onChange={(e)=>{
                         const newCountry = e.target.value;
                         const code = getPhoneCode(newCountry);
                         setFormData(prev => {
                           return {
                             ...prev, 
                             currentResidenceCountry: newCountry,
                             mobileNumber: code
                           };
                         });
                      }}
                    >
                      <option value="" disabled>اختر الدولة...</option>
                      <CountrySelectOptions />
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                    <StateSelect 
                      countryId={formData.currentResidenceCountry} 
                      value={formData.currentResidenceState || ""} 
                      onChange={(val) => setFormData({...formData, currentResidenceState: val})} 
                      placeholder="المدينة / المحافظة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">رقم الجوال *</label>
                    <input autoComplete="new-password" type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" value={formData.mobileNumber || ""} onChange={(e)=>{
                         const val = e.target.value;
                         if (/^[\d+]*$/.test(val)) setFormData({...formData, mobileNumber: val});
                      }} placeholder="+0000000000" dir="ltr" />
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-200">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input autoComplete="new-password" 
                      type="checkbox" 
                      className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                      checked={formData.hasDeliveryAddress || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked && (!formData.shippingAddress?.name && !formData.shippingAddress?.phone)) {
                          const fullName = [formData.firstName, formData.fatherName, formData.grandfatherName, formData.familyName].filter(Boolean).join(" ");
                          setFormData({
                            ...formData, 
                            hasDeliveryAddress: checked,
                            shippingAddress: {
                              ...formData.shippingAddress,
                              name: fullName,
                              phone: formData.mobileNumber || formData.shippingAddress?.phone || "",
                              country: formData.currentResidenceCountry || formData.shippingAddress?.country || "",
                              state: formData.currentResidenceState || formData.shippingAddress?.state || ""
                            } as any
                          });
                        } else {
                          setFormData({...formData, hasDeliveryAddress: checked});
                        }
                      }}
                    />
                    <span className="font-bold text-lg text-brand-900 border-b border-brand-300 pb-1">أرغب باستلام النسخ المطبوعة من السجل</span>
                  </label>

                  {formData.hasDeliveryAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-white rounded-xl border border-brand-200 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="col-span-1 md:col-span-2 font-bold text-brand-900 mb-2">عنوان التوصيل</h4>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-800 mb-2">اسم المستلم *</label>
                        <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.shippingAddress?.name || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, name: e.target.value}})} placeholder="الاسم الكامل" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">رقم هاتف المستلم *</label>
                        <input autoComplete="new-password" type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" 
                          value={formData.shippingAddress?.phone || ""} onChange={(e)=>{
                             const val = e.target.value;
                             if (/^[\d+]*$/.test(val)) {
                                setFormData({...formData, shippingAddress: {...formData.shippingAddress, phone: val}});
                             }
                          }} placeholder="+0000000000" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">دولة التوصيل *</label>
                        <select 
                          className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                          value={formData.shippingAddress?.country || ""} 
                          onChange={(e)=>{
                             setFormData(prev => ({
                               ...prev, 
                               shippingAddress: {
                                 ...prev.shippingAddress, 
                                 country: e.target.value,
                                 phone: prev.shippingAddress?.phone || getPhoneCode(e.target.value)
                               }
                             }));
                          }}
                        >
                          <option value="" disabled>اختر الدولة...</option>
                          <CountrySelectOptions />
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                        <StateSelect 
                          countryId={formData.shippingAddress?.country || formData.currentResidenceCountry || ""} 
                          value={formData.shippingAddress?.state || ""} 
                          onChange={(val) => setFormData({...formData, shippingAddress: {...formData.shippingAddress, state: val}})} 
                          placeholder="المدينة أو المحافظة"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">الرمز البريدي</label>
                        <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.shippingAddress?.zip || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, zip: e.target.value}})} placeholder="الرمز البريدي" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-800 mb-2">العنوان التفصيلي *</label>
                        <input autoComplete="new-password" type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.shippingAddress?.street || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, street: e.target.value}})} placeholder="الحي، الشارع، المبنى، رقم الشقة" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mt-6 p-4">
                <p className="text-sm font-medium text-brand-600 bg-brand-50 border border-brand-100 rounded-full inline-block px-6 py-2 shadow-sm">
                  تُعامل جميع البيانات بخصوصية تامة، ولا تُستخدم إلا ضمن نطاق تنفيذ السجل وخدمات المنصة.
                </p>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">إعداد هوية السجل</h2>
                <p className="text-brand-600">في هذه الخطوة يتم تحديد أمين السجل واختيار قالب التصميم الخاص بالإصدار</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xl font-medium text-brand-900 mb-2">
                  <UserPlus className="w-6 h-6 text-brand-600" />
                  أمين السجل
                </label>
                <div className="text-sm font-light text-brand-700 mb-6 bg-brand-50 p-6 rounded-xl border border-brand-100 leading-relaxed">
                  يُبنى سجل تراث العائلة حول “أمين السجل”، بوصفه نقطة الانطلاق في توثيق عمود النسب، ومن خلاله يتم تنظيم الامتداد العائلي وربط الأجيال ضمن سجل واحد. <span className="font-bold">*سيظهر اسم أمين السجل على غلاف الإصدار الأساسي للسجل.</span>
                </div>
              </div>

              <div className="bg-brand-900/5 rounded-3xl p-8 mb-12 shadow-sm border border-[#802b30]/20 relative overflow-hidden mt-8 text-brand-900">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-[#802b30]/10 p-3 rounded-full backdrop-blur-sm mb-4">
                    <GitMerge className="w-8 h-8 text-[#802b30]" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-center mb-4 text-[#802b30]">مع عمود النسب تبدأ الرواية</h3>
                  <p className="text-brand-800 text-center max-w-2xl leading-relaxed mb-10 text-sm md:text-base font-medium">
                    بصفتك أمين السجل، فأنت نقطة الانطلاق في هذا التوثيق، والحلقة التي تصل إرث الأجداد بامتداد الأسرة في الحاضر والمستقبل.ومن خلالك يُبنى عمود النسب، وتُستكمل الرواية التي حملتها الأجيال عبر الزمن، لتبقى محفوظة في سجل يوثق الذاكرة والامتداد.ويعمل فريق البحث على تتبع هذه الرواية بمنهجية علمية، اعتمادًا على المصادر والروايات والوثائق ذات الصلة.
                  </p>

                  {/* Visual Tree */}
                  <div className="flex flex-col items-center select-none pt-2">
                     
                     {/* Beyond Family - Box 2 */}
                     <div className="bg-brand-100/50 text-[#802b30] border border-[#802b30]/30 rounded-full py-1 px-4 text-center text-xs z-10 border-dashed mb-0 font-bold">
                        جدود أعلى
                     </div>
                     <div className="h-4 w-0.5 border-l-2 border-[#802b30]/40 border-dashed mb-1" />

                     {/* Beyond Family - Box 1 */}
                     <div className="bg-brand-200/50 text-[#802b30] border border-[#802b30]/50 rounded-full py-1.5 px-5 text-center text-xs z-10 border-dashed mb-0 font-bold">
                        جد
                     </div>
                     <div className="h-4 w-0.5 border-l-2 border-[#802b30]/40 border-dashed" />

                     {/* Family Name */}
                     <div className="bg-[#802b30] text-white border border-[#802b30] rounded-full py-2 px-8 text-center z-10 font-bold mb-0 shadow-sm flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] text-brand-100/90 mb-0.5 font-sans font-medium">العائلة</span>
                        <span className="text-base leading-tight">{formData.familyName || "العائلة"}</span>
                     </div>
                     <div className="h-4 w-0.5 bg-[#802b30]/30" />

                     {/* Grandfather 1 */}
                     <div className="bg-brand-100/80 text-[#802b30] border border-[#802b30]/30 rounded-full py-1.5 px-6 text-center text-sm z-10 font-bold shadow-sm">
                        {formData.grandfatherName || "الجد الأول"}
                     </div>
                     <div className="h-4 w-0.5 bg-[#802b30]/30" />

                     {/* Father */}
                     <div className="bg-brand-100/80 text-[#802b30] border border-[#802b30]/30 rounded-full py-2 px-8 text-center z-10 font-bold shadow-sm">
                        {formData.fatherName || "الأب"}
                     </div>
                     
                     {/* Vertical Line from Father */}
                     <div className="h-6 w-0.5 bg-[#802b30]/30" />
                     
                     {/* Horizontal Line Connecting Branches */}
                     <div className="w-64 md:w-[24rem] h-0.5 bg-[#802b30]/30 flex justify-between relative">
                        <div className="h-6 w-0.5 bg-[#802b30]/30 absolute left-0 top-0" />
                        <div className="h-6 w-0.5 bg-[#802b30]/30 absolute left-1/2 -translate-x-1/2 top-0" />
                        <div className="h-6 w-0.5 bg-[#802b30]/30 absolute right-0 top-0" />
                     </div>

                     {/* Children Nodes (Siblings + You) */}
                     <div className="flex justify-between w-[17rem] md:w-[25rem] mt-6 relative items-start">
                        <div className="bg-white/80 border border-[#802b30]/20 shadow-sm rounded-xl py-2 w-20 md:w-24 text-center text-brand-800 font-bold text-xs backdrop-blur-sm border-dashed">
                           أخ / أخت
                        </div>
                        {/* Record Keeper Box with Children */}
                        <div className="flex flex-col items-center">
                          <div className="bg-[#802b30] text-white border-2 border-[#802b30] shadow-md rounded-full py-2 px-8 md:px-10 min-w-[120px] text-center relative z-10 font-bold font-serif -mt-2 flex flex-col items-center">
                             <span className="text-[10px] text-brand-100/90 mb-0.5 font-sans font-medium">أمين السجل</span>
                             <span className="text-lg leading-tight">{formData.firstName || "أنت"}</span>
                          </div>
                          
                          {/* Vertical Line from You */}
                          <div className="h-5 w-0.5 bg-[#802b30]/30" />
                          
                          {/* Horizontal Line for Your Children (4 children) */}
                          <div className="w-32 md:w-40 h-0.5 bg-[#802b30]/30 flex justify-between relative">
                            <div className="h-4 w-0.5 bg-[#802b30]/30 absolute left-0 top-0" />
                            <div className="h-4 w-0.5 bg-[#802b30]/30 absolute left-[33%] top-0" />
                            <div className="h-4 w-0.5 bg-[#802b30]/30 absolute left-[66%] top-0" />
                            <div className="h-4 w-0.5 bg-[#802b30]/30 absolute right-0 top-0" />
                          </div>
                          
                          {/* Your Children Nodes */}
                          <div className="flex justify-between w-[9.5rem] md:w-[11.5rem] mt-4 relative items-start gap-1">
                             <div className="bg-white/60 border border-[#802b30]/30 shadow-sm border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-800 font-bold text-[8px] md:text-[9px]">
                               إبن / إبنة
                             </div>
                             <div className="bg-white/60 border border-[#802b30]/30 shadow-sm border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-800 font-bold text-[8px] md:text-[9px]">
                               إبن / إبنة
                             </div>
                             <div className="bg-white/60 border border-[#802b30]/30 shadow-sm border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-800 font-bold text-[8px] md:text-[9px]">
                               إبن / إبنة
                             </div>
                             <div className="bg-white/60 border border-[#802b30]/30 shadow-sm border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-800 font-bold text-[8px] md:text-[9px]">
                               إبن / إبنة
                             </div>
                          </div>
                        </div>
                        <div className="bg-white/80 border border-[#802b30]/20 shadow-sm rounded-xl py-2 w-20 md:w-24 text-center text-brand-800 font-bold text-xs backdrop-blur-sm border-dashed">
                           أخ / أخت
                        </div>
                     </div>
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
                    <input autoComplete="new-password" type="radio" name="design" value="مودرن" className="hidden" checked={formData.designTemplate === "مودرن"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-brand-100 bg-white flex items-center justify-center p-2">
                       <img src="https://i.postimg.cc/KzTskNLd/Modern.png" alt="مسار مودرن" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="font-bold text-brand-900 text-lg block mb-1">النموذج الحديث</span>
                      <span className="text-sm text-brand-600 font-medium">تصميم معاصر بإخراج بصري أنيق ولمسات تحريرية حديثة</span>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-4 transition-all ${formData.designTemplate === "كلاسيكي" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}`}>
                    <input autoComplete="new-password" type="radio" name="design" value="كلاسيكي" className="hidden" checked={formData.designTemplate === "كلاسيكي"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-brand-100 bg-white flex items-center justify-center p-2">
                       <img src="https://i.postimg.cc/cH35gmYj/Classic.png" alt="مسار كلاسيكي" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="font-bold text-brand-900 text-lg block mb-1">النموذج الكلاسيكي</span>
                      <span className="text-sm text-brand-600 font-medium">طابع تراثي هادئ مستلهم من السجلات العائلية التقليدية.</span>
                    </div>
                  </label>
                </div>
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
                  
                  <input autoComplete="new-password" 
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
                  <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">بدء التنفيذ وإتمام الدفع</h2>
                  <p className="text-brand-700 text-lg mb-8 max-w-lg mx-auto">
                    سيتم تحويلك الآن لإتمام عملية الدفع (بشكل آمن عبر بوابة Stripe). بعد نجاح الدفع، سيتم تفعيل حسابك كأمين سجل لتبدأ بإدراج بياناتك الاختيارية والتواصل مع فريق البحث لمعرفة المستجدات.
                  </p>
                  
                  <div className="flex flex-col items-stretch mx-auto max-w-xl mb-12 mt-4 space-y-4">
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-serif font-bold mb-4 text-brand-900 border-b border-brand-100 pb-4">الاستثمار في حفظ إرث العائلة</h3>
                      <div className="inline-block bg-white px-6 py-4 rounded-3xl border border-brand-200 shadow-sm max-w-full block">
                        <div className="text-4xl font-bold text-brand-600 font-mono mb-2" dir="rtl">١،٩٨٠ دولار</div>
                        <p className="text-brand-700 text-sm font-medium px-2">يشمل الإصدار الأساسي من "سجل تراث العائلة"</p>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-lg mb-2 font-serif text-brand-900 text-center">خيارات تنفيذ المشروع</h4>
                    
                    {/* Full Payment Option */}
                    <div className={`p-4 lg:p-5 rounded-2xl border transition-colors cursor-pointer overflow-hidden ${paymentType === 'full' ? 'bg-[#fef1f2] border-brand-600 shadow-md ring-1 ring-brand-300' : 'bg-white border-brand-200 hover:bg-brand-50'}`} onClick={() => setPaymentType('full')}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                           <div className={`p-2 lg:p-3 rounded-full shrink-0 shadow-sm border ${paymentType === 'full' ? 'bg-brand-100 border-brand-300' : 'bg-white border-brand-100'}`}>
                             <Sparkles className="text-brand-500 w-5 h-5 lg:w-6 lg:h-6"/>
                           </div>
                            <span className="font-bold text-base lg:text-lg text-brand-900 leading-tight">استفد من خصم السداد المبكر</span>
                        </div>
                        <ChevronDown className={`w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto transition-transform ${paymentType === 'full' ? 'rotate-180' : ''}`} />
                      </div>
                      <AnimatePresence>
                        {paymentType === "full" && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-6 pt-2 space-y-4 text-center">
                              <div className="text-base lg:text-lg text-center mb-4 bg-white rounded-xl py-3 border border-brand-200 shadow-sm mx-auto max-w-xs">
                                 قيمة السداد المبكر: <br/><span className="font-bold text-brand-600 font-mono text-2xl block mt-1" dir="ltr">١،٧٨٠ دولار</span>
                              </div>
                              <p className="text-sm text-brand-800 bg-white p-4 rounded-xl leading-relaxed text-right border-r-4 border-r-brand-400 w-full shadow-sm">
                                تتضمن الامتيازات اولوية الجدولة لمراحل البحث والتوثيق والتسليم باللإضافة الي التوصيل السريع.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Flexible Payment Option */}
                    <div className={`p-4 lg:p-5 rounded-2xl border transition-colors cursor-pointer overflow-hidden ${paymentType === 'installment' ? 'bg-[#fef1f2] border-brand-600 shadow-md ring-1 ring-brand-300' : 'bg-white border-brand-200 hover:bg-brand-50'}`} onClick={() => setPaymentType('installment')}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                           <div className={`p-2 lg:p-3 rounded-full shrink-0 shadow-sm border ${paymentType === 'installment' ? 'bg-brand-100 border-brand-300' : 'bg-white border-brand-100'}`}>
                             <Coins className="text-brand-500 w-5 h-5 lg:w-6 lg:h-6"/>
                           </div>
                           <span className="font-bold text-base lg:text-lg text-brand-900">خيار الدفع المرن</span>
                        </div>
                        <ChevronDown className={`w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto transition-transform ${paymentType === 'installment' ? 'rotate-180' : ''}`} />
                      </div>
                      <AnimatePresence>
                        {paymentType === "installment" && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-6 text-sm text-brand-800 bg-white p-5 rounded-xl space-y-4 shadow-sm text-right border-r-4 border-r-brand-400">
                              <p className="font-bold text-brand-900 border-b border-brand-100 pb-2 mb-4">يمكن توزيع قيمة المشروع على ٣ مراحل ميسرة:</p>
                              <ul className="space-y-4 font-medium">
                                <li className="flex items-start gap-3"><div className="w-2 h-2 mt-2 bg-brand-400 rounded-full shrink-0"></div> دفعة أولى: 35% عند تفعيل الطلب – مرحلة البحث</li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 mt-2 bg-brand-400 rounded-full shrink-0"></div> دفعة ثانية: 35% عند انتهاء مرحلة التوثيق</li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 mt-2 bg-brand-400 rounded-full shrink-0"></div> دفعة ثالثة: 30% عند انتهاء العمل</li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="text-xs text-brand-600 mt-6 pt-5 border-t border-brand-100 font-light leading-relaxed text-center opacity-80">
                      * نقبل عددًا محدودًا من مشاريع التوثيق شهريًا حفاظًا على جودة البحث والتوثيق.<br/>
                      * تنطبق الشروط والأحكام على جميع الخدمات.
                    </div>
                  </div>
                  
                  <div className="text-center mt-12 mb-8 bg-brand-50 rounded-full py-4 px-6 inline-block mx-auto">
                    <p className="text-sm font-bold text-brand-600 opacity-90">بعض الروايات تضيع… لأنها لم تُوثق.</p>
                    <p className="text-xs text-brand-800 mt-1">ابدأ اليوم إنشاء سجل عائلي يوثق عمود نسبكم ويحفظ الذاكرة العائلية للأجيال القادمة.</p>
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
                (step === 1 && (!formData.firstName || !formData.fatherName || !formData.grandfatherName || !formData.familyName || !formData.country || !formData.homeland || !formData.email || !formData.mobileNumber || !formData.currentResidenceCountry || !formData.currentResidenceState || (formData.hasDeliveryAddress && (!formData.shippingAddress?.name || !formData.shippingAddress?.phone || !formData.shippingAddress?.country || !formData.shippingAddress?.state || !formData.shippingAddress?.street)))) ||
                (step === 2 && !formData.designTemplate)
              }
              className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              حفظ ومتابعة <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => {
                if (paymentType === "full") {
                  submitOrder();
                } else {
                  setShowPaymentConfirmationModal(true);
                }
              }} 
              disabled={isSubmitting || showInviteModal}
              className="px-10 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && !showInviteModal ? (
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>إتمام الدفع</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
