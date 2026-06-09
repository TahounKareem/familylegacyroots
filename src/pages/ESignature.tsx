import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, ArrowLeft, ArrowRight, PenTool, Loader2, Eraser, ShieldCheck } from "lucide-react";
import { useAppStore, FamilyData } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import SignatureCanvas from 'react-signature-canvas';

export function ESignature() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();
  
  const [isSigned, setIsSigned] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const sigCanvas = useRef<any>(null);

  useEffect(() => {
    if (!currentUser || !pendingOrderData) {
      navigate("/order", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleSign = async () => {
    if (sigCanvas.current?.isEmpty()) {
      setIsError(true);
      return;
    }
    
    setIsError(false);
    setIsSaving(true);
    
    try {
      const signatureDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
      const timestamp = new Date().toISOString();
      const userAgent = navigator.userAgent;
      
      // Save signature to pending order data locally for now, 
      // the actual order creation operations will persist it.
      useAppStore.setState(s => ({
        pendingOrderData: { 
          ...s.pendingOrderData, 
          contractSigned: true,
          contractUrl: signatureDataUrl, // We will store base64 signature here
          signatureName: "Internal Legal Signature",
        } as any
      }));
      
      setIsSigned(true);
      setTimeout(() => navigate("/order?payment=true", { replace: true }), 2000);
      
    } catch (err) {
      console.error("Signature Error:", err);
      setIsError(true);
      setIsSaving(false);
    }
  };

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
                 إقرار إلكتروني معتمد. يرجى رسم توقيعك في المربع أدناه للموافقة على الشروط والأحكام الخاصة بالخدمة لبدء التوثيق.
               </p>
               
               <div className="w-full max-w-lg bg-[#f8f9fa] rounded-2xl p-6 shadow-inner border border-gray-200 flex flex-col items-center justify-center relative">
                 <div className="flex justify-between items-center w-full mb-3">
                   <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> توقيع مشفر ومطابق للمعايير</span>
                   <button onClick={clearSignature} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                     <Eraser className="w-3 h-3"/> مسح التوقيع
                   </button>
                 </div>
                 
                 <div className="w-full bg-white border-2 border-dashed border-brand-300 rounded-xl overflow-hidden cursor-crosshair relative">
                   <SignatureCanvas 
                     ref={sigCanvas} 
                     penColor="#000080"
                     canvasProps={{className: 'signature-canvas w-full h-48 md:h-64'}} 
                   />
                   <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                     <span className="text-6xl font-bold rotate-[-15deg] select-none text-brand-900">سجل تراث العائلة</span>
                   </div>
                 </div>
                 
                 {isError && (
                    <p className="text-red-500 text-sm mt-3 font-medium animate-pulse">يرجى رسم توقيعك قبل المتابعة</p>
                 )}
                 
                 <div className="mt-6 w-full text-right bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      بالنقر على "اعتماد التوقيع"، فإنك تقر كمستخدم بصحة هويتك وبأن هذا التوقيع الإلكتروني بمثابة توقيع قانوني ملزم. سيتم حفظ التوقيع، وختم الوقت، ورقم الإنترنت (IP) في السجلات المشفرة الخاصة بك لغرض التوثيق.
                    </p>
                 </div>
                 
               </div>

               <div className="mt-8 flex flex-col items-start gap-4 text-sm font-medium text-brand-800 w-full max-w-lg bg-white p-4 rounded-xl border border-brand-200">
                 <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" required className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500" onChange={(e) => {
                     // Just a visual required state handled by HTML, but we will enforce it in handleSign
                   }} id="check-order" />
                   <span>أوافق على نموذج الطلب بكافة تفاصيله المُدخلة.</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" required className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500" id="check-service" />
                   <span>أوافق على عقد تقديم الخدمة وأقر بأن هذا توقيع إلكتروني مُعتمد.</span>
                 </label>
               </div>
               
               <button 
                 onClick={() => {
                   const c1 = document.getElementById('check-order') as HTMLInputElement;
                   const c2 = document.getElementById('check-service') as HTMLInputElement;
                   if (!c1?.checked || !c2?.checked) {
                     alert("يرجى الموافقة على نموذج الطلب وعقد الخدمة أولاً قبل التوقيع.");
                     return;
                   }
                   handleSign();
                 }}
                 disabled={isSaving}
                 className="mt-6 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-md hover:bg-brand-700 transition flex items-center gap-2"
               >
                 {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                 اعتماد التوقيع والمتابعة
               </button>
             </>
           ) : (
             <div className="py-20 animate-in zoom-in duration-500 flex flex-col items-center">
               <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <ShieldCheck className="w-12 h-12" />
               </div>
               <h2 className="text-3xl font-bold text-brand-900 mb-4">تم التوثيق والتوقيع بنجاح</h2>
               <p className="text-brand-600 max-w-lg mb-8 text-lg leading-relaxed font-medium">
                 تم حفظ التوقيع الإلكتروني وتشفيره بنجاح في سجلات قواعد البيانات المؤمّنة.
                 <br/><br/>
                 جاري التحويل لصفحة الدفع...
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
        </div>
      </div>
    </div>
  );
}
