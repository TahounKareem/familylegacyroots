const fs = require('fs');
let text = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const sBlock = `                          <div className="mb-4 bg-brand-50 p-6 rounded-2xl border border-brand-200">
                             <div className="text-center mb-8">
                               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                               <h3 className="text-xl font-bold text-brand-900 mb-2">
                                 تم إصدار النسخة النهائية من سجل تراث عائلتكم
                               </h3>
                               <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                                 ويمكنكم استعراض وتحميل هذه النسخة من نافذة "النسخة الرقمية" كما تم ارسال النسخ الورقية وبوستر مخطط عمود النسب الى عنوانكم البريدي.
                               </p>
                             </div>
                          </div>`;

text = text.replace(sBlock, '');

fs.writeFileSync('src/pages/Dashboard.tsx', text);
