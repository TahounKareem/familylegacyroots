import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, ArrowLeft, ArrowRight, Info, PenTool } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";

export function ESignature() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (!currentUser || !pendingOrderData) {
      navigate("/order", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  useEffect(() => {
    // 1. Listen for messages from eSignatures iframe
    const handleMessage = (event: MessageEvent) => {
      console.log("Iframe message received:", event.origin, event.data);
      
      // Handle different possible payload formats from eSignatures
      const isSignedStr = typeof event.data === "string" && 
        (event.data.includes("signed") || event.data === "contract_signed" || event.data === "esignature_success");
        
      const isSignedObj = typeof event.data === "object" && event.data !== null && 
        (event.data.status === "signed" || event.data.event === "contract_signed" || event.data.event === "signer_signed");
      
      if (isSignedStr || isSignedObj) {
        console.log("Signature confirmed via postMessage!");
        setIsSigned(true);
      }
    };

    window.addEventListener("message", handleMessage);

    // 2. Poll the backend as a fallback (if webhook is active)
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
  }, [currentUser]);

  return (
    <div className="bg-brand-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[85vh]">
        
        {/* Same step as contract review */}
        <OrderStepper currentStep={3} />

        <div className="bg-white p-4 md:p-8 rounded-[2rem] shadow-xl border border-brand-100 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden mb-8">
           
           {!isSigned ? (
             <>
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                 <PenTool className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-bold text-brand-900 mb-2">توقيع عقد تقديم الخدمة</h2>
               <p className="text-brand-600 max-w-lg mb-6 text-sm">
                 يرجى قراءة العقد والتوقيع عليه مباشرة من خلال النموذج أدناه. بعد إتمام التوقيع يمكنك الضغط على زر "المتابعة" بالأسفل للذهاب لصفحة الدفع.
               </p>
               
               <div className="w-full bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-inner border border-gray-200" style={{ height: '700px' }}>
                 {/* eSignatures Iframe */}
                 <iframe 
                   src={`https://esignatures.com/signl/1e7a31ca-f0dc-480a-a209-de74843b9857?embedded=yes&redirect_url=${encodeURIComponent(window.location.origin + "/e-signature-success")}`} 
                   width="100%" 
                   height="100%" 
                   style={{ border: 'none', minHeight: '700px' }}
                   id="eSignaturesIframe"
                   title="eSignatures Contract"
                   sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                 />
               </div>
             </>
           ) : (
             <div className="py-20 animate-in zoom-in duration-500 flex flex-col items-center">
               <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <CheckCircle className="w-12 h-12" />
               </div>
               <h2 className="text-3xl font-bold text-brand-900 mb-4">تم التوقيع بنجاح</h2>
               <p className="text-brand-600 max-w-lg mb-8 text-lg leading-relaxed">
                 لقد قمت بإتمام التوقيع الإلكتروني بنجاح. يمكنك الآن متابعة الرحلة لإتمام عملية الدفع وتفعيل طلبك.
               </p>
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
            className="px-8 md:px-10 py-4 rounded-2xl font-bold text-base md:text-lg transition shadow-lg flex items-center gap-3 bg-brand-600 text-white hover:bg-brand-500 cursor-pointer"
          >
            لقد أتممت التوقيع - المتابعة للدفع <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
