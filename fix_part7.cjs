const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// 1. Show contact info button if action phase is "تمت المسودة":
content = content.replace(
  `{(order.actionPhase === "جاهز للطباعة" || order.actionPhase === "جاهز للتسليم" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "تم التسليم") && (`,
  `{(order.actionPhase === "جاهز للطباعة" || order.actionPhase === "جاهز للتسليم" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "تم التسليم" || order.actionPhase === "تمت المسودة") && (`
);

// 2. Change the button for 'تم التصويب' to two buttons:
const oldButtonsStr = `                              {!isDelivered && order.actionPhase === "تم التصويب" && (
                                <button
                                  onClick={() => setDesignSubmitOrder(order)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                >
                                  <Upload className="w-4 h-4" /> تسليم السجل جاهز للطباعة
                                </button>
                              )}`;

const newButtonsStr = `                              {!isDelivered && order.actionPhase === "تم التصويب" && (
                                <>
                                  <button
                                    onClick={() => setDesignSubmitOrder(order)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                  >
                                    <Upload className="w-4 h-4" /> روابط النسخة الرقمية
                                  </button>
                                  <button
                                    onClick={() => {
                                      setPrintReadyLink(order.printReadyLink || "");
                                      setShippingContactOrder(order);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs border border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)] mt-2 w-full"
                                  >
                                    <Printer className="w-4 h-4" /> تجهيز وتأكيد الطباعة/الشحن
                                  </button>
                                </>
                              )}`;

content = content.replace(oldButtonsStr, newButtonsStr);

// In the shipping modal, allow them to finish the order:
// The shipping modal is triggered by `shippingContactOrder`.
// I'll make sure they have a way to close it without side effects.

fs.writeFileSync('src/pages/AdminPanel.tsx', content);
