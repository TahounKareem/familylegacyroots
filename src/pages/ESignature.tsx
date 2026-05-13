import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { PenTool, ArrowLeft, ArrowRight } from "lucide-react";
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

  const handlePrev = () => {
    navigate("/service-agreement");
  };

  return (
    <div className="bg-brand-50 min-h-screen py-12 animate-in fade-in zoom-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <OrderStepper currentStep={5} />

        <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-brand-100 text-center relative overflow-hidden mb-8 max-w-lg mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white">
            <PenTool className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">التوقيع الإلكتروني</h2>
          
          <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl mb-8 leading-relaxed font-medium border border-blue-100">
            سيتم التوقيع الإلكتروني الآمن عبر مزود التوقيع المعتمد قبل إتمام الدفع.
          </div>

          <p className="text-brand-500 text-sm">
            (هذه صفحة نموذجية - Placeholder - لا يوجد ربط حالي بمزود الخدمة)
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 max-w-lg mx-auto">
          <button 
            type="button" 
            onClick={handlePrev} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
          </button>
          
          <button 
            onClick={handleProceed}
            className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold text-base hover:bg-brand-500 transition shadow-lg flex items-center gap-2"
          >
            الانتقال للدفع <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
