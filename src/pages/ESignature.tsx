import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, ArrowLeft, ArrowRight, PenTool, Loader2, ShieldCheck, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";
import { orderDetailsContract, mainContractSections } from "@/data/contractContent";

export function ESignature() {
  const { currentUser, pendingOrderData } = useAppStore();
  const navigate = useNavigate();
  
  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  useEffect(() => {
    if (!currentUser || !pendingOrderData) {
      navigate("/order", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 50;
    if (bottom) setHasScrolled(true);
  };

  const handleSign = async () => {
    if (!agreed || !signatureName.trim() || !hasScrolled) return;
    
    setIsSigning(true);
    // Simulate server saving signature
    setTimeout(() => {
      setIsSigned(true);
      setIsSigning(false);
      // Update local state to reflect signed contract
      useAppStore.setState(s => ({
        pendingOrderData: { ...s.pendingOrderData, contractSigned: true, signatureName } as any
      }));
      
      // Auto redirect after short delay
      setTimeout(() => {
        navigate("/order?payment=true", { replace: true });
      }, 1500);
    }, 1000);
  };

  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const clientName = currentUser?.name || pendingOrderData?.familyName || "العميل";

  return (
    <div className="bg-brand-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[85vh]">
        
        <OrderStepper currentStep={3} />

        <div className="bg-white p-4 md:p-8 rounded-[2rem] shadow-xl border border-brand-100 flex-1 flex flex-col items-center text-center relative overflow-hidden mb-8">
           {!isSigned ? (
             <>
               <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                 <FileText className="w-8 h-8" />
               </div>
               <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-2">عقد تقديم الخدمة الإلكتروني</h2>
               <p className="text-brand-600 max-w-lg mb-6 text-sm">
                 يرجى قراءة بنود العقد أدناه. يجب التمرير لأسفل الصفحة للموافقة والتوقيع.
               </p>
               
               {/* Contract Display Container */}
               <div 
                 className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-right overflow-y-auto max-h-[400px] mb-8 shadow-inner"
                 onScroll={handleScroll}
               >
                 <div className="prose prose-sm md:prose-base prose-slate max-w-none text-gray-700">
                   <h3 className="text-center font-bold text-lg mb-6 text-gray-900">{orderDetailsContract.ar.title}</h3>
                   
                   <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6 text-sm">
                     <p className="font-bold mb-4">{orderDetailsContract.ar.subtitle}</p>
                     <ul className="space-y-2">
                       <li><span className="font-bold text-gray-900">{orderDetailsContract.ar.fields.orderDate}:</span> {today}</li>
                       <li><span className="font-bold text-gray-900">{orderDetailsContract.ar.fields.customerName}:</span> {clientName}</li>
                       <li><span className="font-bold text-gray-900">{orderDetailsContract.ar.fields.email}:</span> {currentUser?.email}</li>
                       <li><span className="font-bold text-gray-900">{orderDetailsContract.ar.fields.product}:</span> سجل تراث العائلة - الإصدار الأساسي</li>
                     </ul>
                   </div>

                   {mainContractSections.map((section, idx) => (
                     <div key={idx} className="mb-6">
                       {section.arTitle && <h4 className="font-bold text-gray-900 text-base mb-3 mt-6">{section.arTitle}</h4>}
                       <div className="whitespace-pre-line leading-relaxed text-sm text-gray-600">{section.arText}</div>
                     </div>
                   ))}
                   
                   <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
                     {orderDetailsContract.ar.footerCheckbox}
                   </div>
                 </div>
               </div>

               {/* Signature Controls */}
               <div className="w-full max-w-lg bg-white border border-brand-100 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-brand-900 mb-4 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-500" />
                    التوقيع الرقمي المعتمد
                  </h4>
                  
                  <div className="flex flex-col gap-4 text-right">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="agree" 
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        disabled={!hasScrolled}
                        className="mt-1 w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500 disabled:opacity-50"
                      />
                      <label htmlFor="agree" className={`text-sm ${hasScrolled ? 'text-gray-700' : 'text-gray-400'}`}>
                        أقر بأنني قد قرأت العقد بكافة بنوده ومواده، وأوافق على ما جاء فيه إقراراً شرعياً وقانونياً نافذاً.
                        {!hasScrolled && <span className="block text-xs text-brand-500 mt-1">*(يرجى التمرير لأسفل العقد لتفعيل الموافقة)*</span>}
                      </label>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل (يُعد توقيعاً إلكترونياً)</label>
                      <input 
                        type="text" 
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="اكتب اسمك الكامل للمصادقة..."
                        disabled={!agreed}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-gray-50 disabled:opacity-50 disabled:bg-gray-100 transition"
                      />
                    </div>
                  </div>
               </div>
             </>
           ) : (
             <div className="py-20 animate-in zoom-in duration-500 flex flex-col items-center justify-center h-full">
               <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <CheckCircle className="w-12 h-12" />
               </div>
               <h2 className="text-3xl font-bold text-brand-900 mb-4">تم التوقيع بنجاح</h2>
               <p className="text-brand-600 max-w-lg mb-8 text-lg leading-relaxed">
                 تم توثيق موافقتك الرقمية واعتماد العقد بنجاح. جاري التحويل لصفحة الدفع...
               </p>
               <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
             </div>
           )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100 mb-8 mt-auto sticky bottom-8 relative z-10">
          <button 
            type="button" 
            onClick={() => navigate("/service-agreement")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة للصفحة السابقة
          </button>
          
          {!isSigned && (
            <button 
              onClick={handleSign}
              disabled={!agreed || !signatureName.trim() || !hasScrolled || isSigning}
              className={`px-8 md:px-10 py-4 rounded-2xl font-bold text-base md:text-lg transition shadow-lg flex items-center gap-3 ${(agreed && signatureName.trim() && hasScrolled) ? 'bg-brand-600 text-white hover:bg-brand-500 cursor-pointer animate-pulse-slow' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
               {isSigning ? 'جاري التوثيق...' : 'اعتماد التوقيع والمتابعة'} 
               {isSigning ? <Loader2 className="w-5 h-5 animate-spin md:w-6 md:h-6" /> : <PenTool className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
