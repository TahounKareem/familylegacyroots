import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Check, ShieldCheck, Mail, Phone, MapPin, User, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import { orderDetailsContract, mainContractSections } from "@/data/contractContent";

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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 150) {
        setScrolledToBottom(true);
      }
    }
  };

  const allChecked = req1 && req2 && req3 && req4 && req5 && req6;
  const canProceed = allChecked && scrolledToBottom;

  const handleProceed = () => {
    // Navigating to E-signature placeholder
    navigate("/e-signature");
  };

  if (!currentUser || !pendingOrderData) return null;

  const priceAmount = "$1999.00";
  const dummyOrderId = "ORD-PENDING-" + Math.floor(Math.random() * 9000);
  const dummyInvoiceId = "INV-PENDING";

  // Prevent copy in viewer
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-brand-50 min-h-screen pb-12 pt-8 relative border-t-4 border-brand-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar (Step 5 - Service Agreement) */}
        <OrderStepper currentStep={5} />

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

                {!scrolledToBottom && (
                  <div className="text-center mt-12 py-8 bg-brand-100/50 rounded-xl border border-brand-200">
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
              checked={req1} onChange={setReq1} 
              text="أقر بأن جميع بيانات الطلب صحيحة." 
            />
            <CheckboxLabel 
              checked={req2} onChange={setReq2} 
              text="أؤكد اطلاعي الكامل على وثيقة تقديم الخدمة الموضحة أعلاه." 
            />
            <CheckboxLabel 
              checked={req3} onChange={setReq3} 
              text="أوافق على شروط تنفيذ الخدمة وإخلاء المسؤولية." 
            />
            <CheckboxLabel 
              checked={req4} onChange={setReq4} 
              text="أقر بفهمي لسياسة الإلغاء وعدم الاسترجاع." 
            />
            <CheckboxLabel 
              checked={req5} onChange={setReq5} 
              text="أقر بمراجعتي لسياسة الخصوصية وسرية البيانات." 
            />
            <CheckboxLabel 
              checked={req6} onChange={setReq6} 
              text="أوافق على إتمام التعاقد الإلكتروني واستخدام السجلات والتوقيع الإلكتروني." 
            />
          </div>

          {!scrolledToBottom && (
             <p className="text-red-500 text-sm mt-4 font-bold flex items-center gap-2">
               يرجى التمرير وقراءة العقد كاملاً حتى نهايته لتفعيل الإقرار بالموافقة.
             </p>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100">
          <button 
            type="button" 
            onClick={() => navigate("/shipping-details")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
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

function CheckboxLabel({ checked, onChange, text }: { checked: boolean, onChange: (val: boolean) => void, text: string }) {
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
      <div className="text-sm text-brand-800 leading-relaxed font-bold">
        {text}
      </div>
    </label>
  );
}
