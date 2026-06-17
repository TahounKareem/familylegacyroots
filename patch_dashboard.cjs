const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const targetStr = '{activeTab === "التصويبات" && (';
const endStr = '{activeTab === "فتح الأبواب المغلقة" && (';

const startIndex = code.indexOf(targetStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  let block = code.substring(startIndex, endIndex);

  // We rewrite the block entirely for 'التصويبات'
  const newBlock = `{activeTab === "التصويبات" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 overflow-hidden">
                      {order?.issueStatus === "تم الإغلاق" || order?.actionPhase === "تم التسليم" ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             سجل عائلتكم في مرحلة الطباعة النهائية!
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed mb-8">
                             يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                           </p>

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order.messages.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
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
                      ) : order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) ? (
                        <div className="px-6 md:px-12 py-8">
                           <div className="text-center mb-8">
                             <Sparkles className="w-16 h-16 text-brand-500 mb-4 mx-auto" />
                             <h3 className="text-2xl font-bold text-brand-900 mb-2 font-serif">
                               سجل تراث عائلتكم قيد التصويب
                             </h3>
                             <p className="text-brand-700 text-lg max-w-2xl mx-auto leading-relaxed">
                               نعمل حاليًا على مراجعة طلب التصويب لسجلكم ، ستتغير حالة السجل آلياً عند صدور النسخة النهائية من سجل تراث عائلتكم .
                             </p>
                           </div>

                           <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                             <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                               <Clock className="w-6 h-6 text-brand-600" />
                               طلبات التصويب السابقة
                             </h3>
                             <div className="space-y-4">
                               {order.messages.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
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
                        </div>
                      ) : order?.status === "تأكيد اعتماد النسخة" ? (
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
                        order?.issueStatus !== "جاري التصويب" ? (
                        <div className="text-center py-10 px-4">
                          <CheckCircle className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-brand-900 mb-2">
                            سيظهر لك هنا نموذج التصويبات
                          </h3>
                          <p className="text-brand-600 font-light max-w-sm mx-auto">
                            لتتمكن من التبليغ عن الأخطاء ليتم بناءاً عليها من
                            إصلاح وتحديث الاخطاء عند وجودها، وذلك بعد إصدار
                            السجل.
                          </p>
                        </div>
                      ) : (
                        <div className="px-6 md:px-12 py-8">
                          <div className="mb-4 bg-brand-50 p-6 rounded-2xl border border-brand-200">
                             <div className="text-center mb-8">
                               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                               <h3 className="text-xl font-bold text-brand-900 mb-2">
                                 تم إصدار النسخة النهائية من سجل تراث عائلتكم
                               </h3>
                               <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                                 ويمكنكم استعراض وتحميل هذه النسخة من نافذة "النسخة الرقمية" كما تم ارسال النسخ الورقية وبوستر مخطط عمود النسب الى عنوانكم البريدي.
                               </p>
                             </div>
                          </div>
                          <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-brand-600" />{" "}
                            نموذج طلب تصويب
                          </h3>
                          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 mb-8">
                            <p className="text-brand-800 font-medium mb-4">
                              نأمل منكم في حالة وجود أي ملاحظات أو أخطاء
                              مطبعية أو علمية تعبئة النموذج أدناه بدقة
                              ليتسنى لفريق البحث إدراجها وتحديث السجل.
                            </p>

                            <div className="space-y-4">
                              <div className="space-y-6">
                                {corrections.map((correction, index) => (
                                  <div key={index} className="bg-white p-6 rounded-xl border border-brand-200 relative shadow-sm">
                                    {corrections.length > 1 && (
                                      <button 
                                        onClick={() => setCorrections(c => c.filter((_, i) => i !== index))}
                                        className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    )}
                                    <h4 className="font-bold text-brand-900 mb-4 border-b border-gray-100 pb-2">التصويب رقم {index + 1}</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-1">القسم</label>
                                        <select
                                          className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                          value={correction.section}
                                          onChange={(e) => {
                                            const newC = [...corrections];
                                            newC[index].section = e.target.value;
                                            setCorrections(newC);
                                          }}
                                        >
                                          <option value="">اختر القسم</option>
                                          <option value="البيانات الشخصية">البيانات الشخصية</option>
                                          <option value="نسب العائلة">نسب العائلة</option>
                                          <option value="شيوخ وأعلام">شيوخ وأعلام</option>
                                          <option value="ديار ومواطن">ديار ومواطن</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-1">رقم الصفحة</label>
                                        <input
                                          type="text"
                                          className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                          placeholder="مثال: 45"
                                          value={correction.page}
                                          onChange={(e) => {
                                            const newC = [...corrections];
                                            newC[index].page = e.target.value;
                                            setCorrections(newC);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <label className="block text-sm font-bold text-brand-700 mb-1">الملاحظة المطلوب تعديلها وتفاصيلها</label>
                                      <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                        placeholder="اكتب الملاحظة أو الخطأ كما هو موجود في السجل"
                                        value={correction.error}
                                        onChange={(e) => {
                                          const newC = [...corrections];
                                          newC[index].error = e.target.value;
                                          setCorrections(newC);
                                        }}
                                      ></textarea>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-bold text-brand-700 mb-1">التصويب المقترح ومصدره</label>
                                      <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                        placeholder="اكتب التصويب الصحيح مع ذكر المصدر إن وجد"
                                        value={correction.text}
                                        onChange={(e) => {
                                          const newC = [...corrections];
                                          newC[index].text = e.target.value;
                                          setCorrections(newC);
                                        }}
                                      ></textarea>
                                    </div>
                                  </div>
                                ))}
                                
                                <button
                                  onClick={() => setCorrections(c => [...c, { section: "", page: "", text: "", error: "" }])}
                                  className="w-full py-4 border-2 border-dashed border-brand-300 text-brand-600 bg-brand-50/50 rounded-xl font-bold hover:bg-brand-50 hover:border-brand-400 transition flex justify-center items-center gap-2"
                                >
                                  الضغط هنا لإضافة طلب تصويب أخر <span className="text-xl leading-none px-2">+</span> 
                                </button>
                              </div>

                              <div className="flex items-start gap-3 mt-4 bg-white p-4 rounded-xl border border-brand-100">
                                <input
                                  type="checkbox"
                                  id="terms"
                                  className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                                  checked={agreeToCorrectionTerms}
                                  onChange={(e) =>
                                    setAgreeToCorrectionTerms(
                                      e.target.checked,
                                    )
                                  }
                                />
                                <label
                                  htmlFor="terms"
                                  className="text-brand-700 text-sm leading-relaxed cursor-pointer select-none"
                                >
                                  أقر بأني اطلعت على{" "}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowCorrectionTerms(true);
                                    }}
                                    className="text-brand-600 font-bold underline hover:text-brand-800"
                                  >
                                    شروط وأحكام التصويبات
                                  </button>{" "}
                                  وأوافق عليها، وأتحمل مسؤولية صحة المعلومات
                                  المقدمة.
                                </label>
                              </div>

                              <div className="pt-4 border-t border-brand-100">
                                <button
                                  disabled={
                                    !isValid ||
                                    !agreeToCorrectionTerms
                                  }
                                  onClick={handleSendCorrectionRequest}
                                  className="w-full md:w-auto px-10 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                  <Send className="w-5 h-5" /> إرسال طلب
                                  التصويب
                                </button>
                              </div>
                            </div>
                          </div>
                      </div>
                      )}

                      {showCorrectionTerms && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-right p-6 relative">
                            <h3 className="text-xl font-bold text-brand-900 mb-4">
                              شروط وأحكام التصويبات
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-brand-700 text-sm mb-6 pb-4 border-b border-gray-100">
                              <li>
                                يحق للعميل تقديم طلب تصويب واحد مجاني خلال
                                30 يوماً من استلام السجل.
                              </li>
                              <li>
                                يجب الإشارة إلى المصدر المعتمد للتصويب إذا
                                كان تعديلاً جوهرياً في النسب.
                              </li>
                              <li>
                                عمليات التصحيح الإملائي والتنسيقي تتم
                                مراجعتها وتعديلها مباشرة.
                              </li>
                              <li>
                                التحديثات الجذرية التي تتطلب إعادة بحث قد
                                يترتب عليها رسوم إضافية.
                              </li>
                            </ul>
                            <div className="flex justify-end gap-3 mt-6">
                              <button
                                onClick={() => setShowCorrectionTerms(false)}
                                className="px-6 py-2 bg-brand-50 text-brand-600 rounded-xl font-bold hover:bg-brand-100 transition"
                              >
                                إغلاق
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
`;

  code = code.substring(0, startIndex) + newBlock + '\n                  ' + code.substring(endIndex);
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Could not find start/end bounds.");
}
