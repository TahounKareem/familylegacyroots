import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { Check, ShieldCheck, Phone, MapPin, User, FileText, ArrowLeft, ArrowRight, Loader2, PenTool } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import { orderDetailsContract, mainContractSections } from "@/data/contractContent";
import { AccordionContract } from "@/components/AccordionContract";
import { arabicContractText } from "@/data/arabicContract";
import { logLegalEvent, recordLegalConsent, createLegalContractRecord, createOrderEvidence } from "@/lib/legalService";

export function ServiceAgreement() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth?redirect=/service-agreement", { replace: true });
    } else if (!pendingOrderData || !pendingOrderData.shippingAddress) {
      navigate("/shipping-details", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  const [req1, setReq1] = useState(false);
  const [req2, setReq2] = useState(false);
  const [req3, setReq3] = useState(false);
  const [req4, setReq4] = useState(false);
  const [req5, setReq5] = useState(false);
  const [req6, setReq6] = useState(false);

  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const contractId = useRef(`CTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  const orderId = useRef(`ORD-PENDING-${Math.floor(Math.random() * 9000)}`);
  const invoiceId = useRef(`INV-PENDING-${Math.floor(Math.random() * 9000)}`);

  useEffect(() => {
    if (currentUser && pendingOrderData) {
      logLegalEvent("contract_opened", { version: "v1.0" }, contractId.current, orderId.current);
    }
  }, [currentUser, pendingOrderData]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;
      
      // Consider 95%-100% as fully scrolled
      if (scrollPercentage >= 95) {
        if (!scrolledToBottom) {
          setScrolledToBottom(true);
          logLegalEvent("contract_fully_scrolled", { scrollPercentage, version: "v1.0" }, contractId.current, orderId.current);
        }
      }
    }
  };

  const [showDeclarations, setShowDeclarations] = useState(false);

  const allChecked = req1 && req2;
  const canProceed = allChecked;

  const [isSigning, setIsSigning] = useState(false);
  const [showManuallySignedModal, setShowManuallySignedModal] = useState(false);
  const [signedInternally, setSignedInternally] = useState(false);
  const [signTimeLeft, setSignTimeLeft] = useState(60); // 60 seconds wait time to be logical as requested

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showManuallySignedModal && signTimeLeft > 0) {
      timer = setTimeout(() => {
        setSignTimeLeft(signTimeLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showManuallySignedModal, signTimeLeft]);

  const handleProceed = async () => {
    if (!currentUser || !pendingOrderData) return;
    
    // 1. Record all document consents first to enforce chronological integrity
    const consentTypes = [
      "consent_intro",
      "consent_service_nature",
      "consent_scope",
      "consent_lineage_rules",
      "consent_secretary",
      "consent_responsibility",
      "consent_data_protection"
    ];
    
    for (const type of consentTypes) {
      await recordLegalConsent(type, { version: "v1.0" }, contractId.current, orderId.current);
    }

    // Add final acceptance event required by rules
    await logLegalEvent("contract_terms_accepted", { mandatoryConsentsCompleted: true, contractVersion: "v1.0" }, contractId.current, orderId.current);

    // 2. Generate the actual legal contract record
    await createLegalContractRecord(
      contractId.current,
      orderId.current,
      "v1.0",
      "awaiting_signature",
      { ...currentUser },
      { ...pendingOrderData.shippingAddress },
      { ...pendingOrderData }
    );

    // 3. Generate canonical order evidence
    await createOrderEvidence(
       orderId.current,
       contractId.current,
       {
         order_id: orderId.current,
         invoice_id: invoiceId.current,
         order_date: new Date().toISOString(),
         customer_full_name: pendingOrderData.firstName + " " + pendingOrderData.familyName,
         customer_email: currentUser.email,
         customer_phone: pendingOrderData.shippingAddress?.phone || "-",
         shipping_full_address: `${pendingOrderData.shippingAddress?.street}, ${pendingOrderData.shippingAddress?.state}, ${pendingOrderData.shippingAddress?.country}`,
         detailed_name: `الجد: ${pendingOrderData.grandfatherName || "-"} | القبيلة: ${pendingOrderData.tribeName || "-"}`,
         homeland_and_start: `الموطن: ${pendingOrderData.homeland || "-"} | نقطة البدء: ${pendingOrderData.startingPoint || "-"}`,
         design_template: pendingOrderData.designTemplate || "-",
         historical_notes: pendingOrderData.historicalNotes || "-",
         productname: "توثيق شجرة العائلة",
         price_amount: 1980.00,
         price_currency: "SAR",
         payment_method: "pending",
         payment_status: "pending",
       }
    );

    // 4. Final step: trigger SignNow auto-sign logic
    try {
      let clientIp = "unknown";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        clientIp = ipData.ip;
      } catch (e) {
        console.warn("Could not fetch IP", e);
      }

      await fetch("/api/signnow/auto-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           orderId: orderId.current,
           customerName: pendingOrderData.firstName + " " + pendingOrderData.familyName,
           email: currentUser.email,
           auditTrail: {
             ip: clientIp,
             userAgent: navigator.userAgent,
             timestamp: new Date().toISOString()
           }
        })
      });
      console.log("SignNow background auto-sign completed");
    } catch (e) {
      console.error("SignNow background error:", e);
    }

    await logLegalEvent("contract_electronically_signed", { version: "v1.0", provider: "signnow" }, contractId.current, orderId.current);
    
    // Save contractId to pendingOrderData
    useAppStore.setState(s => ({
      pendingOrderData: { 
        ...s.pendingOrderData, 
        contractId: contractId.current,
        checkoutOrderId: orderId.current
      } as any
    }));

    // Show success and jump smoothly to payment
    navigate("/e-signature-success");
  };

  if (!currentUser || !pendingOrderData) return null;

  const priceAmount = "تُحدد حسب خيار الدفع";
  const dummyOrderId = orderId.current;
  const dummyInvoiceId = invoiceId.current;

  // Prevent copy in viewer
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-brand-50 min-h-screen pb-12 pt-8 relative border-t-4 border-brand-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back & Profile */}
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
              <User className="w-4 h-4 text-brand-500" />
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
        <div className="sticky top-0 z-50 bg-brand-50 pt-2 pb-4 mb-4">
          <OrderStepper currentStep={3} />
        </div>

        {/* Order Summary (Confirm Edition) */}
        <div className="bg-brand-50 p-6 md:p-10 rounded-[2rem] border border-brand-200 shadow-sm mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">مراجعة الطلب والتوقيع</h2>
            <p className="text-brand-600">مراجعة بيانات الطلب والتوقيع الإلكتروني</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm relative">
              <button 
                onClick={() => navigate("/order?step=1")}
                className="absolute top-6 left-6 text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"
              >
                تعديل البيانات
              </button>
              <h3 className="font-bold text-brand-900 border-b border-brand-100 pb-3 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                بيانات الإصدار المعتمدة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-right">
                <div className="flex flex-col gap-1"><span className="text-brand-600">الاسم الأول:</span> <strong className="text-brand-900">{pendingOrderData.firstName}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">اسم الأب:</span> <strong className="text-brand-900">{pendingOrderData.fatherName}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">اسم الجد:</span> <strong className="text-brand-900">{pendingOrderData.grandfatherName}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">العائلة:</span> <strong className="text-brand-900">{pendingOrderData.familyName}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">القبيلة:</span> <strong className="text-brand-900">{pendingOrderData.tribeName || "غير محدد"}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">الدولة:</span> <strong className="text-brand-900">{pendingOrderData.country}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">الموطن الأصلي:</span> <strong className="text-brand-900">{pendingOrderData.homeland}</strong></div>
                <div className="flex flex-col gap-1"><span className="text-brand-600">قالب التصميم:</span> <strong className="text-brand-900">{pendingOrderData.designTemplate}</strong></div>
                <div className="flex flex-col gap-1 md:col-span-2"><span className="text-brand-600">أمين السجل:</span> <strong className="text-brand-900">{pendingOrderData.firstName} {pendingOrderData.fatherName} {pendingOrderData.familyName}</strong></div>
                <div className="flex flex-col gap-1 md:col-span-2"><span className="text-brand-600">العنوان البريدي:</span> <strong className="text-brand-900">{pendingOrderData.shippingAddress?.name} - {pendingOrderData.shippingAddress?.phone} - {pendingOrderData.shippingAddress?.street}, {pendingOrderData.shippingAddress?.state}, {pendingOrderData.shippingAddress?.country} {pendingOrderData.shippingAddress?.zip}</strong></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex flex-col text-right h-full">
               <div className="mb-2">
                  <span className="text-brand-900 block mb-3 font-bold text-base border-b border-brand-100 pb-2">نطاق العمل المعتمد</span>
                  <p className="text-brand-800 mb-2 text-sm font-medium">يشمل هذا الإصدار الخدمات والمخرجات التالية ضمن نطاق العمل المتفق عليه:</p>
                  <ul className="list-disc text-brand-700 mt-2 text-sm space-y-2 pr-4 pl-2 leading-relaxed mb-4">
                    <li>إجراء البحث العلمي والتاريخي المرتبط بسجل العائلة.</li>
                    <li>توثيق عمود النسب وربط نقطة العرض الأساسية بالامتداد العائلي الموثق.</li>
                    <li>توثيق المصادر والمراجع والروايات ذات الصلة بالامتداد النسبي.</li>
                    <li>إعداد وتوثيق التراجم والسير المرتبطة بأعلام العائلة — عند توفر المادة العلمية.</li>
                    <li>تنسيق المواد الإضافية والوثائق والصور ضمن الهوية البصرية للسجل.</li>
                    <li>تصميم وإخراج السجل بصيغة فنية احترافية تليق بإرث العائلة.</li>
                  </ul>
                  <p className="text-brand-800 mb-2 text-sm font-medium">يتم تسليم الإصدار النهائي عبر المخرجات التالية:</p>
                  <ul className="list-disc text-brand-700 mt-2 text-sm space-y-2 pr-4 pl-2 leading-relaxed">
                    <li>نسخة رقمية عالية الجودة من سجل تراث العائلة.</li>
                    <li>نسخ مطبوعة فاخرة وفق الباقة المعتمدة.</li>
                    <li>بوستر مشجر عمود النسب الكامل.</li>
                  </ul>
               </div>
            </div>
          </div>
        </div>

        {/* Privacy Trust Layer */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-4 mb-8 max-w-lg mx-auto text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-brand-700 font-bold mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span>حماية موثوقة لخصوصية العائلة</span>
          </div>
          <p className="text-brand-600 text-sm leading-relaxed max-w-md">
            تُحفظ البيانات والوثائق ضمن بيئة رقمية آمنة، مع التزام كامل بسرية المعلومات وعدم مشاركة محتوى السجل أو الوثائق إلا ضمن نطاق العمل المعتمد.
          </p>
        </div>

        <AccordionContract 
          sections={mainContractSections}
          orderDetailsContract={orderDetailsContract}
          dummyOrderId={dummyOrderId}
          dummyInvoiceId={dummyInvoiceId}
          pendingOrderData={pendingOrderData}
          currentUser={currentUser}
          onOpen={() => {
            logLegalEvent("contract_expanded_to_view", { version: "v1.0" }, contractId.current, orderId.current);
            setShowDeclarations(true);
          }}
        />
        <div className="mb-8"></div>
        
        {showDeclarations && (
          <>
            {/* Requirements Checkboxes */}
            <div className="bg-white rounded-3xl p-8 border border-brand-300 shadow-md transition-all duration-500 mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xl font-bold text-brand-900 mb-6 border-b border-brand-100 pb-4">الاعتماد القانوني والتوقيع الإلكتروني <span className="text-base text-slate-500 font-medium ml-2">| Legal Acknowledgment & Electronic Signature</span></h3>
              
              <div className="space-y-4">
                <label className="flex flex-col p-6 border border-brand-200 rounded-2xl cursor-pointer hover:bg-brand-50 transition shadow-sm bg-white">
                  <div className="flex items-center gap-2 mb-3 border-b border-brand-100 pb-2">
                    <Check className="w-5 h-5 text-brand-600" />
                    <h4 className="font-bold text-brand-900">اعتماد بيانات الطلب</h4>
                  </div>
                  <p className="text-sm text-brand-800 leading-relaxed mb-4 font-medium">
                    أقر بأن بيانات الطلب الحالية تُعد جزءًا مكملًا لعقد الخدمة، وتمثل المرجع المعتمد لنطاق العمل والمعلومات التعريفية الخاصة بالإصدار.
                  </p>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                      checked={req1}
                  onChange={(e) => { setReq1(e.target.checked); if(e.target.checked) recordLegalConsent("order_details_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
                />
                <span className="font-bold text-sm text-brand-900">أوافق على اعتماد بيانات الطلب الحالية.</span>
              </div>
            </label>

            <label className="flex flex-col p-6 border border-brand-200 rounded-2xl cursor-pointer hover:bg-brand-50 transition shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3 border-b border-brand-100 pb-2">
                <Check className="w-5 h-5 text-brand-600" />
                <h4 className="font-bold text-brand-900">اعتماد التوقيع والسجلات الإلكترونية</h4>
              </div>
              <p className="text-sm text-brand-800 leading-relaxed mb-4 font-medium">
                أوافق على استخدام التوقيع الإلكتروني والسجلات الرقمية وسجل التتبع الإلكتروني كوسائل قانونية معتمدة لإثبات إجراءات هذا الطلب واعتماداته.
              </p>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  checked={req2}
                  onChange={(e) => { setReq2(e.target.checked); if(e.target.checked) recordLegalConsent("electronic_signature_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
                />
                <span className="font-bold text-sm text-brand-900">أوافق على الاعتماد الإلكتروني.</span>
              </div>
            </label>
          </div>
        </div>
        </>
      )}

      {showDeclarations ? (
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 animate-in fade-in slide-in-from-bottom-4">
          <button 
            type="button" 
            onClick={() => navigate("/order?step=2")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
          </button>
          
          <div className="flex flex-col items-center gap-2 text-center">
            <button 
              onClick={handleProceed} 
              disabled={!canProceed}
              className={`px-10 py-3 rounded-2xl font-bold transition shadow-lg flex items-center gap-2 bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              حفظ ومتابعة <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-start bg-transparent p-4">
          <button 
            type="button" 
            onClick={() => navigate("/order?step=2")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-white transition flex items-center gap-2 border border-brand-200"
          >
           <ArrowRight className="w-5 h-5" /> عودة
          </button>
        </div>
      )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        ::selection { background: transparent; }
        ::-moz-selection { background: transparent; }
        @media print {
          body { display: none !important; }
        }
      `}} />

    </div>
  );
}

function CheckboxLabel({ checked, onChange, textAr, textEn }: { checked: boolean, onChange: (val: boolean) => void, textAr: string, textEn: string }) {
  return (
    <label className="flex items-start gap-4 p-4 border border-brand-100 rounded-xl cursor-pointer hover:bg-brand-50 transition">
      <div className="pt-0.5">
        <input 
          type="checkbox" 
          className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-sm text-brand-800 leading-relaxed font-bold text-right">
          {textAr}
        </div>
        <div className="text-sm text-brand-800 leading-relaxed font-bold text-left dir-ltr" dir="ltr">
          {textEn}
        </div>
      </div>
    </label>
  );
}
