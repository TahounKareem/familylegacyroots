import fs from 'fs';

const content = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

const badStart = content.indexOf('{step === 1');
const badEnd = content.indexOf('{step === 5');

if (badStart !== -1 && badEnd !== -1) {
  const fileHeader = content.substring(0, badStart);
  const fileFooter = content.substring(badEnd);

  // We are going to replace everything between step 1 and step 5
  // (step 1 and step 2). Let's construct it cleanly.

  const newMiddle = `{step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">بيانات أمين السجل</h2>
                <p className="text-brand-600 font-bold text-lg">تبدأ رحلة التوثيق من الشخص الذي يحمل مسؤولية حفظ الرواية</p>
              </div>
              
              {/* Section 1 */}
              <div className="bg-white border rounded-2xl p-6 border-brand-200 shadow-sm p-4 md:p-8">
                <div className="border-b border-brand-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-brand-900 mb-1">بيانات أمين السجل</h3>
                  <p className="text-sm text-brand-600">أدخل البيانات الأساسية التي سيُبنى عليها سجل تراث عائلتك</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الإسم الأول (أمين السجل) *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.firstName} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} placeholder="الاسم الأول" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">اسم الأب *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.fatherName} onChange={(e)=>setFormData({...formData, fatherName: e.target.value})} placeholder="اسم الأب" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">اسم الجد *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.grandfatherName} onChange={(e)=>setFormData({...formData, grandfatherName: e.target.value})} placeholder="اسم الجد" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-white border rounded-2xl p-6 border-brand-200 shadow-sm p-4 md:p-8">
                <div className="border-b border-brand-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-brand-900 mb-1">بيانات الإنتماء العائلي</h3>
                  <p className="text-sm text-brand-600">أدخل البيانات الأساسية التي سيُبنى عليها سجل تراث عائلتك</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">إسم العائلة *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.familyName} onChange={(e)=>setFormData({...formData, familyName: e.target.value})} placeholder="اسم العائلة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">القبيلة (اختياري)</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.tribeName || ""} onChange={(e)=>setFormData({...formData, tribeName: e.target.value})} placeholder="" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الموطن الأصلي للعائلة *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.homeland || ""} onChange={(e)=>setFormData({...formData, homeland: e.target.value})} placeholder="" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">الدولة (حيث الموطن الأصلي) *</label>
                    <select 
                      className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                      value={formData.country} 
                      onChange={(e)=>setFormData({...formData, country: e.target.value})}
                    >
                      <option value="" disabled>اختر الدولة...</option>
                      <CountrySelectOptions />
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-brand-50 border rounded-2xl p-6 border-brand-200 shadow-sm p-4 md:p-8 relative">
                <div className="border-b border-brand-200 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-brand-900 mb-1">بيانات التواصل والإقامة</h3>
                  <p className="text-sm text-brand-600">تُستخدم هذه البيانات للتواصل مع أمين السجل وإدارة الطلب وتسليم النسخ المطبوعة</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">البريد الإلكتروني *</label>
                    <input type="email" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.email || ""} onChange={(e)=>setFormData({...formData, email: e.target.value})} placeholder="البريد الإلكتروني" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">رقم الجوال *</label>
                    <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" value={formData.mobileNumber || ""} onChange={(e)=>{
                         const val = e.target.value;
                         if (/^[\\d+]*$/.test(val)) setFormData({...formData, mobileNumber: val});
                      }} placeholder="+0000000000" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">دولة الإقامة الحالية *</label>
                    <select 
                      className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                      value={formData.currentResidenceCountry || ""} 
                      onChange={(e)=>{
                         setFormData(prev => ({
                           ...prev, 
                           currentResidenceCountry: e.target.value
                         }));
                      }}
                    >
                      <option value="" disabled>اختر الدولة...</option>
                      <CountrySelectOptions />
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                    <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.currentResidenceState || ""} onChange={(e)=>setFormData({...formData, currentResidenceState: e.target.value})} placeholder="المدينة / المحافظة" />
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-200">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                      checked={formData.hasDeliveryAddress || false}
                      onChange={(e)=>setFormData({...formData, hasDeliveryAddress: e.target.checked})}
                    />
                    <span className="font-bold text-lg text-brand-900 border-b border-brand-300 pb-1">أرغب باستلام النسخ المطبوعة من السجل</span>
                  </label>

                  {formData.hasDeliveryAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-white rounded-xl border border-brand-200 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="col-span-1 md:col-span-2 font-bold text-brand-900 mb-2">عنوان التوصيل</h4>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-800 mb-2">اسم المستلم *</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.name || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, name: e.target.value}})} placeholder="الاسم الكامل" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">رقم هاتف المستلم *</label>
                        <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" 
                          value={formData.deliveryAddress?.phone || ""} onChange={(e)=>{
                             const val = e.target.value;
                             if (/^[\\d+]*$/.test(val)) {
                                setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, phone: val}});
                             }
                          }} placeholder="+0000000000" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">دولة التوصيل *</label>
                        <select 
                          className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                          value={formData.deliveryAddress?.country || ""} 
                          onChange={(e)=>{
                             setFormData(prev => ({
                               ...prev, 
                               deliveryAddress: {
                                 ...prev.deliveryAddress, 
                                 country: e.target.value,
                                 phone: prev.deliveryAddress?.phone || getPhoneCode(e.target.value)
                               }
                             }));
                          }}
                        >
                          <option value="" disabled>اختر الدولة...</option>
                          <CountrySelectOptions />
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.state || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, state: e.target.value}})} placeholder="المدينة أو المحافظة" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-800 mb-2">الرمز البريدي</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.zip || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, zip: e.target.value}})} placeholder="الرمز البريدي" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-800 mb-2">العنوان التفصيلي *</label>
                        <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" 
                          value={formData.deliveryAddress?.street || ""} onChange={(e)=>setFormData({...formData, deliveryAddress: {...formData.deliveryAddress, street: e.target.value}})} placeholder="الحي، الشارع، المبنى، رقم الشقة" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mt-6 p-4">
                <p className="text-sm font-medium text-brand-600 bg-brand-50 border border-brand-100 rounded-full inline-block px-6 py-2 shadow-sm">
                  تُعامل جميع البيانات بخصوصية تامة، ولا تُستخدم إلا ضمن نطاق تنفيذ السجل وخدمات المنصة.
                </p>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تحديد النطاق</h2>
                <p className="text-brand-600">تحديد نقطة العرض الأساسية وقالب التصميم</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xl font-medium text-brand-900 mb-2">
                  <UserPlus className="w-6 h-6 text-brand-600" />
                  نقطة العرض الأساسية *
                </label>
                <div className="text-sm font-light text-brand-700 mb-6 bg-brand-50 p-6 rounded-xl border border-brand-100 leading-relaxed">
                  يقوم السجل على عنصر أساسي وهو توثيق عمود نسب أمين السجل / العميل ، ومربع أمين السجل هو نقطة الانطلاق في توثيق هذه الشجرة.
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-3xl p-8 text-white mb-12 shadow-xl border border-brand-700 relative overflow-hidden mt-8">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-brand-50/10 p-3 rounded-full backdrop-blur-sm mb-4">
                    <GitMerge className="w-8 h-8 text-brand-100" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-center mb-4">أمين السجل.. جذع المبنى ومركز التوثيق</h3>
                  <p className="text-brand-100 text-center max-w-2xl leading-relaxed mb-10 text-sm md:text-base">
                   بصفتك أمين السجل، أنت تمثل الحلقة الجوهرية التي تربط الماضي بالمستقبل. اسمك هو نقطة الانطلاق في توثيق هذه الشجرة، ومن خلالك تتفرع الأغصان لتمتد إلى الأبناء والأحفاد المحتمل إضافتهم لاحقاً، مرسخةً إرث العائلة للأجيال القادمة.
                  </p>

                  {/* Visual Tree */}
                  <div className="flex flex-col items-center select-none pt-2">
                     
                     {/* Beyond Family - Box 2 */}
                     <div className="bg-brand-900/40 text-brand-200 border border-brand-500/50 rounded-full py-1 px-4 text-center text-xs z-10 border-dashed mb-0">
                        الجد الأعلى
                     </div>
                     <div className="h-4 w-0.5 border-l-2 border-brand-200/40 border-dashed mb-1" />

                     {/* Beyond Family - Box 1 */}
                     <div className="bg-brand-900/60 text-brand-100 border border-brand-500/70 rounded-full py-1.5 px-5 text-center text-xs z-10 border-dashed mb-0">
                        القبيلة / الفخذ
                     </div>
                     <div className="h-4 w-0.5 border-l-2 border-brand-200/40 border-dashed" />

                     {/* Family Name */}
                     <div className="text-brand-300 text-xs tracking-wide opacity-80 uppercase mb-1">العائلة</div>
                     <div className="bg-brand-900 text-brand-100 border border-brand-500 rounded-full py-1.5 px-6 text-center text-sm z-10 font-bold mb-0">
                        {formData.familyName || "العائلة"}
                     </div>
                     <div className="h-4 w-0.5 bg-brand-200/50" />

                     {/* Grandfather 1 */}
                     <div className="bg-brand-800/80 border border-brand-400 rounded-full py-1.5 px-6 text-center text-brand-50 text-sm z-10 font-bold">
                        {formData.grandfatherName || "الجد الأول"}
                     </div>
                     <div className="h-4 w-0.5 bg-brand-200/50" />

                     {/* Father */}
                     <div className="bg-brand-800/80 border border-brand-400 rounded-full py-2 px-8 text-center text-brand-50 z-10 font-bold">
                        {formData.fatherName || "الأب"}
                     </div>
                     
                     {/* Vertical Line from Father */}
                     <div className="h-6 w-0.5 bg-brand-200/50" />
                     
                     {/* Horizontal Line Connecting Branches */}
                     <div className="w-64 md:w-[24rem] h-0.5 bg-brand-200/50 flex justify-between relative">
                        <div className="h-6 w-0.5 bg-brand-200/50 absolute left-0 top-0" />
                        <div className="h-6 w-0.5 bg-brand-200/50 absolute left-1/2 -translate-x-1/2 top-0" />
                        <div className="h-6 w-0.5 bg-brand-200/50 absolute right-0 top-0" />
                     </div>

                     {/* Children Nodes (Siblings + You) */}
                     <div className="flex justify-between w-[17rem] md:w-[25rem] mt-6 relative items-start">
                        <div className="bg-brand-800/60 border border-brand-300/30 rounded-xl py-2 w-20 md:w-24 text-center text-brand-200 text-xs backdrop-blur-sm border-dashed">
                           أخ / أخت
                        </div>
                        {/* Record Keeper Box with Children */}
                        <div className="flex flex-col items-center">
                          <div className="bg-white text-brand-900 border-2 border-brand-200 shadow-[0_0_25px_rgba(255,255,255,0.15)] rounded-full py-2 px-6 md:px-8 min-w-[80px] text-center relative z-10 font-bold font-serif -mt-2">
                             {formData.firstName || "أنت"}
                          </div>
                          
                          {/* Vertical Line from You */}
                          <div className="h-5 w-0.5 bg-brand-200/50" />
                          
                          {/* Horizontal Line for Your Children (4 children) */}
                          <div className="w-32 md:w-40 h-0.5 bg-brand-200/50 flex justify-between relative">
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute left-0 top-0" />
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute left-[33%] top-0" />
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute left-[66%] top-0" />
                            <div className="h-4 w-0.5 bg-brand-200/50 absolute right-0 top-0" />
                          </div>
                          
                          {/* Your Children Nodes */}
                          <div className="flex justify-between w-[9.5rem] md:w-[11.5rem] mt-4 relative items-start gap-1">
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبن
                             </div>
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبنة
                             </div>
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبن
                             </div>
                             <div className="bg-brand-800/60 border border-brand-400 border-dashed rounded-lg py-1 w-8 md:w-10 text-center text-brand-200 text-[9px] md:text-[10px]">
                               إبنة
                             </div>
                          </div>
                        </div>
                        <div className="bg-brand-800/60 border border-brand-300/30 rounded-xl py-2 w-20 md:w-24 text-center text-brand-200 text-xs backdrop-blur-sm border-dashed">
                           أخ / أخت
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-100">
                <label className="block text-xl font-medium text-brand-900 mb-2">اختيار القالب :</label>
                <div className="text-sm font-light text-brand-700 mb-6 bg-brand-50 p-4 rounded-xl border border-brand-100">
                  اختر نموذج قالب التصميم الفني الذي ترغب فيه لسجلك ( نوفر نوعين من التصاميم المميزة لكي يظهر فيه سجلك ) .
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <label className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-4 transition-all \${formData.designTemplate === "مودرن" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}\`}>
                    <input type="radio" name="design" value="مودرن" className="hidden" checked={formData.designTemplate === "مودرن"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-brand-100 bg-white flex items-center justify-center p-2">
                       <img src="https://i.postimg.cc/KzTskNLd/Modern.png" alt="مسار مودرن" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج حديث "مودرن"</span>
                  </label>
                  
                  <label className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-4 transition-all \${formData.designTemplate === "كلاسيكي" ? "border-brand-600 bg-brand-50 shadow-md transform scale-[1.02]" : "border-brand-200 hover:border-brand-400"}\`}>
                    <input type="radio" name="design" value="كلاسيكي" className="hidden" checked={formData.designTemplate === "كلاسيكي"} onChange={(e)=>setFormData({...formData, designTemplate: e.target.value})} />
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-brand-100 bg-white flex items-center justify-center p-2">
                       <img src="https://i.postimg.cc/cH35gmYj/Classic.png" alt="مسار كلاسيكي" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-brand-900 text-lg">نموذج كلاسيكي</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          `;

  let newContent = fileHeader + newMiddle + fileFooter;
  
  // also replace button name:
  newContent = newContent.replace('تحويل للمراجعة والعقد"', 'حفظ ومتابعة"');
  newContent = newContent.replace('التالي"', 'حفظ ومتابعة"');

  fs.writeFileSync('src/pages/OrderFlow.tsx', newContent);
}

