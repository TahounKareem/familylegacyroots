const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const targetStr = `                      ) : order?.status === "تأكيد اعتماد النسخة" ? (`;

const replaceStr = `                      ) : order?.actionPhase === "جاري التصويب" || order?.issueStatus === "جاري التصويب" ? (
                        <div className="text-center py-10 px-4">
                           <div className="w-20 h-20 bg-amber-100 text-amber-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-amber-50 shadow-inner mx-auto">
                              <Edit3 className="w-10 h-10" />
                           </div>
                           <h3 className="text-2xl font-bold text-brand-900 mb-2">
                             سجل تراث عائلتكم قيد التصويب
                           </h3>
                           <p className="text-brand-600 font-medium max-w-lg mx-auto leading-relaxed mb-8">
                             نعمل حاليًا على مراجعة طلب التصويب لسجلكم، ستتغير حالة السجل آلياً عند صدور النسخة النهائية.
                           </p>

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order?.messages?.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                   <div key={msg.id} className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                                     <div className="flex justify-between items-start mb-2">
                                       <span className="text-sm font-bold text-brand-700 bg-white px-3 py-1 rounded-md border border-brand-200">
                                         تم الإرسال
                                       </span>
                                       <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                         {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
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
                      ) : order?.status === "تأكيد اعتماد النسخة" ? (` ;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Dashboard.tsx', content);
  console.log("Updated Dashboard.tsx");
} else {
  console.error("Could not find target string in Dashboard.tsx");
}
