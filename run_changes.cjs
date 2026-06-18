const fs = require('fs');

function replaceAll(str, a, b) {
  return str.split(a).join(b);
}

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Remove success modales from Dashboard
// For dynamic sections
const oldDynamicClose = `setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});`;
dash = replaceAll(dash, oldDynamicClose, "");

// 2. Change تأكيد الإغلاق to حفظ وإغلاق
dash = replaceAll(dash, ">تأكيد الإغلاق<", ">حفظ وإغلاق<");
dash = replaceAll(dash, `"تأكيد الإغلاق"`, `"حفظ وإغلاق"`);

// 3. Make logic for actionPhase === "تمت المسودة": hides buttons.
// Let's modify the condition for displaying buttons:
const oldButtonsCond = `&& !isPostInitialDelivery && (`;
const newButtonsCond = `&& !isPostInitialDelivery && order?.actionPhase !== "تمت المسودة" && (`;
// We might run into multiple occurrences, so we will replace all instances of `!isPostInitialDelivery && (` that are for buttons:
dash = replaceAll(dash, `!isPostInitialDelivery && (
                          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-brand-100">`, 
                           `!isPostInitialDelivery && order?.actionPhase !== "تمت المسودة" && (
                          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-brand-100">`);

dash = replaceAll(dash, `!isPostInitialDelivery && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-brand-100">`, 
                           `!isPostInitialDelivery && order?.actionPhase !== "تمت المسودة" && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-brand-100">`);
                           
// 4. Condition before closing section (require input).
// We need to find the onClick handler for the close button.
// For text sections: (key iterator)
let textCloseOld = `onClick={() => {
                                setConfirmState({
                                  isOpen: true,
                                  action: () => {
                                    updateSpecificData({
                                      [key]: (order.data as any)[key],
                                      sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "closed" }
                                    });
                                  }
                                });
                              }}`;
let textCloseNew = `onClick={() => {
                                const currentVal = (order.data as any)[key];
                                if (!currentVal || currentVal.trim() === "") {
                                  alert("يرجى إضافة المحتوى قبل الحفظ والإغلاق.");
                                  return;
                                }
                                setConfirmState({
                                  isOpen: true,
                                  action: () => {
                                    updateSpecificData({
                                      [key]: currentVal,
                                      sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "closed" }
                                    });
                                  }
                                });
                              }}`;
dash = replaceAll(dash, textCloseOld, textCloseNew);

// For Archive:
let archiveCloseOld = `onClick={() => {
                              setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "closed" }
                                  });
                                }
                              });
                            }}`;
let archiveCloseNew = `onClick={() => {
                              const files = order.data?.uploadedFiles || [];
                              if (files.length === 0) {
                                alert("يرجى رفع مرفقات قبل الاعتماد كمكتمل.");
                                return;
                              }
                              setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "closed" }
                                  });
                                }
                              });
                            }}`;
dash = replaceAll(dash, archiveCloseOld, archiveCloseNew);

// Make inputs disabled if actionPhase === "تمت المسودة"
const oldDisableLogic = `const isInputDisabled = (order.data?.sectionStatuses && order.data.sectionStatuses[key] === "closed") || isPostInitialDelivery;`;
const newDisableLogic = `const isInputDisabled = (order.data?.sectionStatuses && order.data.sectionStatuses[key] === "closed") || isPostInitialDelivery || order?.actionPhase === "تمت المسودة";`;
dash = replaceAll(dash, oldDisableLogic, newDisableLogic);

const oldTreeDisable = `disabled={(order.data?.sectionStatuses && order.data.sectionStatuses.familyTree === "closed") || isPostInitialDelivery}`;
const newTreeDisable = `disabled={(order.data?.sectionStatuses && order.data.sectionStatuses.familyTree === "closed") || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}`;
dash = replaceAll(dash, oldTreeDisable, newTreeDisable);


// 5. Success modal for AdminPanel assigning researcher.
let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// Replace standard alert.
const oldAlert = `alert("تم تعيين الباحث وتحديث حالة الطلب بنجاح!");`;
const newAlert = `setAssignSuccessModal({ show: true, message: "تم تعيين الباحث بنجاح" }); setTimeout(() => setAssignSuccessModal({ show: false, message: "" }), 3000);`;
admin = replaceAll(admin, oldAlert, newAlert);

// We need to declare `assignSuccessModal` state if not exists.
const stateDecl = `const [assignSuccessModal, setAssignSuccessModal] = useState({ show: false, message: "" });`;
if (!admin.includes("setAssignSuccessModal")) {
  admin = replaceAll(admin, `const [showNotifications, setShowNotifications] = useState(false);`, `const [showNotifications, setShowNotifications] = useState(false);\n  ${stateDecl}`);
}

// And add the UI snippet at the bottom inside `AdminPanel` layout wrapper:
const successUI = `
      {/* Assign Success Modal */}
      {assignSuccessModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm flex flex-col items-center justify-center shadow-2xl p-8 transform scale-100 animate-in zoom-in-95 font-sans">
            <div className="w-20 h-20 bg-green-100 text-green-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-green-50 shadow-inner">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 text-center mb-2">نجاح باهر!</h3>
            <p className="text-slate-600 text-center font-medium leading-relaxed">
              تم تعيين الباحث وتحديث حالة الطلب بنجاح.
            </p>
          </div>
        </div>
      )}
`;
// Put it before final closing div
admin = replaceAll(admin, `    </div>\n  );\n}\n`, `      ${successUI}\n    </div>\n  );\n}\n`);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
fs.writeFileSync('src/pages/AdminPanel.tsx', admin);

console.log("Done");
