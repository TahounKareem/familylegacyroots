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
const btnLookFor = `{order.actionPhase === "تم التصويب" || order.actionPhase === "جاري التصويب" ? "تحميل ملف البحث بعد التصويب" : "تحميل ملف البحث"}`;
// Wait, currently it's just <Download className="w-4 h-4" /> تحميل ملف البحث
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
// Replace the shipped-checkbox with the 3 inputs for shipping
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
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 space-y-4">
                  <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">بيانات شحن النسخة المطبوعة</h4>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm">تاريخ الشحن</label>
                    <input type="date" value={shippingDate} onChange={(e) => setShippingDate(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm">إسم الناقل</label>
                    <input type="text" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500" placeholder="مثال: أرامكس, DHL..." />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm">رقم الشحنة للتتبع</label>
                    <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500" placeholder="أدخل رقم التتبع" />
                  </div>
                </div>
              )}`;

if (content.includes(oldCheckbox)) {
    content = content.replace(oldCheckbox, newShippingFields);
}

// And update the Validation of the Submit button
// old: disabled={isFulfilling || !designRecordLink.trim() || (designSubmitOrder.printRequested && !designCopiesShipped)}
const oldSubmitVal = `disabled={isFulfilling || !designRecordLink.trim() || (designSubmitOrder.printRequested && !designCopiesShipped)}`;
const newSubmitVal = `disabled={isFulfilling || !designRecordLink.trim() || (designSubmitOrder.printRequested && (!shippingDate || !carrierName || !trackingNumber))}`;
if (content.includes(oldSubmitVal)) {
    content = content.replace(oldSubmitVal, newSubmitVal);
}

fs.writeFileSync('src/pages/AdminPanel.tsx', content);

// For Client Dashboard:
let clientHome = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');
const oldPrintMessage = `order.actionPhase === "جاري التصويب" ||`;
// wait let's find the exact text "سجل عائلتكم في مرحلة الطباعة النهائية" in ClientDashboard (or wherever it exists)

fs.writeFileSync('src/pages/AdminPanel.tsx', content);
