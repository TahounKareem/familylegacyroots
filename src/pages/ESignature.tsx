import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PenTool, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";

export function ESignature() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (!currentUser || !pendingOrderData) {
      navigate("/order", { replace: true });
      return;
    }

    let interval: NodeJS.Timeout;

    async function initContract() {
      try {
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: currentUser!.id, // We use user id as canonical order link
            customerName: currentUser!.name || pendingOrderData!.firstName,
            email: currentUser!.email,
            locale: 'ar'
          })
        });
        const data = await response.json();
        if (data.sign_page_url) {
          // Remove embedded constraint to allow opening in new tab
          setSignUrl(data.sign_page_url);
          
          // Poll for status
          interval = setInterval(async () => {
             try {
               const res = await fetch(`/api/contracts/status?orderId=${currentUser!.id}`);
               const check = await res.json();
               if (check.signed) {
                  setIsSigned(true);
                  if (interval) clearInterval(interval);
               }
             } catch (e) {}
          }, 3000);
        } else {
          setError("لم نتمكن من الوصول لنظام التوقيع.");
        }
      } catch (err: any) {
        setError(err.message || "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    }
    
    initContract();

    return () => clearInterval(interval);
  }, [currentUser, pendingOrderData, navigate]);

  const handleProceed = () => {
    if (!isSigned) return;
    navigate("/order?payment=true");
  };

  const handlePrev = () => {
    navigate("/service-agreement");
  };

  return (
    <div className="bg-brand-50 min-h-screen py-12 animate-in fade-in zoom-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[85vh]">
        
        <OrderStepper currentStep={4} />

        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-brand-100 text-center relative overflow-hidden mb-8 flex-1 flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-16 h-16 ${isSigned ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center shadow-inner border-4 border-white transition-colors`}>
              {isSigned ? <CheckCircle className="w-8 h-8" /> : <PenTool className="w-8 h-8" />}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-serif font-bold text-brand-900 leading-tight">التوقيع الإلكتروني</h2>
              <p className="text-brand-500 text-sm">التصديق على عقد تقديم الخدمة</p>
            </div>
          </div>
          
          {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-brand-500 min-h-[400px]">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-600" />
               <p>جاري تجهيز العقد المشفر...</p>
             </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-red-500 min-h-[400px]">
               <p className="mb-4 font-bold">{error}</p>
               <button onClick={() => window.location.reload()} className="text-sm underline hover:text-red-700">تحديث الصفحة</button>
            </div>
          ) : isSigned ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle className="w-12 h-12" />
               </div>
               <h3 className="text-2xl font-bold text-brand-900 mb-2">تم التوقيع بنجاح</h3>
               <p className="text-brand-600 max-w-sm">تم توثيق العقد إلكترونياً. يمكنك الآن الانتقال للدفع لإتمام طلبك.</p>
            </div>
          ) : signUrl ? (
             <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fa] rounded-2xl p-8 min-h-[400px] shadow-inner border border-gray-200">
               <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                 <PenTool className="w-12 h-12" />
               </div>
               <h3 className="text-2xl font-bold text-brand-900 mb-2">توقيع العقد خارجياً</h3>
               <p className="text-brand-600 max-w-md text-center mb-8">
                 لتوفير أقصى درجات الأمان وحل مشكلة العرض، يرجى الضغط على الزر أدناه لفتح صفحة التوقيع في نافذة جديدة. 
                 <br/><br/>
                 (بعد إنتهاء التوقيع، سيتم تفعيل زر الاستمرار تلقائياً)
               </p>
               <a 
                 href={signUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition shadow-lg flex items-center gap-3 animate-pulse-slow"
               >
                 فتح صفحة التوقيع في نافذة جديدة <ArrowLeft className="w-6 h-6" />
               </a>
             </div>
          ) : null}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 mb-8 mt-auto sticky bottom-8">
          <button 
            type="button" 
            onClick={handlePrev} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
          </button>
          
          <button 
            onClick={handleProceed}
            disabled={!isSigned}
            className={`px-6 sm:px-8 py-3 rounded-2xl font-bold text-sm sm:text-base transition shadow-lg flex items-center gap-2 ${isSigned ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {isSigned ? 'الانتقال للدفع' : 'بإنتظار التوقيع...'} <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
