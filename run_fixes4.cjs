const fs = require('fs');
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

if (!dash.includes('const [confirmState')) {
  dash = dash.replace(
    'const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});',
    'const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});\n  const [confirmState, setConfirmState] = useState<{isOpen: boolean, action: (() => void) | null}>({isOpen: false, action: null});'
  );

  const confirmModalHtml = `
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
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
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md"
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
  dash = dash.replace('    </div>\n  );\n}\n', confirmModalHtml);
}

// 1st Block:
const b1_old = `if (confirm("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.")) {
    
                                  updateSpecificData({
                                    [key]: (order.data as any)[key],
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "closed" }
                                  });
                                  setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                                }`;

const b1_new = `setConfirmState({
                                  isOpen: true,
                                  action: () => {
                                    updateSpecificData({
                                      [key]: (order.data as any)[key],
                                      sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "closed" }
                                    });
                                    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                                  }
                                });`;

dash = dash.replace(b1_old, b1_new);


// 2nd Block
const b2_old = `if (confirm("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.")) {
    
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), familyTree: "closed" }
                                });
                                setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                              }`;

const b2_new = `setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), familyTree: "closed" }
                                  });
                                  setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                                }
                              });`;

dash = dash.replace(b2_old, b2_new);

// 3rd Block
const b3_old = `if (confirm("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.")) {
    
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "closed" }
                                });
                                setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                              }`;

const b3_new = `setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "closed" }
                                  });
                                  setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                                }
                              });`;

dash = dash.replace(b3_old, b3_new);

// 4th Block
const b4_old = `if (confirm("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.")) {
    
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), timeline: "closed" }
                                });
                                setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                              }`;

const b4_new = `setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), timeline: "closed" }
                                  });
                                  setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                                }
                              });`;

dash = dash.replace(b4_old, b4_new);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
