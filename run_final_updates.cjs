const fs = require('fs');

function replaceAll(str, a, b) {
  return str.split(a).join(b);
}

// ============================================
// 1. DASHBOARD FIXES
// ============================================
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// A) Append shipping info block in the "تم الإغلاق" message. 
const oldShipBlock = `تتضمن الشحنة:
                                  </span>{" "}
                                  10 نسخ مطبوعة فاخرة، وبوستر مشجرة العائلة.
                                </p>
                              </div>`;

const newShipBlock = `تتضمن الشحنة:
                                  </span>{" "}
                                  10 نسخ مطبوعة فاخرة، وبوستر مشجرة العائلة.
                                </p>
                                {order.shippingDetails?.trackingNumber && (
                                  <div className="mt-4 pt-4 border-t border-green-200 w-full">
                                    <div className="flex flex-col gap-2">
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">تاريخ الشحن:</span>
                                        <span className="text-green-900">{order.shippingDetails?.shippingDate || "غير محدد"}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">شركة الشحن:</span>
                                        <span className="text-green-900">{order.shippingDetails?.carrierName || "غير محدد"}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">رقم التتبع:</span>
                                        <span className="text-green-900 font-mono tracking-wider bg-white px-2 py-1 rounded border border-green-100">{order.shippingDetails?.trackingNumber || "غير محدد"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>`;

dash = replaceAll(dash, oldShipBlock, newShipBlock);

// B) Hide specific header in "التصويبات"
const oldMsgCond = `{order?.issueStatus === "تم الإغلاق" || order?.actionPhase === "تم التسليم" ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             سجل عائلتكم في مرحلة الطباعة النهائية!
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed mb-8">
                             يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                           </p>

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (`;

const newMsgCond = `{order?.issueStatus === "تم الإغلاق" || order?.actionPhase === "تم التسليم" || order?.actionPhase === "جاهز للتسليم النهائي" || order?.actionPhase === "تم إصدار النسخة النهائية" ? (
                        <div className="text-center py-10 px-4">
                           {!["تم التسليم", "تم إصدار النسخة النهائية"].includes(order?.actionPhase || "") && (
                             <>
                               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                               <h3 className="text-xl font-bold text-brand-900 mb-2">
                                 سجل عائلتكم في مرحلة الطباعة النهائية!
                               </h3>
                               <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed mb-8">
                                 يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                               </p>
                             </>
                           )}

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (`;

dash = replaceAll(dash, oldMsgCond, newMsgCond);

// C) Rename "جاهز للطباعة" text
dash = replaceAll(dash, '"جاهز للطباعة"', '"جاهز للتسليم النهائي"');
dash = replaceAll(dash, '>جاهز للطباعة<', '>جاهز للتسليم النهائي<');
dash = replaceAll(dash, ' جاهز للطباعة', ' جاهز للتسليم النهائي');

fs.writeFileSync('src/pages/Dashboard.tsx', dash);


// ============================================
// 2. ADMIN PANEL FIXES
// ============================================
let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const oldStateBlock = `const [designCopiesShipped, setDesignCopiesShipped] = useState(false);`;
const newStateBlock = `const [designCopiesShipped, setDesignCopiesShipped] = useState(false);
  const [shippingDate, setShippingDate] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");`;
if (!admin.includes('const [shippingDate')) {
  admin = replaceAll(admin, oldStateBlock, newStateBlock);
}

// Remove Print Button
const oldPrinterBtn = `<button
                                    onClick={() => {
                                      setPrintReadyLink(order.printReadyLink || "");
                                      setShippingContactOrder(order);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs border border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)] mt-2 w-full"
                                  >
                                    <Printer className="w-4 h-4" /> تجهيز وتأكيد الطباعة/الشحن
                                  </button>`;
admin = replaceAll(admin, oldPrinterBtn, "");


// Handle Delivery Form Fulfill
const oldDelivFulfill = `      await fulfillOrder(deliveryOrder.id, {
        deliveryLink,
        digitalCopyLink,
        digitalCopyDownloadLink,
        posterLink,
        researchRecommendations,
        ...phaseUpdates,
      });`;
const newDelivFulfill = `      await fulfillOrder(deliveryOrder.id, {
        deliveryLink,
        digitalCopyLink,
        digitalCopyDownloadLink,
        posterLink,
        researchRecommendations,
        ...(deliveryTab === "final" ? { shippingDetails: { shippingDate, carrierName, trackingNumber } } : {}),
        ...phaseUpdates,
      });`;
admin = replaceAll(admin, oldDelivFulfill, newDelivFulfill);

const oldDelivClear = `setDeliveryLink("");`;
const newDelivClear = `setDeliveryLink("");
      setShippingDate("");
      setCarrierName("");
      setTrackingNumber("");`;
admin = replaceAll(admin, oldDelivClear, newDelivClear);

const oldDeliveryModalUI = `onChange={(e) => setResearchRecommendations(e.target.value)}
                      placeholder="أكتب التوصيات..."
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                    />
                  </div>
                </>
              )}`;
const newDeliveryModalUI = `onChange={(e) => setResearchRecommendations(e.target.value)}
                      placeholder="أكتب التوصيات..."
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                    />
                  </div>

                  {deliveryTab === "final" && (
                    <div className="flex flex-col gap-4 mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <div className="font-bold text-lg text-brand-900 border-b border-brand-200 pb-2">بيانات الشحنة (تظهر للعميل بعد التسليم)</div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-brand-900 mb-2">تاريخ الشحن</label>
                        <input
                          type="date"
                          value={shippingDate}
                          onChange={(e) => setShippingDate(e.target.value)}
                          className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-900 mb-2">إسم الناقل</label>
                        <input
                          type="text"
                          value={carrierName}
                          onChange={(e) => setCarrierName(e.target.value)}
                          placeholder="أدخل اسم شركة الشحن..."
                          className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-900 mb-2">رقم الشحنة للتتبع</label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="أدخل رقم التتبع..."
                          className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                      </div>
                    </div>
                  )}

                </>
              )}`;
admin = replaceAll(admin, oldDeliveryModalUI, newDeliveryModalUI);


// Handle Design Fulfill
const oldDesignSubmitPhase = `actionPhase: "جاهز للتسليم النهائي",
        designLinks: {`;
const newDesignSubmitPhase = `actionPhase: "جاهز للتسليم النهائي",
        shippingDetails: {
          shippingDate,
          carrierName,
          trackingNumber
        },
        designLinks: {`;
admin = replaceAll(admin, oldDesignSubmitPhase, newDesignSubmitPhase);

const oldDesignSubmitPhaseB = `actionPhase: "جاهز للطباعة",
        designLinks: {`;
admin = replaceAll(admin, oldDesignSubmitPhaseB, newDesignSubmitPhase);


const oldDesignSubmitClear = `setDesignCopiesShipped(false);`;
const newDesignSubmitClear = `setDesignCopiesShipped(false);
      setShippingDate("");
      setCarrierName("");
      setTrackingNumber("");`;
admin = replaceAll(admin, oldDesignSubmitClear, newDesignSubmitClear);

const oldDesignModalUI = `{designSubmitOrder.printRequested && (
                <div className="flex items-center gap-2 mt-2 bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="copiesShipped"
                    checked={designCopiesShipped}
                    onChange={(e) => setDesignCopiesShipped(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 focus:ring-offset-0 border-amber-300"
                  />
                  <label htmlFor="copiesShipped" className="font-semibold text-brand-900 cursor-pointer">
                    تأكيد إرسال الشحنة (النسخ المطبوعة + المشجرة)
                  </label>
                </div>
              )}`;

const newDesignModalUI = `{designSubmitOrder.printRequested && (
                <div className="flex flex-col gap-4 mt-2 bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="font-bold text-lg text-brand-900 border-b border-brand-200 pb-2">بيانات الشحنة</div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-brand-900 mb-2">تاريخ الشحن</label>
                    <input
                      type="date"
                      value={shippingDate}
                      onChange={(e) => setShippingDate(e.target.value)}
                      className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-900 mb-2">إسم الناقل</label>
                    <input
                      type="text"
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value)}
                      placeholder="أدخل اسم شركة الشحن..."
                      className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-900 mb-2">رقم الشحنة للتتبع</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="أدخل رقم التتبع..."
                      className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-amber-200/60">
                    <input
                      type="checkbox"
                      id="copiesShipped"
                      checked={designCopiesShipped}
                      onChange={(e) => setDesignCopiesShipped(e.target.checked)}
                      className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 focus:ring-offset-0 border-amber-300"
                    />
                    <label htmlFor="copiesShipped" className="font-semibold text-brand-900 cursor-pointer">
                      تأكيد إرسال الشحنة (النسخ المطبوعة + المشجرة)
                    </label>
                  </div>
                </div>
              )}`;
admin = replaceAll(admin, oldDesignModalUI, newDesignModalUI);

// Rename "جاهز للطباعة" text in AdminPanel
admin = replaceAll(admin, '"جاهز للطباعة"', '"جاهز للتسليم النهائي"');
admin = replaceAll(admin, '>جاهز للطباعة<', '>جاهز للتسليم النهائي<');
admin = replaceAll(admin, ' جاهز للطباعة', ' جاهز للتسليم النهائي');


fs.writeFileSync('src/pages/AdminPanel.tsx', admin);

console.log("Done");
