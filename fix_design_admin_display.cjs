const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const targetBlock = `<div className="flex flex-col gap-2">
                              {!isDelivered && order.initialDesignLink && (order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم الإصدار" || order.actionPhase === "تم تسليم الإصدار الأول") && (
                                <a href={order.initialDesignLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs">
                                  <Download className="w-4 h-4" /> مسودة السجل
                                </a>
                              )}
                              {!isDelivered && (order.actionPhase === "تمت المسودة" || order.actionPhase === "جاري التصويب" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي") && (
                                <>
                                  <a href={order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي" || order.actionPhase === "جاري التصويب" ? (order.postCorrectionLink || order.researchDraftLink) : order.researchDraftLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs">
                                    <Download className="w-4 h-4" /> {order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي" || order.actionPhase === "جاري التصويب" ? "تحميل ملف البحث بعد التصويب" : "تحميل ملف البحث"}
                                  </a>
                                  {order.data.designTemplate && (
                                    <button
                                      onClick={() => setShowDesignModal(order.data.designTemplate)}
                                      className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs w-full"
                                    >
                                      <Palette className="w-4 h-4" /> عرض قالب التصميم
                                    </button>
                                  )}
                                </>
                              )}`;

const replacementBlock = `<div className="flex flex-col gap-2">
                              {!isDelivered && order.initialDesignLink && (order.actionPhase === "تم التصويب" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم الإصدار" || order.actionPhase === "تم تسليم الإصدار الأول") && (
                                <a href={order.initialDesignLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs">
                                  <Download className="w-4 h-4" /> مسودة السجل
                                </a>
                              )}
                              {!isDelivered && (
                                <>
                                  {(order.actionPhase === "تمت المسودة" || order.actionPhase === "جاري التصويب" || order.actionPhase === "تم التصويب") && (
                                    <a href={order.actionPhase === "تم التصويب" || order.actionPhase === "جاري التصويب" ? (order.postCorrectionLink || order.researchDraftLink) : order.researchDraftLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs">
                                      <Download className="w-4 h-4" /> {order.actionPhase === "تم التصويب" || order.actionPhase === "جاري التصويب" ? "تحميل ملف البحث بعد التصويب" : "تحميل ملف البحث"}
                                    </a>
                                  )}
                                  {(order.actionPhase === "تمت المسودة" || order.actionPhase === "جاري التصويب" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي") && (
                                    <>
                                      {order.data.designTemplate && (
                                        <button
                                          onClick={() => setShowDesignModal(order.data.designTemplate)}
                                          className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs w-full"
                                        >
                                          <Palette className="w-4 h-4" /> عرض قالب التصميم
                                        </button>
                                      )}
                                    </>
                                  )}
                                </>
                              )}`;

admin = admin.replace(targetBlock, replacementBlock);

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
console.log("Fixed AdminPanel design dashboard buttons");
