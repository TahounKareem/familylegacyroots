const fs = require('fs');
let code = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

code = code.replace(
  'const submitOrder = async () => {',
  'const submitOrder = async (useTestLink = false) => {'
);

code = code.replace(
  `      // We redirect directly to Stripe Payment Links with client_reference_id
      const packagePrice = paymentType === "full" ? 1780 : 693;`,
  `      // We redirect directly to Stripe Payment Links with client_reference_id
      if (useTestLink) {
        window.location.href = "https://buy.stripe.com/14AcN6bfb9K13nY7pr8so05";
        return;
      }
      const packagePrice = paymentType === "full" ? 1780 : 693;`
);

code = code.replace(
  `<a href="https://buy.stripe.com/14AcN6bfb9K13nY7pr8so05" className="text-[11px] text-gray-400 hover:text-gray-600 underline">
               [رابط تجريبي مؤقت] إتمام الدفع (يحتاج لإعداد رابط العودة Redirect في Stripe)
             </a>`,
  `<button onClick={() => {
               if (paymentType === "full") submitOrder(true);
               else {
                 // Hack for installment test
                 submitOrder(true);
               }
             }} className="text-[11px] text-gray-400 hover:text-gray-600 underline">
               [رابط تجريبي مؤقت] إتمام الدفع عبر الرابط الثابت (يحتاج لإعداد رابط العودة Redirect في Stripe)
             </button>`
);

fs.writeFileSync('src/pages/OrderFlow.tsx', code);
