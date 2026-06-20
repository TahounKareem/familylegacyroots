const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/pages/Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the array in Dashboard.tsx
content = content.replace(
  /!\s*\["تمت المسودة",\s*"تم التصميم الإلكتروني",\s*"تم إصدار النسخة الأولية",\s*"جاري التصويب",\s*"تم التصويب",\s*"جاهز للتسليم النهائي"\]/g,
  `!["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "تم تسليم النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي", "تم التسليم"]`
);

// Replace "سجل تراث عائلتكم قيد التصويب" with the new text
content = content.replace(
  /<h4 className="font-bold text-lg mb-2">سجل تراث عائلتكم قيد التصويب<\/h4>\s*<p>نعمل حاليًا على مراجعة طلب التصويب لسجلكم ، ستتغير حالة السجل آلياً عند صدور النسخة النهائية من سجل تراث عائلتكم .<\/p>/g,
  `<h4 className="font-bold text-lg mb-2">سجل عائلتكم في مرحلة جاري التصويب!</h4>\n                                      <p>نعمل حاليًا على مراجعة طلبات التصويب الخاصة بسجلكم، ستتغير حالة السجل آلياً عند صدور النسخة النهائية. نشكر لكم حسن انتظاركم.</p>`
);

content = content.replace(
  /سجل عائلتكم في مرحلة الطباعة النهائية!/g,
  `سجل عائلتكم في مرحلة الطباعة النهائية!` // Keep it the same for others, wait!
);

fs.writeFileSync(filePath, content);
console.log("Dashboard.tsx updated successfully.");
