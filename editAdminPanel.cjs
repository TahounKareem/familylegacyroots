const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/pages/AdminPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// For: "عندما يكون الإجراء 'جاري التصويب' إخفي زر 'تحميل ملف البحث بعد التصويب'"
content = content.replace(
  /\{\(order\.actionPhase === "تمت المسودة" \|\| order\.actionPhase === "جاري التصويب" \|\| order\.actionPhase === "تم التصويب"\) && \(/g,
  `{(order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصويب") && (`
);

// We also need to check "جاهز للتسليم النهائي" - wait, it is already excluded in the condition above, because the condition only allows "تمت المسودة" and "تم التصويب".

// Next task:
// في لوحة تحكم إدارة الطلبات
// في الصفحة الخاصة ب "إتمام وتسليم الطلب" قم بتعبئة مسبقة لباقي الحقول تماما كما في رابط النسخة الرقمية لتكون الحقل الاول خاص ب تاريخ الشحن ، والحقل الثاني لاسم شركة الشحن ، والحقل الثالث لرقم التتبع .. وجعل حقل "توصيات فريق البحث" هو الحقل الأخير
content = content.replace(
  /<input\s*type="date"\s*className="\[\^"\]*"\s*value=\{deliveryFormData\.deliveryDate\}\s*onChange=\{\(e\) => setDeliveryFormData\(\{\.\.\.deliveryFormData, deliveryDate: e.target.value\}\)\}\s*\/>/g,
  `<input type="date" className="w-full bg-white border border-gray-200 p-2 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" value={deliveryFormData.deliveryDate} onChange={(e) => setDeliveryFormData({...deliveryFormData, deliveryDate: e.target.value})} />`
);

let formBlockMatch = content.match(/<div className="grid grid-cols-1 md:grid-cols-2 gap-4">([\s\S]*?)<\/div>/);
// Let me not use regex for the whole form, better to do targeted replacements.

fs.writeFileSync(filePath, content);
console.log("AdminPanel.tsx buttons updated.");
