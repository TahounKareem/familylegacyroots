import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface AccordionContractProps {
  sections: Array<{ id: string; arTitle: string; enTitle: string; arText: string; enText: string }>;
  orderDetailsContract: any;
  dummyOrderId: string;
  dummyInvoiceId: string;
  pendingOrderData: any;
  currentUser: any;
  onOpen?: () => void;
}

export function AccordionContract({ sections, orderDetailsContract, dummyOrderId, dummyInvoiceId, pendingOrderData, currentUser, onOpen }: AccordionContractProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) {
    return (
      <button 
        onClick={() => {
          setIsOpen(true);
          onOpen?.();
        }}
        className="w-full bg-[#541214] text-white p-6 justify-between flex items-center rounded-2xl shadow-md border hover:bg-[#6b1e22] transition-all group"
      >
        <div className="flex items-center gap-4">
          <FileText className="w-6 h-6 text-white/80 group-hover:text-white" />
          <span className="font-bold text-lg md:text-xl tracking-wide">عقد تقديم الخدمة - Contract of Service</span>
        </div>
        <ChevronDown className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#541214] shadow-md overflow-hidden animate-in fade-in slide-in-from-top-4">
      <button 
        onClick={() => setIsOpen(false)}
        className="w-full bg-[#541214] text-white px-6 py-4 flex items-center justify-between"
      >
         <div className="flex items-center gap-3">
           <FileText className="w-5 h-5 text-white/80" />
           <span className="font-bold tracking-wide">عقد تقديم الخدمة - Contract of Service</span>
         </div>
         <ChevronUp className="w-5 h-5" />
      </button>
      
      <div className="p-4 md:p-6 bg-[#faf9f7] max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          
          {/* Order Details Header */}
          <div className="bg-white border border-brand-200 rounded-xl overflow-hidden shadow-sm">
            <button 
               onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
               className="w-full text-right bg-brand-50 hover:bg-brand-100 p-4 font-bold text-brand-900 border-b border-brand-100 flex justify-between items-center"
            >
              <span>{orderDetailsContract.ar.title}</span>
              {expandedSection === 'details' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {expandedSection === 'details' && (
              <div className="p-6 text-sm">
                <p className="whitespace-pre-line text-right text-brand-600 font-mono mb-6">{orderDetailsContract.ar.intro}</p>
                <div className="border border-brand-200 rounded-xl overflow-hidden bg-white text-sm tracking-wide">
                    {[
                      [orderDetailsContract.ar.fields.orderId, `${dummyOrderId}`],
                      [orderDetailsContract.ar.fields.invoiceId, `${dummyInvoiceId}`],
                      [orderDetailsContract.ar.fields.orderDate, new Date().toLocaleDateString('ar-EG')],
                      [orderDetailsContract.ar.fields.customerName, `${pendingOrderData.firstName} \${pendingOrderData.fatherName} \${pendingOrderData.familyName}`],
                      [orderDetailsContract.ar.fields.email, currentUser.email],
                      [orderDetailsContract.ar.fields.phone, pendingOrderData.shippingAddress?.phone || "-"],
                      [orderDetailsContract.ar.fields.shippingAddress, `${pendingOrderData.shippingAddress?.street}, \${pendingOrderData.shippingAddress?.state}, \${pendingOrderData.shippingAddress?.country}`],
                      [orderDetailsContract.ar.fields.product, `خدمة توثيق عمود النسب واصدار سجل تراث العائلة (السجل الأساسي -  البوابة الرئيسية)`],
                      [orderDetailsContract.ar.fields.amount, `1980 SAR`],
                      [orderDetailsContract.ar.fields.paymentMethod, `pending`],
                      [orderDetailsContract.ar.fields.paymentStatus, `pending`],
                      [orderDetailsContract.ar.fields.estimatedTime, `من 90 إلى 180 يوم .`],
                      [orderDetailsContract.ar.fields.revisionTime, `15 يوم من تاريخ اصدار سجل تراث العائلة ( السجل الأساسي -  البوابة الرئيسية)`],
                      [orderDetailsContract.ar.fields.deliveryChannel, `عبر حسابكم على المنصة`]
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-brand-100 last:border-0 hover:bg-brand-50/50 transition">
                        <div className="bg-brand-50/50 px-4 py-3 font-bold text-brand-900 border-l border-brand-100/50 text-right">
                          {row[0]}
                        </div>
                        <div className="px-4 py-3 text-brand-700 text-right md:col-span-3">
                          {row[1]}
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </div>

          {/* Contract Sections */}
          {sections.map(sec => (
             <div key={sec.id} className="bg-white border border-brand-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                  className="w-full text-right p-4 font-bold text-brand-900 border-b border-brand-100 hover:bg-brand-50 transition grid grid-cols-[1fr_auto]"
                >
                  <div className="flex flex-col gap-1 pr-2">
                    <span>{sec.arTitle}</span>
                    <span className="text-xs text-brand-500 font-serif" dir="ltr">{sec.enTitle}</span>
                  </div>
                  <div className="flex items-center justify-center pl-2">
                    {expandedSection === sec.id ? <ChevronUp className="w-5 h-5 text-brand-500" /> : <ChevronDown className="w-5 h-5 text-brand-400" />}
                  </div>
                </button>
                {expandedSection === sec.id && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm bg-white">
                    <div className="text-right text-brand-800 space-y-4">
                      {sec.arText.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="text-justify whitespace-pre-wrap">{paragraph}</p>
                      ))}
                    </div>
                    <div className="text-left text-brand-800 space-y-4 font-serif" dir="ltr">
                      {sec.enText.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="text-justify whitespace-pre-wrap">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          ))}

        </div>
      </div>
    </div>
  );
}
