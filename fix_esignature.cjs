const fs = require('fs');
let code = fs.readFileSync('src/pages/ESignatureSuccess.tsx', 'utf8');

code = `import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ESignatureSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // We are inside an iframe in AI Studio, so window.parent exists but we shouldn't navigate it.
    // We just want to navigate our own app router.
    
    // Slight delay so the user sees the success message
    const timer = setTimeout(() => {
      navigate("/order?payment=true", { replace: true });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

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
`;

fs.writeFileSync('src/pages/ESignatureSuccess.tsx', code);
