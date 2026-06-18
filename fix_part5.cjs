const fs = require('fs');
const file = 'src/pages/OrderFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

const sBlock = `                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">البريد الإلكتروني *</label>
                    <input type="email" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.email || ""} onChange={(e)=>setFormData({...formData, email: e.target.value})} placeholder="البريد الإلكتروني" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">دولة الإقامة الحالية *</label>
                    <select 
                      className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white" 
                      value={formData.currentResidenceCountry || ""} 
                      onChange={(e)=>{
                         const newCountry = e.target.value;
                         const code = getPhoneCode(newCountry);
                         setFormData(prev => {
                           return {
                             ...prev, 
                             currentResidenceCountry: newCountry,
                             mobileNumber: code
                           };
                         });
                      }}
                    >
                      <option value="" disabled>اختر الدولة...</option>
                      <CountrySelectOptions />
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">المدينة / المحافظة *</label>
                    <StateSelect 
                      countryId={formData.currentResidenceCountry} 
                      value={formData.currentResidenceState || ""} 
                      onChange={(val) => setFormData({...formData, currentResidenceState: val})} 
                      placeholder="المدينة / المحافظة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">رقم الجوال *</label>
                    <input type="tel" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 text-left dir-ltr" value={formData.mobileNumber || ""} onChange={(e)=>{
                         const val = e.target.value;
                         if (/^[\\d+]*$/.test(val)) setFormData({...formData, mobileNumber: val});
                      }} placeholder="+0000000000" dir="ltr" />
                  </div>
                </div>`;

const regexBlock = /<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">[\s\S]*?<\/div>\s*<\/div>/;

content = content.replace(regexBlock, sBlock);

fs.writeFileSync(file, content);
