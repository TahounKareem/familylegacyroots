import React from 'react';

export function MockSignature() {
  const handleSign = () => {
    // Post message to parent iframe to simulate sign completion
    window.parent.postMessage({ event: 'document.complete', status: 'signed' }, '*');
    
    // Also change UI to show success
    const btn = document.getElementById('sign-btn');
    if (btn) {
      btn.innerText = "تم التوقيع بنجاح";
      btn.className = "bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-xl cursor-not-allowed";
      btn.setAttribute("disabled", "true");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg border border-gray-100">
        <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">وثيقة بديلة (للتجربة)</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          تعذر الوصول لمنصة التوقيع الإلكتروني. يمكنك استخدام هذا الزر لتجاوز هذه الخطوة مؤقتاً ومواصلة رحلتك في النظام.
        </p>
        <button 
          id="sign-btn"
          onClick={handleSign}
          className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all w-full"
        >
          محاكاة التوقيع
        </button>
      </div>
    </div>
  );
}
