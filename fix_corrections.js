const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const targetIndex = code.indexOf('{activeTab === "التصويبات" && (');
const endIndex = code.indexOf('{activeTab === "فتح الأبواب المغلقة" && (');

if(targetIndex !== -1 && endIndex !== -1) {
   let originalBlock = code.substring(targetIndex, endIndex);
   
   let oldCondition = `                      {order?.status !== "مكتمل" &&
                      order?.status !== "طلب مكتمل" &&
                      order?.status !== "تم تسليم الإصدار الأول" &&
                      order?.status !== "تم الإصدار" &&
                      order?.issueStatus !== "تم الإصدار" &&
                      order?.actionPhase !== "جاري التصويب" &&
                      order?.issueStatus !== "جاري التصويب" &&
                      order?.status !== "تم الإغلاق" ? (`;

  let newCondition = `                      {order?.issueStatus === "تم الإغلاق" || order?.actionPhase === "تم التسليم" ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             تم إصدار النسخة النهائية من سجل تراث عائلتكم
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed mb-8">
                             ويمكنكم استعراض وتحميل هذه النسخة من نافذة "النسخة الرقمية" كما تم ارسال النسخ الورقية وبوستر مخطط عمود النسب الى عنوانكم البريدي.
                           </p>
                           {order?.messages && order.messages.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).length > 0 && (
                             <div className="mt-8 text-right bg-white p-6 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h4 className="font-bold mb-6 text-xl flex items-center justify-center gap-2"><Clock className="w-6 h-6 text-brand-600" />طلبات التصويب السابقة</h4>
                               <div className="space-y-4">
                                {order.messages.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map(msg => (
                                  <div key={msg.id} className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                                     <div className="flex justify-between items-start mb-2">
                                       <span className="text-sm font-bold text-brand-700 bg-white px-3 py-1 rounded-md border border-brand-200">تم الإرسال</span>
                                       <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                         {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                       </span>
                                     </div>
                                     <p className="text-brand-800 whitespace-pre-line text-sm mt-3">{msg.text}</p>
                                  </div>
                                ))}
                               </div>
                             </div>
                           )}
                        </div>
                      ) : order?.actionPhase === "تم التصويب" || order?.actionPhase === "جاهز للطباعة" || order?.actionPhase === "تم تجهيز السجل للطباعة" || order?.status === "تأكيد اعتماد النسخة" ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             سجل عائلتكم في مرحلة الطباعة النهائية!
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                             يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                           </p>
                        </div>
                      ) : order?.status !== "مكتمل" &&
                      order?.status !== "طلب مكتمل" &&
                      order?.status !== "تم تسليم الإصدار الأول" &&
                      order?.status !== "تم الإصدار" &&
                      order?.issueStatus !== "تم الإصدار" &&
                      order?.actionPhase !== "جاري التصويب" &&
                      order?.issueStatus !== "جاري التصويب" &&
                      order?.status !== "تم الإغلاق" ? (`;

   let replaced = originalBlock.replace(oldCondition, newCondition);
   code = code.substring(0, targetIndex) + replaced + code.substring(endIndex);
   fs.writeFileSync('src/pages/Dashboard.tsx', code);
   console.log("Replaced successfully.");
} else {
   console.log("Indices not found", targetIndex, endIndex);
}
