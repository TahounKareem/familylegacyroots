const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');
let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

/**
 * UTILS
 */
function replace(content, searchValue, replaceValue) {
  const newContent = content.replace(searchValue, replaceValue);
  if (newContent === content) {
    console.warn('Could not find:', searchValue);
  }
  return newContent;
}

function replaceAll(content, searchValue, replaceValue) {
  let newContent = content;
  if (typeof searchValue === 'string') {
    newContent = content.split(searchValue).join(replaceValue);
  } else {
    newContent = content.replace(searchValue, replaceValue);
  }
  if (newContent === content) {
    console.warn('Could not find (all):', searchValue);
  }
  return newContent;
}


/**
 * 1. FIX CRASH ON LOGOUT (AdminPanel & Dashboard)
 */
// Actually, `currentUser` crash is often because of null checking in effects or render.
// In AdminPanel, if !currentUser return <Navigate ... /> is near the top. But let's check `replyText` area if `currentUser` is assumed.
// I'll make sure `currentUser` works fine by using `currentUser?.` wherever it crashes, or wrap properly.
admin = replaceAll(admin, 'currentUser.', 'currentUser?.');
// Except we need to be careful about assignations. It's mostly reading properties.
// Let's revert that and just use specific fixes.
admin = replaceAll(admin, 'currentUser?.', 'currentUser?.'); // dummy
// Actually, the issue reported is "عذراً، حدث خطأ غير متوقع... تظهر عند إستلام إشعارات جديدة وفي حالة عمل ريفريش..."
// This means when an order snapshot updates, it throws an error in the UI. 
// A common issue is formatting a date when `order.createdAt` etc is undefined, OR `undefined.someProperty` in the order mapping.

/**
 * 2. HIDE CORRECTION FORM IN DASHBOARD IF INITIAL DELIVERED etc.
 */
// Define isPostInitialDelivery
const isPostInitialDelivStr = "const isPostInitialDelivery = [\"تم تسليم الإصدار الأول\", \"مكتمل\", \"طلب مكتمل\", \"تأكيد اعتماد النسخة\", \"جاهز للطباعة\", \"جاهز للتسليم للعميل\"].includes(order?.status) || [\"تم إصدار النسخة الأولية\", \"جاري التصويب\", \"تم التصويب\", \"جاهز للتسليم للعميل\", \"تم التسليم\"].includes(order?.actionPhase);";

dashboard = replace(dashboard, 'const status = order?.status;', `${isPostInitialDelivStr}\n  const status = order?.status;`);

// Hide save buttons in Dashboard
// We replace: `{status !== "closed" ? (` with `{status !== "closed" && !isPostInitialDelivery ? (`
dashboard = replaceAll(dashboard, '{status !== "closed" ? (', '{status !== "closed" && !isPostInitialDelivery ? (');
dashboard = replaceAll(dashboard, '{status !== "closed" && (', '{status !== "closed" && !isPostInitialDelivery && ('); // if any

// Fix action phase "تم إصدار النسخة الأولية" not rendering the form.
// In Dashboard, near line 2358:
const oldCondition = `) : order?.status !== "مكتمل" &&
                        order?.status !== "طلب مكتمل" &&
                        order?.status !== "تم تسليم الإصدار الأول" &&
                        order?.status !== "تم الإصدار" &&
                        order?.issueStatus !== "تم الإصدار" &&
                        order?.actionPhase !== "جاري التصويب" &&
                        order?.issueStatus !== "جاري التصويب" ? (`;

const newCondition = `) : !["مكتمل", "طلب مكتمل", "تم الإصدار", "تم تسليم الإصدار الأول"].includes(order?.status || "") &&
                        !["جاري التصويب", "تم التصويب"].includes(order?.actionPhase || "") &&
                        !["جاري التصويب", "تم التصويب", "تم الإصدار"].includes(order?.issueStatus || "") &&
                        order?.actionPhase !== "تم إصدار النسخة الأولية" ? (`;

dashboard = replace(dashboard, oldCondition, newCondition);

// Also The message in the correction tab:
const oldCorrectionMsg = `<CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                               <h3 className="text-xl font-bold text-brand-900 mb-2">
                                 تم إصدار النسخة النهائية من سجل تراث عائلتكم
                               </h3>
                               <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                                 ويمكنكم استعراض وتحميل هذه النسخة من نافذة "النسخة الرقمية" كما تم ارسال النسخ الورقية وبوستر مخطط عمود النسب الى عنوانكم البريدي.
                               </p>`;
// Wait, this message ONLY shows if it IS final. But the logic above routes it here if it's "تم إصدار النسخة الأولية".
// Let's just fix the render logic inside the else block:

// Wait, I will just rewrite the entire correction tab section inside Dashboard.tsx!

fs.writeFileSync('src/pages/AdminPanel_TEMP.tsx', admin);
fs.writeFileSync('src/pages/Dashboard_TEMP.tsx', dashboard);

console.log("Done");
