const fs = require('fs');

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target1 = `} else if (status === "تأكيد اعتماد النسخة") {
        await handleApproveDraft(false);
      } else {`;
// Actually, let's just find the render logic.

const renderLogicTarget = `                      ) : order?.status === "تأكيد اعتماد النسخة" ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             سجل عائلتكم في مرحلة الطباعة النهائية!
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                             يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                           </p>
                        </div>
                      ) : !["مكتمل", "طلب مكتمل", "تم تسليم الإصدار الأول", "تم الإصدار", "جاهز للتسليم النهائي", "جاهز للتسليم للعميل"].includes(order?.status || "") &&
                        !["جاري التصويب", "تم التصويب", "تم إصدار النسخة الأولية"].includes(order?.actionPhase || "") &&
                        !["جاري التصويب", "تم التصويب"].includes(order?.issueStatus || "") ? (`

const fixedRenderLogic = `                      ) : (order?.status === "تأكيد اعتماد النسخة" && order?.actionPhase !== "جاري التصويب" && order?.actionPhase !== "تم التصويب" && order?.issueStatus !== "جاري التصويب" && order?.issueStatus !== "تم التصويب") ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             سجل عائلتكم في مرحلة الطباعة النهائية!
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                             يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                           </p>
                        </div>
                      ) : (order?.actionPhase === "جاري التصويب" || order?.issueStatus === "جاري التصويب") ? (
                         <div className="text-center py-10 px-4">
                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order?.messages?.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                   <div key={msg.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-200/50 pb-3">
                                       <span className="font-bold text-brand-900 text-sm">{msg.senderId}</span>
                                       <span className="text-xs text-brand-500 font-mono bg-white px-3 py-1 rounded-full border border-brand-100/50">
                                         {new Date(msg.timestamp).toLocaleString("ar-SA")}
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
                      ) : !["مكتمل", "طلب مكتمل", "تم تسليم الإصدار الأول", "تم الإصدار", "جاهز للتسليم النهائي", "جاهز للتسليم للعميل"].includes(order?.status || "") &&
                        !["جاري التصويب", "تم التصويب", "تم إصدار النسخة الأولية"].includes(order?.actionPhase || "") &&
                        !["جاري التصويب", "تم التصويب"].includes(order?.issueStatus || "") ? (`

dash = dash.replace(renderLogicTarget, fixedRenderLogic);
fs.writeFileSync('src/pages/Dashboard.tsx', dash);
console.log('Script ran.');
