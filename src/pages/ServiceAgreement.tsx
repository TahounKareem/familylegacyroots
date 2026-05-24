import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { Check, ShieldCheck, Mail, Phone, MapPin, User, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import { orderDetailsContract, mainContractSections } from "@/data/contractContent";
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

  const allChecked = req1 && req2 && req3 && req4 && req5 && req6;
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
            <p className="text-brand-600">مراجعة بيانات الطلب قبل الموافقة على العقد</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
              <h3 className="font-bold text-brand-900 border-b border-brand-100 pb-3 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                ملخص بيانات أمين السجل
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center"><span className="text-brand-600">الاسم:</span> <strong className="text-brand-900">{pendingOrderData.firstName} {pendingOrderData.fatherName} {pendingOrderData.grandfatherName} {pendingOrderData.familyName}</strong></div>
                <div className="flex justify-between items-center"><span className="text-brand-600">الدولة:</span> <strong className="text-brand-900">{pendingOrderData.country}</strong></div>
                <div className="flex justify-between items-center"><span className="text-brand-600">الموطن الأصلي:</span> <strong className="text-brand-900">{pendingOrderData.homeland}</strong></div>
                <div className="flex justify-between items-center"><span className="text-brand-600">القبيلة:</span> <strong className="text-brand-900">{pendingOrderData.tribeName || "غير محدد"}</strong></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
              <h3 className="font-bold text-brand-900 border-b border-brand-100 pb-3 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                المسار والمخرجات
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-brand-600 block mb-1">نقطة البدء:</span> 
                  <strong className="text-brand-900">
                    {pendingOrderData.startingPointType === "أنا أمين السجل" ? `أنا أمين السجل (${pendingOrderData.firstName} بن ${pendingOrderData.fatherName})` :
                     pendingOrderData.startingPointType === "اسم العائلة" ? `اسم العائلة (${pendingOrderData.familyName})` :
                     pendingOrderData.startingPointType === "احد الأسلاف" ? `${pendingOrderData.startingPointAncestor || "احد الأسلاف"} (${pendingOrderData.startingPointName})` :
                     pendingOrderData.startingPoint || "-"}
                  </strong>
                </div>
                <div className="flex justify-between items-center"><span className="text-brand-600">قالب التصميم:</span> <strong className="text-brand-900">{pendingOrderData.designTemplate}</strong></div>
              </div>
            </div>
            
            <div className="md:col-span-2 bg-gradient-to-r from-brand-800 to-brand-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center">
               <div className="mb-4 md:mb-0">
                  <span className="text-brand-200 block mb-1 font-bold text-sm">الباقة المختارة</span>
                  <strong className="font-serif text-xl">السجل الأساسي ويشمل:</strong>
                  <ul className="list-disc list-inside text-brand-100 mt-2 text-sm space-y-1">
                    <li>نسخة رقمية "الكترونية" لتاريخ العائلة</li>
                    <li>عدد 10 نسخ ورقية مطبوعة أصلية</li>
                    <li>بوستر مشجر عمود النسب الشامل</li>
                  </ul>
               </div>
               <div className="text-left">
                  <div className="text-3xl font-mono font-bold">{priceAmount}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Privacy Trust Layer */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Image / Visual Side */}
            <div className="w-full md:w-1/3 shrink-0 relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800" 
                  alt="Family Connection and Trust" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl shadow-xl border border-brand-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-right pr-2">
                  <p className="text-sm font-bold text-brand-900">حماية مشددة</p>
                  <p className="text-xs text-brand-500">لخصوصية عائلتك</p>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>قبل البدء في التعاقد</span>
              </div>
              
              <h1 className="text-3xl font-serif font-bold text-brand-900 leading-tight">
                خصوصيتك في أمان… <br/>
                <span className="text-brand-600">وثقتك مسؤوليتنا</span>
              </h1>
              
              <div className="space-y-4 text-brand-800 leading-relaxed text-sm">
                <p>
                  نعرف أن تفاصيل العائلة والأنساب ليست مجرد بيانات… إنها حكايات وذكريات وروابط عزيزة. لذلك نتعامل مع كل ما تشاركه معنا من معلومات أو صور أو وثائق على أنه أمانة نعتز بها، ونحرص أن تبقى في مساحة آمنة تُصان فيها الخصوصية وتُحترم فيها الثقة.
                </p>
                <p>
                  نأخذ السرية والخصوصية بجدية تامة، ونطبّق إجراءات علمية وأخلاقية صارمة لحماية المحتوى من أي وصول غير مصرح به أو استخدام غير ملائم. نعتمد مبدأ «الحد الأدنى الضروري» في التعامل مع البيانات، ونراجع ضوابطنا باستمرار ونطوّرها خطوة بخطوة. 
                </p>
                <p className="font-semibold text-brand-900 border-r-4 border-brand-500 pr-4 mt-4 bg-brand-50 p-4 rounded-l-lg">
                  نريدك أن تشعر بالاطمئنان وأنت تبني شجرة عائلتك معنا، وأن تعرف أن ما يخصك سيبقى محفوظًا بعناية واحترام تماماً كما نحب أن تُحفظ قصص عائلاتنا.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-200 overflow-hidden mb-8">
          
          <div className="bg-brand-900 text-brand-50 px-8 py-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <FileText className="w-5 h-5 text-brand-300" />
               <span className="font-bold tracking-wide">عقد تقديم الخدمة - Contract of Service</span>
             </div>
             <div className="text-xs text-brand-400 font-mono opacity-80">Ref: {dummyOrderId}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            
            {/* Sticky Nav */}
            <div className="hidden md:block col-span-1 border-l border-brand-100 bg-brand-50/50 p-6 relative">
              <div className="sticky top-6">
                <h3 className="font-bold text-brand-900 mb-4 text-sm">فهرس العقد</h3>
                <ul className="space-y-2 text-xs text-brand-700">
                  <li><a href="#order-details" className="hover:text-brand-600 transition">بيانات الطلب (Order Details)</a></li>
                  {mainContractSections.map((sec, idx) => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`} className="hover:text-brand-600 transition line-clamp-1" title={sec.arTitle}>
                        {sec.arTitle}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Viewer */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onCopy={handleCopy}
              className="col-span-1 md:col-span-3 h-[600px] overflow-y-auto relative bg-[#faf9f7] select-none"
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
                  <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-brand-600 font-mono">
                    <p className="whitespace-pre-line text-right">{orderDetailsContract.ar.intro}</p>
                    <p className="whitespace-pre-line text-left dir-ltr" dir="ltr">{orderDetailsContract.en.intro}</p>
                  </div>
                </div>

                {/* Order Details Table */}
                <div className="border border-brand-200 rounded-xl overflow-hidden bg-white text-sm">
                  {[
                    [orderDetailsContract.ar.fields.orderId, `${dummyOrderId} / ${dummyInvoiceId}`, orderDetailsContract.en.fields.orderId],
                    [orderDetailsContract.ar.fields.orderDate, new Date().toLocaleDateString('ar-EG'), orderDetailsContract.en.fields.orderDate],
                    [orderDetailsContract.ar.fields.customerName, `${pendingOrderData.firstName} ${pendingOrderData.fatherName} ${pendingOrderData.familyName}`, orderDetailsContract.en.fields.customerName],
                    [orderDetailsContract.ar.fields.detailedName, `الجد: ${pendingOrderData.grandfatherName || "-"} | القبيلة: ${pendingOrderData.tribeName || "-"}`, orderDetailsContract.en.fields.detailedName],
                    [orderDetailsContract.ar.fields.homeland, `الموطن: ${pendingOrderData.homeland || "-"} | نقطة البدء: ${pendingOrderData.startingPoint || "-"}`, orderDetailsContract.en.fields.homeland],
                    [orderDetailsContract.ar.fields.template, pendingOrderData.designTemplate || "-", orderDetailsContract.en.fields.template],
                    [orderDetailsContract.ar.fields.notes, pendingOrderData.historicalNotes ? (pendingOrderData.historicalNotes.length > 50 ? pendingOrderData.historicalNotes.substring(0, 50) + '...' : pendingOrderData.historicalNotes) : "-", orderDetailsContract.en.fields.notes],
                    [orderDetailsContract.ar.fields.email, currentUser.email, orderDetailsContract.en.fields.email],
                    [orderDetailsContract.ar.fields.phone, pendingOrderData.shippingAddress?.phone || "-", orderDetailsContract.en.fields.phone],
                    [orderDetailsContract.ar.fields.shippingAddress, `${pendingOrderData.shippingAddress?.street}, ${pendingOrderData.shippingAddress?.state}, ${pendingOrderData.shippingAddress?.country}`, orderDetailsContract.en.fields.shippingAddress],
                    [orderDetailsContract.ar.fields.product, `توثيق شجرة العائلة`, orderDetailsContract.en.fields.product]
                  ].map((row, i) => (
                    <div key={i} className={`flex flex-col md:flex-row ${i % 2 === 0 ? 'bg-brand-50/30' : 'bg-white'} border-b border-brand-100 last:border-0`}>
                       <div className="px-4 py-3 md:w-1/3 font-bold text-brand-800 bg-brand-50/50 text-right">{row[0]}</div>
                       <div className="px-4 py-3 md:w-1/3 font-medium text-brand-900 text-center">{row[1]}</div>
                       <div className="px-4 py-3 md:w-1/3 font-bold text-brand-800 bg-brand-50/50 text-left dir-ltr" dir="ltr">{row[2]}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-brand-700 bg-brand-50 p-4 rounded-xl border border-brand-100">
                  <div className="leading-relaxed">☑ {orderDetailsContract.ar.footerCheckbox}</div>
                  <div className="leading-relaxed text-left dir-ltr" dir="ltr">☑ {orderDetailsContract.en.footerCheckbox}</div>
                </div>

                <div className="w-full h-px bg-brand-200 my-10"></div>

                {/* Contract Body */}
                <div className="space-y-10">
                  {mainContractSections.map((sec) => (
                    <div key={sec.id} id={sec.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-10">
                      <div className="text-right">
                        <h4 className="font-bold text-brand-900 mb-3 text-lg">{sec.arTitle}</h4>
                        <p className="text-sm text-brand-800 leading-loose whitespace-pre-line text-justify">{sec.arText}</p>
                      </div>
                      <div className="text-left dir-ltr" dir="ltr">
                        <h4 className="font-bold text-brand-900 mb-3 text-lg">{sec.enTitle || sec.arTitle}</h4>
                        <p className="text-sm text-brand-800 leading-loose whitespace-pre-line text-justify">{sec.enText || sec.arText}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {scrolledToBottom ? (
                  <div className="text-center mt-16 p-12 bg-[#F9F6F0] rounded-2xl border border-brand-200 flex flex-col items-center justify-center gap-6 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-50 opacity-40 mix-blend-multiply pattern-grid-lg"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                        <Check className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-brand-900 mb-1">نهاية الوثيقة</h4>
                      <h4 className="text-lg font-bold text-brand-900 mb-4 font-serif">End of Document</h4>
                      <p className="text-brand-700 font-medium text-center leading-relaxed max-w-md">
                        شكرًا لك. لقد أكملت الاطلاع على الاتفاقية بصيغتيها العربية والإنجليزية. يمكنك الآن الانتقال للموافقة على الإقرارات بالأسفل.
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
              checked={req1} onChange={(v) => { setReq1(v); if(v) recordLegalConsent("order_accuracy", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أقر بأن جميع بيانات الطلب صحيحة." 
              textEn="I acknowledge that all order data is correct."
            />
            <CheckboxLabel 
              checked={req2} onChange={(v) => { setReq2(v); if(v) recordLegalConsent("contract_reviewed", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أؤكد اطلاعي الكامل على وثيقة تقديم الخدمة الموضحة أعلاه." 
              textEn="I confirm my full review of the service provision document outlined above."
            />
            <CheckboxLabel 
              checked={req3} onChange={(v) => { setReq3(v); if(v) recordLegalConsent("execution_terms", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أوافق على شروط تنفيذ الخدمة وإخلاء المسؤولية." 
              textEn="I agree to the terms of service execution and disclaimer of liability."
            />
            <CheckboxLabel 
              checked={req4} onChange={(v) => { setReq4(v); if(v) recordLegalConsent("refund_acknowledged", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أقر بفهمي لسياسة الإلغاء وعدم الاسترجاع." 
              textEn="I acknowledge my understanding of the cancellation and non-refund policy."
            />
            <CheckboxLabel 
              checked={req5} onChange={(v) => { setReq5(v); if(v) recordLegalConsent("privacy_acknowledged", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أقر بمراجعتي لسياسة الخصوصية وسرية البيانات." 
              textEn="I acknowledge my review of the privacy and data confidentiality policy."
            />
            <CheckboxLabel 
              checked={req6} onChange={(v) => { setReq6(v); if(v) recordLegalConsent("electronic_signature_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أوافق على إتمام التعاقد الإلكتروني واستخدام السجلات والتوقيع الإلكتروني." 
              textEn="I agree to complete the electronic contracting and to the use of electronic records and signatures."
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
            متابعة لتوقيع العقد والدفع <ArrowLeft className="w-5 h-5" />
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
