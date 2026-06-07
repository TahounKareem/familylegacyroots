import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, ArrowLeft, ArrowRight, PenTool, Loader2, FileText, AlertTriangle } from "lucide-react";
import { useAppStore, FamilyData } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";

export function ESignature() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();
  
  const [isSigned, setIsSigned] = useState(false);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !pendingOrderData) {
      navigate("/order", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  useEffect(() => {
    let isMounted = true;
    async function initContract() {
      if (!currentUser?.id) return;
      if (signUrl) return; 
      
      try {
        setIsLoadingUrl(true);
        setErrorMsg(null);
        
        const res = await fetch("/api/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: currentUser.id,
            customerName: currentUser.name || pendingOrderData?.familyName || "Client",
            email: currentUser.email,
            locale: "ar",
            clientOrigin: window.location.origin
          })
        });
        const data = await res.json();
        if (!isMounted) return;
        
        if (!res.ok || data.error) {
          throw new Error(data.error || "فشل في إنشاء العقد من الخادم");
        }
        
        const urlStr = data?.signUrl;
        
        if (urlStr) {
          setSignUrl(urlStr);
          useAppStore.setState(s => ({
            pendingOrderData: { ...s.pendingOrderData, contractUrl: urlStr, contractId: data.contractId } as FamilyData
          }));
        } else {
          throw new Error("لم يتم العثور على رابط التوقيع في الرد.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to generate contract:", err);
        setErrorMsg(err.message || "حدث خطأ غير معروف");
      } finally {
        if (isMounted) setIsLoadingUrl(false);
      }
    }
    
    if (!signUrl && currentUser && pendingOrderData) {
      initContract();
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentUser, pendingOrderData, signUrl]);

  useEffect(() => {
    // Listen for messages from SignNow iframe
    const handleMessage = (event: MessageEvent) => {
      const isSignedStr = typeof event.data === "string" && 
        (event.data.includes("signed") || event.data.includes("complete"));
      const isSignedObj = typeof event.data === "object" && event.data !== null && 
        (event.data.status === "signed" || event.data.event === "document.complete");
      
      if (isSignedStr || isSignedObj) {
        setIsSigned(true);
        useAppStore.setState(s => ({
          pendingOrderData: { ...s.pendingOrderData, contractSigned: true } as any
        }));
        setTimeout(() => navigate("/order?payment=true", { replace: true }), 1500);
      }
    };
    window.addEventListener("message", handleMessage);

    // Fallback Polling
    let interval: NodeJS.Timeout | null = null;
    if (currentUser) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/contracts/status?orderId=${currentUser.id}`);
          const data = await res.json();
          if (data.signed) {
            setIsSigned(true);
            useAppStore.setState(s => ({
              pendingOrderData: { ...s.pendingOrderData, contractSigned: true } as any
            }));
            if (interval) clearInterval(interval);
            setTimeout(() => navigate("/order?payment=true", { replace: true }), 1500);
          }
        } catch (err) {}
      }, 5000);
    }
    return () => {
      window.removeEventListener("message", handleMessage);
      if (interval) clearInterval(interval);
    };
  }, [currentUser, navigate]);

  return (
    <div className="bg-brand-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[85vh]">
        <OrderStepper currentStep={3} />

        <div className="bg-white p-4 md:p-8 rounded-[2rem] shadow-xl border border-brand-100 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden mb-8">
           {!isSigned ? (
             <>
               <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                 <PenTool className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-bold text-brand-900 mb-2">توقيع عقد تقديم الخدمة</h2>
               <p className="text-brand-600 max-w-lg mb-6 text-sm">
                 يرجى التوقيع على العقد الإلكتروني أدناه. يتم استخدام منصة SignNow لضمان الموثوقية وتطبيق المعايير القانونية.
               </p>
               
               <div className="w-full bg-[#f8f9fa] rounded-2xl p-4 shadow-inner border border-gray-200 flex flex-col items-center justify-center relative min-h-[500px]">
                 {isLoadingUrl ? (
                   <div className="flex flex-col items-center justify-center text-brand-500">
                     <Loader2 className="w-10 h-10 animate-spin mb-4" />
                     <p>جاري الإرسال لمنصة التوقيع المعتمَدة...</p>
                   </div>
                 ) : signUrl ? (
                   <div className="w-full h-[600px] flex flex-col items-center">
                     <iframe 
                       src={signUrl}
                       className="w-full h-full border-2 border-brand-200 rounded-xl shadow-md"
                       allow="camera; microphone; geolocation"
                     ></iframe>
                     <p className="text-sm font-bold text-brand-800 max-w-sm mt-4 mb-2 text-center">بمجرد الانتهاء من التوقيع سيتم تحويلك تلقائياً</p>
                     <button onClick={() => { setIsSigned(true); navigate("/order?payment=true", { replace: true }); }} className="mb-4 px-6 py-2 bg-brand-600 text-white font-medium rounded-full shadow-md hover:bg-brand-700 transition">لقد قمت بإتمام التوقيع فعلاً (تخطي)</button>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center p-6 text-center">
                     <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                     <h3 className="text-lg font-bold text-brand-900 mb-2">تعذر الوصول لمنصة التوقيع</h3>
                     <p className="text-red-600 font-medium whitespace-pre-line mb-4 border border-red-200 bg-red-50 p-4 rounded-xl text-sm w-full max-w-lg text-right">
                       فشل الاتصال بمنصة SignNow. الخطأ الوارد:
                       <br />
                       {errorMsg}
                     </p>
                     
                     <div className="bg-brand-50 text-brand-800 p-4 rounded-xl text-sm w-full max-w-lg text-right border border-brand-100 mt-4">
                       <h4 className="font-bold mb-2 text-brand-900">تعليمات لحل المشكلة:</h4>
                       <ul className="list-disc pr-5 space-y-2">
                         <li>تأكد من إدخال <strong>SIGNNOW_API_KEY</strong> صحيح للمصادقة.</li>
                         <li>أથ تأكد من أن معلومات الدخول (الإيميل، الباسورد، Basic Token) صحيحة في الإعدادات.</li>
                         <li>ملاحظة: إذا كان حسابك مفعل عليه المصادقة الثنائية (2FA)، فلن يعمل تسجيل الدخول التلقائي ويجب استخدام رمز مصادقة (Bearer Token) مباشرة في <code>SIGNNOW_API_KEY</code>.</li>
                       </ul>
                     </div>
                   </div>
                 )}
               </div>
             </>
           ) : (
             <div className="py-20 animate-in zoom-in duration-500 flex flex-col items-center">
               <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <CheckCircle className="w-12 h-12" />
               </div>
               <h2 className="text-3xl font-bold text-brand-900 mb-4">تم التوقيع بنجاح</h2>
               <p className="text-brand-600 max-w-lg mb-8 text-lg leading-relaxed">
                 لقد قمت بإتمام التوقيع الإلكتروني بنجاح. جاري التحويل لصفحة الدفع...
               </p>
               <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
             </div>
           )}
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 mb-8 mt-auto sticky bottom-8 relative z-10">
          <button 
            type="button" 
            onClick={() => navigate("/service-agreement")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة للصفحة السابقة
          </button>
          
          <button 
            onClick={() => navigate("/order?payment=true")}
            disabled={!isSigned}
            className={`px-8 md:px-10 py-4 rounded-2xl font-bold text-base md:text-lg transition shadow-lg flex items-center gap-3 ${isSigned ? 'bg-brand-600 text-white hover:bg-brand-500 cursor-pointer animate-pulse-slow' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
             {isSigned ? 'لقد أتممت التوقيع - المتابعة للدفع' : 'في انتظار التوقيع للمتابعة'} 
             {isSigned ? <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" /> : <Loader2 className="w-5 h-5 animate-spin md:w-6 md:h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
