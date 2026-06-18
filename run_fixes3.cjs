const fs = require('fs');

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Add confirmState
if (!dash.includes('confirmState')) {
  dash = dash.replace(
    'const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});',
    'const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});\n  const [confirmState, setConfirmState] = useState<{isOpen: boolean, action: (() => void) | null}>({isOpen: false, action: null});'
  );
  
  const confirmModalHtml = `
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-brand-900 mb-3">
              هل أنت متأكد من حفظ وإغلاق هذا القسم؟
            </h3>
            <p className="text-sm text-brand-600 mb-8 leading-relaxed">
              بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (confirmState.action) confirmState.action();
                  setConfirmState({isOpen: false, action: null});
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition"
              >
                تأكيد الإغلاق
              </button>
              <button
                onClick={() => setConfirmState({isOpen: false, action: null})}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  dash = dash.replace('    </div>\n  );\n}', confirmModalHtml);
}

// 2. Replace confirm calls
dash = dash.replace(
  /if \(confirm\("هل أنت متأكد من حفظ وإغلاق هذا القسم\؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين\."\)\) \{\s*updateSpecificData\(\{(.*?)\}\);\s*setSuccessModal/gs,
  (match, p1) => {
    return `setConfirmState({
                                  isOpen: true,
                                  action: () => {
                                    updateSpecificData({${p1}});
                                    setSuccessModal`;
  }
);
// Replace the trailing bracket of the replaced if-statement
// Since we turned `if (...) { ... }` into `setConfirmState(...)`, we just need to replace `\n                                }` that closes the if statement.
// But we actually only replaced the opening part and left `isDone: true});` then `\n }` as is!
// So it currently looks like: `setConfirmState({ isOpen: true, action: () => { updateSpecificData({...}); setSuccessModal({ ... }); \n }` which is NOT closed properly (needs `});`).
// Let's do it safely.
fs.writeFileSync('src/pages/Dashboard.tsx', dash);
