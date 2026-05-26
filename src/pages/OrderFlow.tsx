import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { Check, ArrowRight, ArrowLeft, UserPlus, X, GitMerge } from "lucide-react";
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
                <p className="text-brand-600">أدخل بيانات العميل / أمين السجل</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-brand-100 pb-12">
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الإسم الأول (العميل / أمين السجل) *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.firstName} onChange={(e)=>{
                    setFormData(prev => ({
                      ...prev, 
                      firstName: e.target.value
                    }));
                  }} placeholder="الاسم الأول" />
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
                  <label className="block text-sm font-medium text-brand-800 mb-2">إسم العائلة *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.familyName} onChange={(e)=>setFormData({...formData, familyName: e.target.value})} placeholder="اسم العائلة" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">القبيلة (اختياري)</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.tribeName || ""} onChange={(e)=>setFormData({...formData, tribeName: e.target.value})} placeholder="القبيلة إن وجدت" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الدولة *</label>
                  <select 
                    className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                    value={formData.country} 
                    onChange={(e)=>{
                       const getPhoneCode = (c: string) => {
                         const codes: Record<string, string> = { "السعودية": "+966", "اليمن": "+967", "عمان": "+968", "الامارات": "+971", "الكويت": "+965", "قطر": "+974", "البحرين": "+973", "العراق": "+964", "سوريا": "+963", "الاردن": "+962", "فلسطين": "+970", "مصر": "+20", "ليبيا": "+218", "الجزائر": "+213", "المغرب": "+212", "موريتانيا": "+222", "السودان": "+249", "الصومال": "+252", "جيبوتي": "+253", "جزر القمر": "+269", "زنجبار": "+255", "ايران": "+98", "تركيا": "+90", "افغانستان": "+93", "الهند": "+91", "البرازيل": "+55", "الارجنتين": "+54", "استراليا": "+61", "المملكة المتحدة": "+44", "كندا": "+1", "فرنسا": "+33", "المانيا": "+49", "اسبانيا": "+34", "ايطاليا": "+39", "ماليزيا": "+60", "اندونيسيا": "+62" };
                         return codes[c] || "";
                       };
                       setFormData(prev => ({
                         ...prev, 
                         country: e.target.value,
                         shippingAddress: {
                           ...prev.shippingAddress,
                           country: prev.shippingAddress?.country || e.target.value,
                           phone: getPhoneCode(e.target.value)
                         }
                       }));
                    }}
                  >
                    <option value="" disabled>اختر الدولة...</option>
                    <optgroup label="شبة الجزيرة العربية">
                      <option value="السعودية">المملكة العربية السعودية</option>
                      <option value="اليمن">اليمن</option>
                      <option value="عمان">سلطنة عمان</option>
                      <option value="الامارات">الإمارات العربية المتحدة</option>
                      <option value="الكويت">الكويت</option>
                      <option value="قطر">قطر</option>
                      <option value="البحرين">البحرين</option>
                    </optgroup>
                    <optgroup label="أسيا العربية ( الهلال الخصيب )">
                      <option value="العراق">العراق</option>
                      <option value="سوريا">سوريا</option>
                      <option value="الاردن">الأردن</option>
                      <option value="فلسطين">فلسطين</option>
                    </optgroup>
                    <optgroup label="شمال أفريقيا">
                      <option value="مصر">مصر</option>
                      <option value="ليبيا">ليبيا</option>
                      <option value="الجزائر">الجزائر</option>
                      <option value="المغرب">المغرب</option>
                      <option value="موريتانيا">موريتانيا</option>
                      <option value="السودان">السودان</option>
                    </optgroup>
                    <optgroup label="شرق أفريقيا">
                      <option value="الصومال">الصومال</option>
                      <option value="جيبوتي">جيبوتي</option>
                      <option value="جزر القمر">جزر القمر</option>
                      <option value="زنجبار">زنجبار</option>
                    </optgroup>
                    <optgroup label="باقي دول العالم">
                      <option value="المملكة المتحدة">المملكة المتحدة (بريطانيا)</option>
                      <option value="كندا">كندا</option>
                      <option value="فرنسا">فرنسا</option>
                      <option value="المانيا">ألمانيا</option>
                      <option value="اسبانيا">إسبانيا</option>
                      <option value="ايطاليا">إيطاليا</option>
                      <option value="تركيا">تركيا</option>
                      <option value="ايران">إيران</option>
                      <option value="افغانستان">أفغانستان</option>
                      <option value="الهند">الهند</option>
                      <option value="ماليزيا">ماليزيا</option>
                      <option value="اندونيسيا">إندونيسيا</option>
                      <option value="البرازيل">البرازيل</option>
                      <option value="الارجنتين">الأرجنتين</option>
                      <option value="استراليا">أستراليا</option>
                    </optgroup>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-800 mb-2">الموطن الأصلي للعائلة *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.homeland || ""} onChange={(e)=>setFormData({...formData, homeland: e.target.value})} placeholder="" />
                </div>
              </div>

              <div className="bg-brand-50 p-6 md:p-8 rounded-2xl border border-brand-200 mt-8">
                <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">العنوان البريدي</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-800 mb-2">اسم المستلم *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.name || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, name: e.target.value}})} placeholder="الاسم الكامل" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">رقم الهاتف *</label>
                    <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" 
                      value={formData.shippingAddress?.phone || ""} onChange={(e)=>{
                         const val = e.target.value;
                         if (/^[\d+]*$/.test(val)) {
                            setFormData({...formData, shippingAddress: {...formData.shippingAddress, phone: val}});
                         }
                      }} placeholder="+0000000000" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الدولة *</label>
                    <select 
                      className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                      value={formData.shippingAddress?.country || ""} 
                      onChange={(e)=>{
                         const getPhoneCode = (c: string) => {
                           const codes: Record<string, string> = { "السعودية": "+966", "اليمن": "+967", "عمان": "+968", "الامارات": "+971", "الكويت": "+965", "قطر": "+974", "البحرين": "+973", "العراق": "+964", "سوريا": "+963", "الاردن": "+962", "فلسطين": "+970", "مصر": "+20", "ليبيا": "+218", "الجزائر": "+213", "المغرب": "+212", "موريتانيا": "+222", "السودان": "+249", "الصومال": "+252", "جيبوتي": "+253", "جزر القمر": "+269", "زنجبار": "+255", "ايران": "+98", "تركيا": "+90", "افغانستان": "+93", "الهند": "+91", "البرازيل": "+55", "الارجنتين": "+54", "استراليا": "+61", "المملكة المتحدة": "+44", "كندا": "+1", "فرنسا": "+33", "المانيا": "+49", "اسبانيا": "+34", "ايطاليا": "+39", "ماليزيا": "+60", "اندونيسيا": "+62" };
                           return codes[c] || "";
                         };
                         setFormData(prev => ({
                           ...prev, 
                           shippingAddress: {
                             ...prev.shippingAddress, 
                             country: e.target.value,
                             phone: getPhoneCode(e.target.value)
                           }
                         }));
                      }}
                    >
                      <option value="" disabled>اختر الدولة...</option>
                      <optgroup label="شبة الجزيرة العربية">
                        <option value="السعودية">المملكة العربية السعودية</option>
                        <option value="اليمن">اليمن</option>
                        <option value="عمان">سلطنة عمان</option>
                        <option value="الامارات">الإمارات العربية المتحدة</option>
                        <option value="الكويت">الكويت</option>
                        <option value="قطر">قطر</option>
                        <option value="البحرين">البحرين</option>
                      </optgroup>
                      <optgroup label="أسيا العربية ( الهلال الخصيب )">
                        <option value="العراق">العراق</option>
                        <option value="سوريا">سوريا</option>
                        <option value="الاردن">الأردن</option>
                        <option value="فلسطين">فلسطين</option>
                      </optgroup>
                      <optgroup label="شمال أفريقيا">
                        <option value="مصر">مصر</option>
                        <option value="ليبيا">ليبيا</option>
                        <option value="الجزائر">الجزائر</option>
                        <option value="المغرب">المغرب</option>
                        <option value="موريتانيا">موريتانيا</option>
                        <option value="السودان">السودان</option>
                      </optgroup>
                      <optgroup label="شرق أفريقيا">
                        <option value="الصومال">الصومال</option>
                        <option value="جيبوتي">جيبوتي</option>
                        <option value="جزر القمر">جزر القمر</option>
                        <option value="زنجبار">زنجبار</option>
                      </optgroup>
                      <optgroup label="باقي دول العالم">
                        <option value="المملكة المتحدة">المملكة المتحدة (بريطانيا)</option>
                        <option value="كندا">كندا</option>
                        <option value="فرنسا">فرنسا</option>
                        <option value="المانيا">ألمانيا</option>
                        <option value="اسبانيا">إسبانيا</option>
                        <option value="ايطاليا">إيطاليا</option>
                        <option value="تركيا">تركيا</option>
                        <option value="ايران">إيران</option>
                        <option value="افغانستان">أفغانستان</option>
                        <option value="الهند">الهند</option>
                        <option value="ماليزيا">ماليزيا</option>
                        <option value="اندونيسيا">إندونيسيا</option>
                        <option value="البرازيل">البرازيل</option>
                        <option value="الارجنتين">الأرجنتين</option>
                        <option value="استراليا">أستراليا</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.state || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, state: e.target.value}})} placeholder="المدينة أو المحافظة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الرمز البريدي</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.zip || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, zip: e.target.value}})} placeholder="الرمز البريدي" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-800 mb-2">العنوان التفصيلي *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                      value={formData.shippingAddress?.street || ""} onChange={(e)=>setFormData({...formData, shippingAddress: {...formData.shippingAddress, street: e.target.value}})} placeholder="الحي، الشارع، المبنى، رقم الشقة" />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-200">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                      checked={formData.hasDeliveryAddress || false}
                      onChange={(e)=>setFormData({...formData, hasDeliveryAddress: e.target.checked})}
                    />
                    <span className="font-medium text-brand-900">لدي عنوان أخر للتوصيل</span>
                  </label>

                  {formData.hasDeliveryAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-800 mb-2">اسم المستلم للتوصيل *</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.name || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, name: e.target.value}})} placeholder="الاسم الكامل" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">رقم الهاتف للتوصيل *</label>
                        <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" 
                          value={formData.deliveryAddress?.phone || ""} onChange={(e)=>{
                             const val = e.target.value;
                             if (/^[\d+]*$/.test(val)) {
                                setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, phone: val}});
                             }
                          }} placeholder="+0000000000" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">الدولة للتوصيل *</label>
                        <select 
                          className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                          value={formData.deliveryAddress?.country || ""} 
                          onChange={(e)=>{
                             const getPhoneCode = (c: string) => {
                               const codes: Record<string, string> = { "السعودية": "+966", "اليمن": "+967", "عمان": "+968", "الامارات": "+971", "الكويت": "+965", "قطر": "+974", "البحرين": "+973", "العراق": "+964", "سوريا": "+963", "الاردن": "+962", "فلسطين": "+970", "مصر": "+20", "ليبيا": "+218", "الجزائر": "+213", "المغرب": "+212", "موريتانيا": "+222", "السودان": "+249", "الصومال": "+252", "جيبوتي": "+253", "جزر القمر": "+269", "زنجبار": "+255", "ايران": "+98", "تركيا": "+90", "افغانستان": "+93", "الهند": "+91", "البرازيل": "+55", "الارجنتين": "+54", "استراليا": "+61", "المملكة المتحدة": "+44", "كندا": "+1", "فرنسا": "+33", "المانيا": "+49", "اسبانيا": "+34", "ايطاليا": "+39", "ماليزيا": "+60", "اندونيسيا": "+62" };
                               return codes[c] || "";
                             };
                             setFormData(prev => ({
                               ...prev, 
                               deliveryAddress: {
                                 ...prev.deliveryAddress, 
                                 country: e.target.value,
                                 phone: getPhoneCode(e.target.value)
                               }
                             }));
                          }}
                        >
                          <option value="" disabled>اختر الدولة...</option>
                          <optgroup label="شبة الجزيرة العربية">
                            <option value="السعودية">المملكة العربية السعودية</option>
                            <option value="اليمن">اليمن</option>
                            <option value="عمان">سلطنة عمان</option>
                            <option value="الامارات">الإمارات العربية المتحدة</option>
                            <option value="الكويت">الكويت</option>
                            <option value="قطر">قطر</option>
                            <option value="البحرين">البحرين</option>
                          </optgroup>
                          <optgroup label="أسيا العربية ( الهلال الخصيب )">
                            <option value="العراق">العراق</option>
                            <option value="سوريا">سوريا</option>
                            <option value="الاردن">الأردن</option>
                            <option value="فلسطين">فلسطين</option>
                          </optgroup>
                          <optgroup label="شمال أفريقيا">
                            <option value="مصر">مصر</option>
                            <option value="ليبيا">ليبيا</option>
                            <option value="الجزائر">الجزائر</option>
                            <option value="المغرب">المغرب</option>
                            <option value="موريتانيا">موريتانيا</option>
                            <option value="السودان">السودان</option>
                          </optgroup>
                          <optgroup label="شرق أفريقيا">
                            <option value="الصومال">الصومال</option>
                            <option value="جيبوتي">جيبوتي</option>
                            <option value="جزر القمر">جزر القمر</option>
                            <option value="زنجبار">زنجبار</option>
                          </optgroup>
                          <optgroup label="باقي دول العالم">
                            <option value="المملكة المتحدة">المملكة المتحدة (بريطانيا)</option>
                            <option value="كندا">كندا</option>
                            <option value="فرنسا">فرنسا</option>
                            <option value="المانيا">ألمانيا</option>
                            <option value="اسبانيا">إسبانيا</option>
                            <option value="ايطاليا">إيطاليا</option>
                            <option value="تركيا">تركيا</option>
                            <option value="ايران">إيران</option>
                            <option value="افغانستان">أفغانستان</option>
                            <option value="الهند">الهند</option>
                            <option value="ماليزيا">ماليزيا</option>
                            <option value="اندونيسيا">إندونيسيا</option>
                            <option value="البرازيل">البرازيل</option>
                            <option value="الارجنتين">الأرجنتين</option>
                            <option value="استراليا">أستراليا</option>
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة للتوصيل *</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.state || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, state: e.target.value}})} placeholder="المدينة أو المحافظة" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">الرمز البريدي</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.zip || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, zip: e.target.value}})} placeholder="الرمز البريدي" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-800 mb-2">العنوان التفصيلي للتوصيل *</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.street || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, street: e.target.value}})} placeholder="الحي، الشارع، المبنى، رقم الشقة" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تحديد النطاق</h2>
                <p className="text-brand-600">تحديد نقطة العرض الأساسية وقالب التصميم</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xl font-medium text-brand-900 mb-2">
                  <UserPlus className="w-6 h-6 text-brand-600" />
                  نقطة العرض الأساسية *
                </label>
                <div className="text-sm font-light text-brand-700 mb-6 bg-brand-50 p-6 rounded-xl border border-brand-100 leading-relaxed">
                  يقوم السجل على عنصر أساسي وهو توثيق عمود نسب أمين السجل / العميل ، ومربع أمين السجل هو نقطة الانطلاق في توثيق هذه الشجرة.
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-3xl p-8 text-white mb-12 shadow-xl border border-brand-700 relative overflow-hidden mt-8">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-brand-50/10 p-3 rounded-full backdrop-blur-sm mb-4">
                    <GitMerge className="w-8 h-8 text-brand-100" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-center mb-4">أمين السجل.. جذع المبنى ومركز التوثيق</h3>
                  <p className="text-brand-100 text-center max-w-2xl leading-relaxed mb-10 text-sm md:text-base">
                   بصفتك أمين السجل، أنت تمثل الحلقة الجوهرية التي تربط الماضي بالمستقبل. اسمك هو نقطة الانطلاق في توثيق هذه الشجرة، ومن خلالك تتفرع الأغصان لتمتد إلى الأبناء والأحفاد المحتمل إضافتهم لاحقاً، مرسخةً إرث العائلة للأجيال القادمة.
                  </p>

                  {/* Visual Tree */}
                  <div className="flex flex-col items-center select-none pt-2">
                     
                     {/* Beyond Family - Box 2 */}
                     <div className="bg-brand-900/40 text-brand-200 border border-brand-500/50 rounded-full py-1 px-4 text-center text-xs z-10 border-dashed mb-0">
                        الجد الأعلى
                     </div>
                     <div className="h-4 w-0.5 border-l-2 border-brand-200/40 border-dashed mb-1" />

                     {/* Beyond Family - Box 1 */}
                     <div className="bg-brand-900/60 text-brand-100 border border-brand-500/70 rounded-full py-1.5 px-5 text-center text-xs z-10 border-dashed mb-0">
                        القبيلة / الفخذ
                     </div>
                     <div className="h-4 w-0.5 border-l-2 border-brand-200/40 border-dashed" />

                     {/* Family Name */}
                     <div className="text-brand-300 text-xs tracking-wide opacity-80 uppercase mb-1">العائلة</div>
                     <div className="bg-brand-900 text-brand-100 border border-brand-500 rounded-full py-1.5 px-6 text-center text-sm z-10 font-bold mb-0">
                        {formData.familyName || "العائلة"}
                     </div>
                     <div className="h-4 w-0.5 bg-brand-200/50" />

                     {/* Grandfather 1 */}
                     <div className="bg-brand-800/80 border border-brand-400 rounded-full py-1.5 px-6 text-center text-brand-50 text-sm z-10 font-bold">
                        {formData.grandfatherName || "الجد الأول"}
                     </div>
                     <div className="h-4 w-0.5 bg-brand-200/50" />

                     {/* Father */}
                     <div className="bg-brand-800/80 border border-brand-400 rounded-full py-2 px-8 text-center text-brand-50 z-10 font-bold">
                        {formData.fatherName || "الأب"}
                     </div>
                     
                     {/* Vertical Line from Father */}
                     <div className="h-6 w-0.5 bg-brand-200/50" />
                     
                     {/* Horizontal Line Connecting Branches */}
                     <div className="w-64 md:w-[24rem] h-0.5 bg-brand-200/50 flex justify-between relative">
                        <div className="h-6 w-0.5 bg-brand-200/50 absolute left-0 top-0" />
                        <div className="h-6 w-0.5 bg-brand-200/50 absolute left-1/2 -translate-x-1/2 top-0" />
                        <div className="h-6 w-0.5 bg-brand-200/50 absolute right-0 top-0" />
                     </div>

                     {/* Children Nodes (Siblings + You) */}
                     <div className="flex justify-between w-[17rem] md:w-[25rem] mt-6 relative items-start">
                        <div className="bg-brand-800/60 border border-brand-300/30 rounded-xl py-2 w-20 md:w-24 text-center text-brand-200 text-xs backdrop-blur-sm border-dashed">
                           أخ / أخت
                        </div>
                        {/* Record Keeper Box with Children */}
                        <div className="flex flex-col items-center">
                          <div className="bg-white text-brand-900 border-2 border-brand-200 shadow-[0_0_25px_rgba(255,255,255,0.15)] rounded-full py-2 px-6 md:px-8 min-w-[80px] text-center relative z-10 font-bold font-serif -mt-2">
                             {formData.firstName || "أنت"}
                          </div>
                          
                          {/* Vertical Line from You */}
                          <div className="h-5 w-0.5 bg-brand-200/50" />
                          
                          {/* Horizontal Line for Your Children (4 children) */}
                          <div className="w-32 md:w-40 h-0.5 bg-brand-200/50 flex justify-between relative">
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute left-0 top-0" />
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute left-[33%] top-0" />
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute left-[66%] top-0" />
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute right-0 top-0" />
                          </div>
                          
                          {/* Your Children Nodes */}
                          <div className="flex justify-between w-[9.5rem] md:w-[11.5rem] mt-4 relative items-start gap-1">
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبن
                             </div>
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبنة
                             </div>
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبن
                             </div>
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبنة
                             </div>
                          </div>
                        </div>
                        <div className="bg-brand-800/60 border border-brand-300/30 rounded-xl py-2 w-20 md:w-24 text-center text-brand-200 text-xs backdrop-blur-sm border-dashed">
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
                    <input type="radio" name="design" value="مودرن" className="hidden" checked={formData.designTemplate === "مودرن"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-brand-100 bg-white flex items-center justify-center p-2">
                       <img src="https://i.postimg.cc/KzTskNLd/Modern.png" alt="مسار مودرن" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج حديث "مودرن"</span>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-4 transition-all ${formData.designTemplate === "كلاسيكي" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}`}>
                    <input type="radio" name="design" value="كلاسيكي" className="hidden" checked={formData.designTemplate === "كلاسيكي"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-brand-100 bg-white flex items-center justify-center p-2">
                       <img src="https://i.postimg.cc/cH35gmYj/Classic.png" alt="مسار كلاسيكي" className="w-full h-full object-contain" />
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
                  <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">بدء التنفيذ وإتمام الدفع</h2>
                  <p className="text-brand-700 text-lg mb-8 max-w-lg mx-auto">
                    سيتم تحويلك الآن لإتمام عملية الدفع (بشكل آمن عبر بوابة Stripe). بعد نجاح الدفع، سيتم تفعيل حسابك كأمين سجل لتبدأ بإدراج بياناتك الاختيارية والتواصل مع فريق البحث لمعرفة المستجدات.
                  </p>
                  
                  <div className="flex flex-col items-stretch mx-auto max-w-xl mb-8 gap-3">
                    <div 
                      onClick={() => setPaymentType("full")}
                      className={`w-full border-2 p-6 rounded-2xl cursor-pointer transition shadow-sm ${paymentType === "full" ? "border-brand-600 bg-brand-50" : "border-brand-100 bg-white hover:border-brand-300"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-brand-900">الدفع الكامل</h3>
                      </div>
                      <div className="text-4xl font-mono text-brand-900 font-bold mt-4 mb-2">
                        $1,780<span className="text-xl text-brand-500 font-light">.00</span>
                      </div>
                    </div>

                    <div className="w-full">
                      <div 
                        onClick={() => setPaymentType(paymentType === "installment" ? "full" : "installment")}
                        className="bg-white border border-brand-100 rounded-xl p-3 text-center cursor-pointer hover:bg-brand-50 transition w-full"
                      >
                         <h3 className="text-sm font-bold text-brand-700">خيارات نظام الدفعات (الإجمالي 1980$)</h3>
                      </div>
                      {paymentType === "installment" && (
                        <div className="mt-3 border-2 border-brand-600 bg-brand-50 p-6 rounded-2xl transition shadow-sm animate-in slide-in-from-top-2 duration-300">
                          <div className="text-3xl font-mono text-brand-900 font-bold mt-2 mb-2">
                            $693<span className="text-xl text-brand-500 font-light">.00</span>
                          </div>
                          <p className="text-sm text-brand-600 font-medium leading-relaxed">الدفعة الأولى 35%<br/><span className="text-xs opacity-80">(دفعة ثانية عند التوثيق ونهائية عند التسليم)</span></p>
                        </div>
                      )}
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
                (step === 2 && !formData.designTemplate)
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
                <>إتمام الدفع <Check className="w-5 h-5 mr-2" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
