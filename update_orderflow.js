import fs from 'fs';

let content = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

// Replace standard variables in initial state
content = content.replace(
  `    shippingAddress: {
      name: "",
      phone: "",
      country: "",
      state: "",
      street: "",
      zip: "",
      notes: ""
    }
  });`,
  `    shippingAddress: {
      name: "",
      phone: "",
      country: "",
      state: "",
      street: "",
      zip: "",
      notes: ""
    },
    mobileNumber: "",
    email: "",
    currentResidenceCountry: "",
    currentResidenceState: "",
    hasDeliveryAddress: false,
    deliveryAddress: {
      name: "",
      phone: "",
      country: "",
      state: "",
      street: "",
      zip: "",
      notes: ""
    }
  });`
);


// Replace the entire step 1 JSX
const step1Regex = /\{step === 1 && \(\s*<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">[\s\S]*?<\/div>\s*\)\}/;

const newStep1 = `{step === 1 && (
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
          )}`;

content = content.replace(step1Regex, newStep1);

// Replace button terminology
content = content.replace(
  '{step === 2 ? "تحويل للمراجعة والعقد" : "التالي"} <ArrowLeft className="w-5 h-5" />',
  '"حفظ ومتابعة" <ArrowLeft className="w-5 h-5" />'
);

// We need to update validation logic in className to use the right fields
const oldValidation = `(step === 1 && (!formData.firstName || !formData.fatherName || !formData.grandfatherName || !formData.familyName || !formData.country || !formData.homeland || !formData.shippingAddress?.name || !formData.shippingAddress?.phone || !formData.shippingAddress?.country || !formData.shippingAddress?.state || !formData.shippingAddress?.street)) ||`;

const newValidation = `(step === 1 && (!formData.firstName || !formData.fatherName || !formData.grandfatherName || !formData.familyName || !formData.country || !formData.homeland || !formData.email || !formData.mobileNumber || !formData.currentResidenceCountry || !formData.currentResidenceState || (formData.hasDeliveryAddress && (!formData.deliveryAddress?.name || !formData.deliveryAddress?.phone || !formData.deliveryAddress?.country || !formData.deliveryAddress?.state || !formData.deliveryAddress?.street)))) ||`;

content = content.replace(oldValidation, newValidation);

fs.writeFileSync('src/pages/OrderFlow.tsx', content);

