import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowRight, ArrowLeft, Truck, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OrderStepper } from "@/components/OrderStepper";

export function ShippingDetails() {
  const { currentUser, pendingOrderData, setPendingOrderData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth?redirect=/shipping-details", { replace: true });
    } else if (!pendingOrderData) {
      navigate("/order", { replace: true });
    }
  }, [currentUser, pendingOrderData, navigate]);

  const [shipping, setShipping] = useState({
    name: pendingOrderData?.shippingAddress?.name || 
          (pendingOrderData?.firstName ? `${pendingOrderData.firstName} ${pendingOrderData.fatherName} ${pendingOrderData.familyName}`.trim() : ""),
    phone: pendingOrderData?.shippingAddress?.phone || "",
    country: pendingOrderData?.shippingAddress?.country || pendingOrderData?.country || "",
    state: pendingOrderData?.shippingAddress?.state || "",
    street: pendingOrderData?.shippingAddress?.street || "",
    zip: pendingOrderData?.shippingAddress?.zip || "",
    notes: pendingOrderData?.shippingAddress?.notes || "",
  });

  const [confirmed, setConfirmed] = useState(false);

  const isValid = shipping.name && shipping.phone && shipping.country && shipping.state && shipping.street && confirmed;

  const handleNext = () => {
    if (pendingOrderData) {
      setPendingOrderData({
        ...pendingOrderData,
        shippingAddress: shipping
      });
      navigate("/order?step=4");
    }
  };

  if (!currentUser || !pendingOrderData) return null;

  return (
    <div className="bg-brand-50 min-h-screen py-12 relative animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-6">
          <Link to="/order?step=2" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-medium transition">
            <ArrowRight className="w-4 h-4" /> العودة في رحلة الطلب
          </Link>
        </div>

        {/* Progress Bar (Step 3) */}
        <OrderStepper currentStep={3} />

        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">بيانات الشحن</h2>
            <p className="text-brand-600">يرجى إدخال عنوان التسليم لاستلام السجل المطبوع والوثائق</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-800 mb-2">اسم المستلم *</label>
              <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                value={shipping.name} onChange={(e)=>setShipping({...shipping, name: e.target.value})} placeholder="الاسم الكامل" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">رقم الهاتف *</label>
              <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" 
                value={shipping.phone} onChange={(e)=>setShipping({...shipping, phone: e.target.value})} placeholder="+0000000000" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">الدولة *</label>
              <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                value={shipping.country} onChange={(e)=>setShipping({...shipping, country: e.target.value})} placeholder="الدولة" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
              <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                value={shipping.state} onChange={(e)=>setShipping({...shipping, state: e.target.value})} placeholder="المدينة أو المحافظة" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">الرمز البريدي (اختياري)</label>
              <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                value={shipping.zip} onChange={(e)=>setShipping({...shipping, zip: e.target.value})} placeholder="الرمز البريدي" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-800 mb-2">العنوان التفصيلي *</label>
              <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                value={shipping.street} onChange={(e)=>setShipping({...shipping, street: e.target.value})} placeholder="الحي، الشارع، المبنى، رقم الشقة" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-800 mb-2">ملاحظات الشحن (اختياري)</label>
              <textarea className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 h-24 resize-none" 
                value={shipping.notes} onChange={(e)=>setShipping({...shipping, notes: e.target.value})} placeholder="أي ملاحظات تفصيلية لشركة الشحن..." />
            </div>
          </div>

          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-200">
            <h3 className="font-bold text-brand-900 border-b border-brand-200 pb-2 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" />
              بيانات الشحن المعتمدة
            </h3>
            
            <label className="flex items-start gap-4 cursor-pointer">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
              </div>
              <div className="text-sm text-brand-800 leading-relaxed font-bold pt-0.5">
                أؤكد صحة بيانات الشحن واعتمادها لتسليم المنتج.
              </div>
            </label>
          </div>

        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100">
          <button 
            type="button" 
            onClick={() => navigate("/order?step=2")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة
          </button>
          
          <button 
            onClick={handleNext} 
            disabled={!isValid}
            className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            الانتقال إلى تأكيد الإصدار <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
