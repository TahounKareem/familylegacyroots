import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, ArrowLeft, Info } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";

export function ESignature() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !pendingOrderData) {
      navigate("/order", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  const handleProceed = () => {
    navigate("/order?payment=true");
  };

  return (
    <div className="bg-brand-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[85vh]">
        
        {/* Same step as contract review */}
        <OrderStepper currentStep={3} />

        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-brand-100 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden mb-8">
           <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
             <CheckCircle className="w-12 h-12" />
           </div>
           <h2 className="text-3xl font-bold text-brand-900 mb-4">تم فتح صفحة التوقيع الآمنة بنجاح</h2>
           <p className="text-brand-600 max-w-lg mb-8 text-lg leading-relaxed">
             يرجى إكمال التوقيع الإلكتروني في النافذة الجديدة المخصصة لذلك. بعد الإنتهاء، يمكنك متابعة الرحلة لإتمام عملية الدفع وتفعيل طلبك.
           </p>

           <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 max-w-md text-sm text-right leading-relaxed mt-4">
             <Info className="w-6 h-6 flex-shrink-0" />
             <p>إذا لم تفتح الصفحة بشكل تلقائي، يرجى التأكد من السماح بالنوافذ المنبثقة (Pop-ups) من متصفحك.</p>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-center items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 mb-8 mt-auto sticky bottom-8">
          <button 
            onClick={handleProceed}
            className="px-10 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg hover:bg-brand-500 transition shadow-lg flex items-center gap-3 animate-pulse-slow"
          >
            المتابعة لصفحة الدفع <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
