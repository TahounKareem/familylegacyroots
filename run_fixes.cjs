const fs = require('fs');

function replaceAll(content, searchValue, replaceValue) {
  return content.split(searchValue).join(replaceValue);
}

// ============================================
// 1 & 7. ADMIN PANEL FIXES
// ============================================
let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

if (!admin.includes(' Printer,')) {
    admin = admin.replace('import {', 'import {\n  Printer,');
}

// B) Beautiful Toast/Modal for "تم تعيين الباحث وتم تحديث حالة الطلب بنجاح"
admin = admin.replace(
    /alert\("تم تعيين الباحث وتم تحديث حالة الطلب بنجاح"\);/g,
    `setSuccessModal({isOpen: true, title: "تم التعيين بنجاح!", subtitle: "لقد تم تعيين الباحث وتحديث حالة الطلب للمرحلة التالية بنجاح."});`
);
if (!admin.includes('const [successModal, setSuccessModal]')) {
    admin = admin.replace(
        'const [expandedRows, setExpandedRows] = useState<string[]>([]);',
        'const [expandedRows, setExpandedRows] = useState<string[]>([]);\n  const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});'
    );
    const adminModalHTML = `
      {successModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-brand-900 mb-3">{successModal.title}</h3>
            <p className="text-brand-600 font-light mb-8 leading-relaxed">
              {successModal.subtitle}
            </p>
            <button
              onClick={() => setSuccessModal({isOpen: false, title: "", subtitle: ""})}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all duration-300"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
    admin = admin.replace('    </div>\n  );\n}\n', adminModalHTML);
}

const oldNeedsAction = `const needsAction = order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصويب";`;
const newNeedsAction = `const needsAction = order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب";`;
admin = replaceAll(admin, oldNeedsAction, newNeedsAction);

const oldLinksBlock = `{!isDelivered && order.initialDesignLink && order.actionPhase !== "تم التصويب" && order.actionPhase !== "جاهز للطباعة" && order.actionPhase !== "تم تجهيز السجل للطباعة" && order.actionPhase !== "جاهز للتسليم" && (`;
const newLinksBlock = `{!isDelivered && order.initialDesignLink && (order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم الإصدار" || order.actionPhase === "تم تسليم الإصدار الأول") && (`;
admin = replaceAll(admin, oldLinksBlock, newLinksBlock);

const oldResearchDraftBlock = `{!isDelivered && order.researchDraftLink && order.actionPhase === "تمت المسودة" && (`;
const newResearchDraftBlock = `{!isDelivered && order.researchDraftLink && (order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للطباعة") && (`;
admin = replaceAll(admin, oldResearchDraftBlock, newResearchDraftBlock);

const oldContactBlock = `{(order.actionPhase === "جاهز للطباعة" || order.actionPhase === "جاهز للتسليم" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "تم التسليم" || order.actionPhase === "تمت المسودة") && (`;
const newContactBlock = `{(order.actionPhase === "جاهز للطباعة" || order.actionPhase === "جاهز للتسليم" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "تم التسليم" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب") && (`;
admin = replaceAll(admin, oldContactBlock, newContactBlock);

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);

// ============================================
// 2. DISABLE BROWSER AUTOCOMPLETE & CLEAR DATA
// ============================================
let orderFlow = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

const inputs = orderFlow.match(/<input[^>]*>/g) || [];
for (const inp of inputs) {
    if (!inp.includes('autoComplete')) {
        const newInp = inp.replace('<input ', '<input autoComplete="new-password" ');
        orderFlow = orderFlow.replace(inp, newInp);
    }
}
const forms = orderFlow.match(/<form[^>]*>/g) || [];
for (const frm of forms) {
    if (!frm.includes('autoComplete')) {
        const newFrm = frm.replace('<form ', '<form autoComplete="off" ');
        orderFlow = orderFlow.replace(frm, newFrm);
    }
}

let authTsx = fs.readFileSync('src/pages/Auth.tsx', 'utf8');
if (!authTsx.includes('localStorage.removeItem("pendingOrderData")')) {
    authTsx = authTsx.replace('setError(null);\\n\\n    // Rate Limiting', 'setError(null);\\n    localStorage.removeItem("pendingOrderData");\\n    useAppStore.getState().setPendingOrderData(null);\\n\\n    // Rate Limiting');
    authTsx = authTsx.replace(/setIsLogin\\(\\!isLogin\\)/g, 'setIsLogin(!isLogin); localStorage.removeItem("pendingOrderData"); useAppStore.getState().setPendingOrderData(null);');
}
fs.writeFileSync('src/pages/Auth.tsx', authTsx);

// ============================================
// 3. PAYMENT BUTTON COLORS
// ============================================
const oldPaymentBtn = `className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg"
                  >
                    {isProcessing ? "جاري المعالجة..." : (
                      <>
                        <CheckCircle className="w-6 h-6" /> إتمام الدفع
                      </>
                    )}`;
const newPaymentBtn = `className="w-full flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-xl font-bold transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg"
                  >
                    {isProcessing ? "جاري المعالجة..." : "إتمام الدفع"}`;
orderFlow = replaceAll(orderFlow, oldPaymentBtn, newPaymentBtn);
fs.writeFileSync('src/pages/OrderFlow.tsx', orderFlow);

// ============================================
// 4. DASHBOARD MESSAGES 
// ============================================
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dash = replaceAll(dash, "نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم. مازال يمكنكم إضافة المحتوى الإثرائي الذي ترونه مناسبًا لإدراجه ضمن السجل، نقترح عليكم المبادرة باضافة الإثراء الذي ترغبون به قبل صدور النسخة الأولية .", "نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم");
dash = replaceAll(dash, "نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم. مازال يمكنكم إضافة المحتوى الإثرائي الذي ترونه مناسبًا لإدراجه ضمن السجل، نقترح عليكم المبادرة باضافة الإثراء الذي ترغبون به قبل صدور النسخة الأولية.", "نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم");

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
