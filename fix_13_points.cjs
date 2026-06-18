const fs = require('fs');

async function main() {
  let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
  let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

  // Point 2: When actionPhase is "تم إصدار النسخة الأولية", don't show the "النسخة النهائية" message.
  // We need to fix the condition for showing the correction form.
  // The user says: "بعد إصدار النسخة الأولية للسجل وتسليمه للعميل يجب الا يظهر "نموذج طلب تصويب" وبدلا منه طلبات التصويب السابقة إن وجدت وفي حالة الإعتماد المباشر فتظهر فقط الرسالة"
  // Let's rewrite the "التصويبات" tab logic to be cleaner.
  
  // Point 3: "القسم" is text input, not select.
  dashboard = dashboard.replace(/<select\s+value=\{c\.section\}[\s\S]*?<\/select>/, `<input type="text" value={c.section} onChange={(e) => { const newC = [...corrections]; newC[i].section = e.target.value; setCorrections(newC); }} className="w-full border border-brand-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-brand-500 outline-none" placeholder="اكتب اسم القسم هنا..." />`);
  
  // Point 5: "دولة الإقامة الحالية" and "المدينة" before "رقم الجوال *"
  // And auto clear phone number on country change and write country code.
  // (We'll do this carefully)
  
  // Point 6: "إتمام الدفع" button color
  dashboard = dashboard.replace(/bg-green-600(.*?)hover:bg-green-700(.*?)"إتمام الدفع"/g, 'bg-brand-600$1hover:bg-brand-700$2"إتمام الدفع"');
  dashboard = dashboard.replace(/<Check className="w-5 h-5" \/> إتمام الدفع/g, 'إتمام الدفع');
  
  // Point 7: Change the message
  dashboard = dashboard.replace(/نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم\. مازال يمكنكم إضافة المحتوى الإثرائي الذي ترونه مناسبًا لإدراجه ضمن السجل، نقترح عليكم المبادرة باضافة الإثراء الذي ترغبون به قبل صدور النسخة الأولية \./g, 'نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم');

  // Point 8:
  dashboard = dashboard.replace(/نسبة إنجاز ملف العائلة/g, 'نسبة المساهمة في الإثراء');
  dashboard = dashboard.replace(/لقد أتممت ملف العائلة بنجاح!/g, 'لقد أتممت مساهمتك في الإثراء بنجاح!');
  
  // And move the progress box before "إثراء السجل العائلي"
  
  // Point 11: File Profile: Show email once. Show order number next to profile pic.
  
  fs.writeFileSync('src/pages/Dashboard.tsx', dashboard);
  fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
}
main();
