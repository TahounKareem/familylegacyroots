import React from "react";
import { Check } from "lucide-react";

interface OrderStepperProps {
  currentStep: number;
}

export function OrderStepper({ currentStep }: OrderStepperProps) {
  const stepsList = [
    { title: "تقديم البيانات", subtitle: "بيانات أمين السجل" },
    { title: "إعداد هوية السجل", subtitle: "تحديد أمين السجل واختيار قالب التصميم" },
    { title: "مراجعة الطلب والتوقيع", subtitle: "مراجعة بيانات الطلب والتوقيع الإلكتروني" },
    { title: "بدء التنفيذ", subtitle: "إتمام الدفع" }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-200 -z-10 translate-y-[-50%]"></div>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors border-4 ${
            currentStep >= s ? 'bg-brand-600 border-brand-100 text-white' : 'bg-white border-brand-200 text-brand-400'
          }`}>
            {currentStep > s ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : s}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-center px-1">
        {stepsList.map((stepItem, i) => (
          <div key={i} className="flex flex-col items-center w-[25%]">
            <span className={`text-[9px] sm:text-xs md:text-sm leading-tight ${currentStep >= i + 1 ? 'text-brand-900 font-bold' : 'text-brand-600 font-medium'}`}>{stepItem.title}</span>
            <span className={`hidden sm:block text-[8px] sm:text-[10px] md:text-xs mt-1 leading-tight ${currentStep >= i + 1 ? 'text-brand-700' : 'text-brand-400'}`}>{stepItem.subtitle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

