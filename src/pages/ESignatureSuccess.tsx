import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export function ESignatureSuccess() {
  useEffect(() => {
    // Notify the parent or opener window that signing was successfully completed
    if (window.opener) {
      window.opener.postMessage("esignature_success", "*");
      window.close(); // Close the popup
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage("esignature_success", "*");
      
      // Also try to direct navigate the top window
      try {
        if (window.parent) {
          window.parent.location.href = window.location.origin + "/order?payment=true";
        }
      } catch (err) {
        console.error("Could not navigate parent window directly:", err);
      }
    } else {
      // If opened normally, redirect
      window.location.href = "/order?payment=true";
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-100 flex flex-col items-center max-w-sm text-center animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-brand-900 mb-2">تم توقيع العقد بنجاح</h2>
        <p className="text-brand-600 text-sm">جاري التوجيه تلقائياً...</p>
      </div>
    </div>
  );
}
