import fs from 'fs';

let content = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

// The existing step 1 content:
const oldStep1Start = `<div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">تقديم البيانات</h2>
                <p className="text-brand-600">أدخل بيانات العميل / أمين السجل</p>
              </div>`;

const newStep1Start = `<div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">بيانات أمين السجل</h2>
                <p className="text-brand-600 font-bold text-lg">تبدأ رحلة التوثيق من الشخص الذي يحمل مسؤولية حفظ الرواية</p>
              </div>`;

content = content.replace(oldStep1Start, newStep1Start);

// Let's replace the whole grid section. This starts at `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-brand-100 pb-12">`
// Wait, replacing it by matching might be error prone. The best approach is a full string replacement or regex, but to be safe I will construct the replacement block.

// Instead of string replacement, let me write the full step 1 JSX.
// Or I'll just write a script that regex-matches the whole `if (step === 1)` block?
// Let's do `multi_edit_file` to replace the whole `step === 1 && (` block in OrderFlow.tsx.
