const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// 1. Add "جاري التصويب" to the designOrders in AdminPanel.tsx
const filterLookFor = `              (o.actionPhase === "تمت المسودة" ||`;
const filterReplace = `              (o.actionPhase === "تمت المسودة" ||
                o.actionPhase === "جاري التصويب" ||`;

if (content.includes(filterLookFor) && !content.includes(filterReplace)) {
    content = content.replace(filterLookFor, filterReplace);
}

// 2. Change buttons for "تحميل ملف البحث" based on actionPhase
const oldBtn = `<Download className="w-4 h-4" /> تحميل ملف البحث`;
const newBtn = `<Download className="w-4 h-4" /> {order.actionPhase === "تم التصويب" || order.actionPhase === "جاري التصويب" ? "تحميل ملف البحث بعد التصويب" : "تحميل ملف البحث"}`;
if (content.includes(oldBtn)) {
    content = content.replace(oldBtn, newBtn);
}
// Also update the condition for this button to include "جاري التصويب":
const condOld = `(order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي")`;
const condNew = `(order.actionPhase === "تمت المسودة" || order.actionPhase === "جاري التصويب" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي")`;
if (content.includes(condOld)) {
    content = content.replace(condOld, condNew);
}

// 3. Change "روابط النسخة الرقمية" to "تسليم السجل النهائي لإدارة الطلبات"
const dtBtnOld = `<Upload className="w-4 h-4" /> روابط النسخة الرقمية`;
const dtBtnNew = `<Upload className="w-4 h-4" /> تسليم السجل النهائي لإدارة الطلبات`;
if (content.includes(dtBtnOld)) {
    content = content.replace(dtBtnOld, dtBtnNew);
}

// 4. Update the fields in DesignSubmitModal
const oldCheckbox = `{designSubmitOrder.printRequested && (
                <div className="flex items-center gap-2 mt-2 bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="shipped-checkbox"
                    checked={designCopiesShipped}
                    onChange={(e) => setDesignCopiesShipped(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded border-brand-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="shipped-checkbox" className="font-semibold text-brand-900">
                    أؤكد أنه تم شحن النسخ الورقية المطبوعة للعميل
                  </label>
                </div>
              )}`;

const newShippingFields = `{designSubmitOrder.printRequested && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 space-y-4 text-right">
                  <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">بيانات شحنة النسخة المطبوعة</h4>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm bg-transparent">تاريخ الشحن</label>
                    <input type="date" value={shippingDate} onChange={(e) => setShippingDate(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm bg-transparent">إسم الناقل</label>
                    <input type="text" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none" placeholder="مثال: أرامكس, DHL..." />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm bg-transparent">رقم الشحنة للتتبع</label>
                    <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none" placeholder="أدخل رقم التتبع" />
                  </div>
                </div>
              )}`;

if (content.includes(oldCheckbox)) {
    content = content.replace(oldCheckbox, newShippingFields);
}

// And update the Validation of the Submit button
const oldSubmitVal = `disabled={isFulfilling || !designRecordLink.trim() || (designSubmitOrder.printRequested && !designCopiesShipped)}`;
const newSubmitVal = `disabled={isFulfilling || !designRecordLink.trim() || (designSubmitOrder.printRequested && (!shippingDate || !carrierName || !trackingNumber))}`;
if (content.includes(oldSubmitVal)) {
    content = content.replace(oldSubmitVal, newSubmitVal);
}

fs.writeFileSync('src/pages/AdminPanel.tsx', content);

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
const targetStr = `                      ) : order?.status === "تأكيد اعتماد النسخة" ? (`;

const replaceStr = `                      ) : order?.actionPhase === "جاري التصويب" || order?.issueStatus === "جاري التصويب" ? (
                        <div className="text-center py-10 px-4">
                           <div className="w-20 h-20 bg-amber-100 text-amber-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-amber-50 shadow-inner mx-auto">
                              <CheckCircle className="w-10 h-10" />
                           </div>
                           <h3 className="text-2xl font-bold text-brand-900 mb-2">
                             سجل تراث عائلتكم قيد التصويب
                           </h3>
                           <p className="text-brand-600 font-medium max-w-lg mx-auto leading-relaxed mb-8">
                             نعمل حاليًا على مراجعة طلب التصويب لسجلكم، ستتغير حالة السجل آلياً عند صدور النسخة النهائية.
                           </p>

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order?.messages?.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                   <div key={msg.id} className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                                     <div className="flex justify-between items-start mb-2">
                                       <span className="text-sm font-bold text-brand-700 bg-white px-3 py-1 rounded-md border border-brand-200">
                                         تم الإرسال
                                       </span>
                                       <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                         {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                       </span>
                                     </div>
                                     <p className="text-brand-800 whitespace-pre-line text-sm mt-3 text-right">
                                       {msg.text}
                                     </p>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      ) : order?.status === "تأكيد اعتماد النسخة" ? (` ;

if (dash.includes(targetStr)) {
  dash = dash.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Dashboard.tsx', dash);
  console.log("Updated Dashboard.tsx");
} else {
  console.error("Could not find target string in Dashboard.tsx");
}

console.log("AdminPanel and Dashboard fixes applied");
