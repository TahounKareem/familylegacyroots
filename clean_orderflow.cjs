const fs = require('fs');
let code = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

code = code.replace(
  'const submitOrder = async (useTestLink = false) => {',
  'const submitOrder = async () => {'
);

code = code.replace(
  `      // We redirect directly to Stripe Payment Links with client_reference_id
      if (useTestLink) {
        const url = "https://buy.stripe.com/14AcN6bfb9K13nY7pr8so05";
        const newWin = window.open(url, '_blank');
        if (!newWin) window.location.href = url;
        return;
      }`,
  `      // We redirect directly to Stripe Payment Links with client_reference_id`
);

code = code.replace(
  `        {step === 4 && !showInviteModal && (
          <div className="text-center mt-6">
             <button onClick={() => {
               if (paymentType === "full") submitOrder(true);
               else {
                 // Hack for installment test
                 submitOrder(true);
               }
             }} className="text-[11px] text-gray-400 hover:text-gray-600 underline">
               [رابط تجريبي مؤقت] إتمام الدفع عبر الرابط الثابت (يحتاج لإعداد رابط العودة Redirect في Stripe)
             </button>
          </div>
        )}`,
  ``
);

fs.writeFileSync('src/pages/OrderFlow.tsx', code);
