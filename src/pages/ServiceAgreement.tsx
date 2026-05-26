import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { Check, ShieldCheck, Mail, Phone, MapPin, User, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import { orderDetailsContract, mainContractSections } from "@/data/contractContent";
import { arabicContractText } from "@/data/arabicContract";
import { logLegalEvent, recordLegalConsent, createLegalContractRecord, createOrderEvidence } from "@/lib/legalService";

export function ServiceAgreement() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth", { replace: true });
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

  const allChecked = req1 && req2;
  const canProceed = allChecked && scrolledToBottom;

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

    // 4. Final step: mark ready
    await logLegalEvent("contract_ready_for_signature", { version: "v1.0" }, contractId.current, orderId.current);

    navigate("/e-signature", { state: { contractId: contractId.current, orderId: orderId.current }});
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
        
        {/* Progress Bar (Step 5 - Service Agreement) */}
        <OrderStepper currentStep={3} />

        {/* Order Summary (Confirm Edition) */}
        <div className="bg-brand-50 p-6 md:p-10 rounded-[2rem] border border-brand-200 shadow-sm mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تأكيد الإصدار</h2>
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
                ملخص بيانات أمين السجل والتسليم
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
                <div className="flex flex-col gap-1 md:col-span-2"><span className="text-brand-600">نقطة العرض الأساسية:</span> <strong className="text-brand-900">أمين السجل ({pendingOrderData.firstName} {pendingOrderData.fatherName} {pendingOrderData.familyName})</strong></div>
                <div className="flex flex-col gap-1 md:col-span-2"><span className="text-brand-600">العنوان البريدي:</span> <strong className="text-brand-900">{pendingOrderData.shippingAddress?.name} - {pendingOrderData.shippingAddress?.phone} - {pendingOrderData.shippingAddress?.street}, {pendingOrderData.shippingAddress?.state}, {pendingOrderData.shippingAddress?.country} {pendingOrderData.shippingAddress?.zip}</strong></div>
              </div>
            </div>
            
            <div className="bg-[#F2E3DE] text-brand-900 p-6 rounded-2xl shadow-sm border border-brand-200 flex flex-col text-right h-full">
               <div className="mb-2">
                  <span className="text-[#C3262A] block mb-3 font-bold text-base border-b border-brand-200/50 pb-2">الباقة المختارة</span>
                  <ul className="list-disc text-[#541214] mt-2 text-xs sm:text-sm space-y-2 pr-4 pl-2 leading-relaxed">
                    <li>عمل البحث العلمي والتاريخي المتخصص.</li>
                    <li>توثيق خط نسب أمين السجل / العميل "عمود النسب".</li>
                    <li>توثيق المصادر والمراجع للعُقَد النسبية.</li>
                    <li>توثيق المصادر والمراجع لتراجم الأعلام "السير الذاتية".</li>
                    <li>تنسيق وموائمة مواد قسم الإدراج الإختياري الخاص بأمين السجل / العميل، مع بقية الأقسام.</li>
                    <li>أعمال التصميم والإخراج الفني المحترف.</li>
                    <li className="font-semibold text-brand-900">تسليم العمل "سجل تراث العائلة" على شكل المخرجات التالية:</li>
                    <ul className="list-circle pr-6 text-xs opacity-90 space-y-1">
                      <li>نسخة رقمية "الكترونية".</li>
                      <li>عدد 10 نسخ ورقية مطبوعة بشكل أنيق.</li>
                      <li>بوستر مشجر عمود النسب الشامل.</li>
                    </ul>
                  </ul>
               </div>
            </div>
          </div>
        </div>

        {/* Privacy Trust Layer */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-4 mb-8 max-w-lg mx-auto text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-brand-700 font-bold mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span>حماية مشددة لخصوصية عائلتك</span>
          </div>
          <p className="text-brand-600 text-xs sm:text-sm leading-relaxed max-w-xs">
            بياناتك مشفرة ومحفوظة في خوادم آمنة. الخصوصية خط أحمر لا يمكن المساس به.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-200 overflow-hidden mb-8">
          
          <div className="bg-brand-900 text-brand-50 px-8 py-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <FileText className="w-5 h-5 text-brand-300" />
               <span className="font-bold tracking-wide">عقد تقديم الخدمة - Contract of Service</span>
             </div>
             <div className="text-xs text-brand-400 font-mono opacity-80">Ref: {dummyOrderId}</div>
          </div>

          <div className="grid grid-cols-1">
            {/* Viewer */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onCopy={handleCopy}
              className="h-[600px] overflow-y-auto relative bg-[#faf9f7] select-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%23e0dcd3' font-family='Arial' font-weight='bold' opacity='0.4' text-anchor='middle' transform='rotate(-45 100 100)'%3E${encodeURIComponent(pendingOrderData.firstName + " " + pendingOrderData.familyName)} - ${new Date().toLocaleDateString()}%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            >
              
              <div className="p-8 md:p-12 space-y-12">
                
                {/* Order Details Header */}
                <div id="order-details" className="text-center border-b border-brand-200 pb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-900 leading-relaxed whitespace-pre-line">
                    {orderDetailsContract.ar.title}
                  </h2>
                  <div className="my-6 grid grid-cols-1 gap-4 text-xs text-brand-600 font-mono">
                    <p className="whitespace-pre-line text-right">{orderDetailsContract.ar.intro}</p>
                  </div>
                </div>

                {/* Order Details Table */}
                <div className="border border-brand-200 rounded-xl overflow-hidden bg-white text-sm tracking-wide">
                  {[
                    [orderDetailsContract.ar.fields.orderId, `${dummyOrderId}`],
                    [orderDetailsContract.ar.fields.invoiceId, `${dummyInvoiceId}`],
                    [orderDetailsContract.ar.fields.orderDate, new Date().toLocaleDateString('ar-EG')],
                    [orderDetailsContract.ar.fields.customerName, `${pendingOrderData.firstName} ${pendingOrderData.fatherName} ${pendingOrderData.familyName}`],
                    [orderDetailsContract.ar.fields.email, currentUser.email],
                    [orderDetailsContract.ar.fields.phone, pendingOrderData.shippingAddress?.phone || "-"],
                    [orderDetailsContract.ar.fields.shippingAddress, `${pendingOrderData.shippingAddress?.street}, ${pendingOrderData.shippingAddress?.state}, ${pendingOrderData.shippingAddress?.country}`],
                    [orderDetailsContract.ar.fields.product, `خدمة توثيق عمود النسب واصدار سجل تراث العائلة (السجل الأساسي -  البوابة الرئيسية)`],
                    [orderDetailsContract.ar.fields.amount, `1980 SAR`],
                    [orderDetailsContract.ar.fields.paymentMethod, `pending`],
                    [orderDetailsContract.ar.fields.paymentStatus, `pending`],
                    [orderDetailsContract.ar.fields.estimatedTime, `من 90 إلى 180 يوم .`],
                    [orderDetailsContract.ar.fields.revisionTime, `15 يوم من تاريخ اصدار سجل تراث العائلة ( السجل الأساسي -  البوابة الرئيسية)`],
                    [orderDetailsContract.ar.fields.deliveryChannel, `عبر حسابكم على المنصة`]
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-brand-100 last:border-0 hover:bg-brand-50/50 transition">
                      <div className="bg-brand-50/50 px-4 py-3 font-bold text-brand-900 border-l border-brand-100/50 text-right">
                        {row[0]}
                      </div>
                      <div className="px-4 py-3 text-brand-700 text-right md:col-span-3">
                        {row[1]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contract Body (Dual Column Layout) */}
                <div className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
                  {mainContractSections.map((sec, idx) => (
                    <div key={sec.id} id={sec.id} className="border-b border-brand-100 last:border-0 relative">
                      {(sec.arTitle || sec.enTitle) && (
                        <div className="bg-brand-50/50 p-4 md:px-8 border-b border-brand-100/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <h3 className="font-bold text-brand-900 text-right">{sec.arTitle}</h3>
                           <h3 className="font-bold text-brand-900 text-left font-serif" dir="ltr">{sec.enTitle}</h3>
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 leading-relaxed text-sm">
                        
                        {/* Arabic Column */}
                        <div className="text-right text-brand-800 space-y-4">
                          {sec.arText.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-justify whitespace-pre-wrap">{paragraph}</p>
                          ))}
                        </div>
                        
                        {/* English Column */}
                        <div className="text-left text-brand-800 space-y-4 font-serif" dir="ltr">
                          {sec.enText.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-justify whitespace-pre-wrap">{paragraph}</p>
                          ))}
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>

                {scrolledToBottom ? (
                  <div className="text-center mt-16 p-12 bg-[#F9F6F0] rounded-2xl border border-brand-200 flex flex-col items-center justify-center gap-6 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-50 opacity-40 mix-blend-multiply pattern-grid-lg"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <h4 className="text-xl font-bold text-brand-900 mb-1">نهاية الوثيقة</h4>
                      <h4 className="text-lg font-bold text-brand-900 mb-4 font-serif">End of Document</h4>
                      <p className="text-brand-700 font-medium text-center leading-relaxed max-w-md">
                        شكرًا لك. لقد أكملت الاطلاع على الاتفاقية بالكامل. يمكنك الآن الانتقال للموافقة على الإقرارات بالأسفل.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-12 py-12 bg-brand-50/80 rounded-2xl border border-brand-200 shadow-inner">
                    <p className="text-brand-600 font-medium flex items-center justify-center gap-2">
                       <ArrowRight className="w-5 h-5 animate-pulse" />
                       استمر بالتمرير للأسفل لتمكين الإقرار والموافقة
                       <ArrowLeft className="w-5 h-5 animate-pulse" />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Checkboxes */}
        <div className={`bg-white rounded-3xl p-8 border ${scrolledToBottom ? 'border-brand-300 shadow-md' : 'border-brand-100 opacity-60 pointer-events-none'} transition-all duration-500 mb-8`}>
          <h3 className="text-xl font-bold text-brand-900 mb-6 border-b border-brand-100 pb-4">الإقرار والموافقة القانونية <span className="text-base text-slate-500 font-medium ml-2">| Legal Acknowledgement & Agreement</span></h3>
          
          <div className="space-y-4">
            <CheckboxLabel 
              checked={req2} onChange={(v) => { setReq2(v); if(v) recordLegalConsent("order_details_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="تُعد صفحة بيانات الطلب هذه جزءًا لا يتجزأ من هذا العقد ومكملة لأحكامه، وتُقدَّم على أي وصف تجاري أو مراسلات سابقة فيما يخص تحديد المنتج والقيمة وبيانات العميل. وفي حال التعارض، تُقدَّم بيانات الطلب فيما يتعلق بالبيانات التعريفية للصفقة، وتبقى شروط العقد وأحكامه نافذة." 
              textEn="This Order Details page forms an integral part of, and supplements, this Agreement and prevails over any prior commercial description or communications regarding identification of the product/service, price, and customer information. In the event of any conflict, the Order Details shall control with respect to the identifying information of the transaction, and the remaining terms and conditions of this Agreement shall remain in full force and effect."
            />
            <CheckboxLabel 
              checked={req1} onChange={(v) => { setReq1(v); if(v) recordLegalConsent("electronic_signature_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أوافق على استخدام التوقيع الإلكتروني والسجلات الإلكترونية وسجل التدقيق (Audit Trail) وشهادة الإكمال (Certificate of Completion) كوسائل إثبات قانونية ملزمة، وأقر بحجيتها الكاملة وعدم اشتراط وجود أصل ورقي." 
              textEn="I agree to use electronic signatures, electronic records, the Audit Trail (Audit Trail), and the Certificate of Completion (Certificate of Completion) as legally binding means of evidence, and I acknowledge their full legal effect and that no paper original is required."
            />
          </div>

          {!scrolledToBottom && (
             <p className="text-red-500 text-sm mt-4 font-bold flex items-center gap-2">
               يرجى الاطلاع على كامل الاتفاقية حتى النهاية قبل المتابعة.
             </p>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100">
          <button 
            type="button" 
            onClick={() => navigate("/order?step=2")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة لتحديد النطاق
          </button>
          
          <button 
            onClick={handleProceed} 
            disabled={!canProceed}
            className="px-10 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تأكيد الإصدار والتوقيع <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

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
