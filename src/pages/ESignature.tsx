import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, ArrowLeft, ArrowRight, Info, PenTool, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
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
    async function initContract() {
      if (!currentUser?.id) return;
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
        
        if (!res.ok || data.error) {
          throw new Error(data.error || "فشل في إنشاء العقد من الخادم");
        }
        
        const urlStr = data?.data?.contract?.signers?.[0]?.sign_page_url || data?.contract?.signers?.[0]?.sign_page_url;
        
        if (urlStr) {
          // Remove embedded since we want a popup/new window experience
          setSignUrl(urlStr);
        } else {
          throw new Error("لم يتم العثور على رابط التوقيع في الرد: " + JSON.stringify(data));
        }
      } catch (err: any) {
        console.error("Failed to generate contract:", err);
        setErrorMsg(err.message || "حدث خطأ غير معروف");
      } finally {
        setIsLoadingUrl(false);
      }
    }
    initContract();
  }, [currentUser, pendingOrderData]);

  useEffect(() => {
    // 1. Listen for messages from eSignatures iframe
    const handleMessage = (event: MessageEvent) => {
      console.log("Iframe message received:", event.origin, event.data);
      
      const isSignedStr = typeof event.data === "string" && 
        (event.data.includes("signed") || event.data === "contract_signed" || event.data === "esignature_success");
        
      const isSignedObj = typeof event.data === "object" && event.data !== null && 
        (event.data.status === "signed" || event.data.event === "contract_signed" || event.data.event === "signer_signed");
      
      if (isSignedStr || isSignedObj) {
        console.log("Signature confirmed via postMessage!");
        setIsSigned(true);
        navigate("/order?payment=true", { replace: true });
      }
    };

    window.addEventListener("message", handleMessage);

    // 2. Poll the backend as a fallback
    let interval: NodeJS.Timeout | null = null;
    if (currentUser) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/contracts/status?orderId=${currentUser.id}`);
          const data = await res.json();
          if (data.signed) {
            console.log("Signature confirmed via Webhook polling!");
            setIsSigned(true);
            if (interval) clearInterval(interval);
            navigate("/order?payment=true", { replace: true });
          }
        } catch (err) {
          // Silent catch for poll error
        }
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
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                 <PenTool className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-bold text-brand-900 mb-2">توقيع عقد تقديم الخدمة</h2>
               <p className="text-brand-600 max-w-lg mb-6 text-sm">
                 يرجى قراءة العقد والتوقيع عليه مباشرة من خلال النموذج أدناه. بعد إتمام التوقيع سيتم توجيهك تلقائياً لصفحة الدفع.
               </p>
               
               <div className="w-full bg-[#f8f9fa] rounded-2xl p-8 shadow-inner border border-gray-200 flex flex-col items-center justify-center relative min-h-[400px]">
                 {isLoadingUrl ? (
                   <div className="flex flex-col items-center justify-center text-brand-500">
                     <Loader2 className="w-10 h-10 animate-spin mb-4" />
                     <p>جاري تجهيز عقد الخدمة...</p>
                   </div>
                 ) : signUrl ? (
                   <div className="flex flex-col items-center space-y-6">
                     <p className="text-gray-700 text-lg">الرجاء الضغط على الزر أدناه لفتح وثيقة العقد في صفحة جديدة وبدء التوقيع.</p>
                     <button
                       onClick={() => window.open(signUrl, 'sign_popup', 'width=800,height=800')}
                       className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-3 transition"
                     >
                       <PenTool className="w-6 h-6" />
                       فتح لـتـوقيـع الـعـقـد
                     </button>
                     <p className="text-sm text-gray-500 max-w-sm mt-4">
                       بعد التوقيع، سيتم تحديث هذه الصفحة والمتابعة تلقائياً. في حال لم يحدث ذلك، يرجى تحديث الصفحة.
                     </p>
                     {(currentUser?.role === 'admin' || currentUser?.role === 'maestro') && (
                       <button
                         onClick={() => { setIsSigned(true); navigate("/order?payment=true", { replace: true }); }}
                         className="mt-8 text-xs underline text-red-500"
                       >
                         تخطي للإختبار (المدير العام)
                       </button>
                     )}
                   </div>
                 ) : (
                   <div className="text-red-500 font-medium p-4">
                     {errorMsg || "حدث خطأ أثناء استخراج رابط التوقيع. يرجى מراجعة إعدادات قالب eSignatures.io الخاص بك."}
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

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 mb-8 mt-auto sticky bottom-8">
          <button 
            type="button" 
            onClick={() => navigate("/service-agreement")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
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
