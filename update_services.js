import fs from 'fs';

let content = fs.readFileSync('src/pages/Services.tsx', 'utf8');

content = content.replace(
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">1</div>',
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">١</div>'
);
content = content.replace(
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">2</div>',
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٢</div>'
);
content = content.replace(
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">3</div>',
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٣</div>'
);
content = content.replace(
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">4</div>',
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٤</div>'
);
content = content.replace(
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">5</div>',
  '<div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٥</div>'
);
content = content.replace(
  '<p className="font-bold text-brand-900 border-b border-brand-100 pb-2 mb-4">يمكن توزيع قيمة المشروع على 3 مراحل ميسرة:</p>',
  '<p className="font-bold text-brand-900 border-b border-brand-100 pb-2 mb-4">يمكن توزيع قيمة المشروع على ٣ مراحل ميسرة:</p>'
);
content = content.replace(
  '<span className="text-4xl text-brand-600 mb-4 font-mono font-bold" dir="ltr">90 - 180 <span className="text-2xl font-sans">يوماً</span></span>',
  '<span className="text-4xl text-brand-600 mb-4 font-mono font-bold" dir="rtl">٩٠ - ١٨٠ <span className="text-2xl font-sans">يوماً</span></span>'
);
content = content.replace(
  '<div className="text-5xl lg:text-6xl font-bold text-brand-600 font-mono mb-2" dir="ltr">$1,980</div>',
  '<div className="text-5xl lg:text-6xl font-bold text-brand-600 font-mono mb-2" dir="rtl">١،٩٨٠ دولار</div>'
);

content = content.replace(
  '<div className="bg-green-50 p-6 md:p-8 rounded-3xl border border-green-200 shadow-sm">',
  '<div className="bg-brand-50 p-6 md:p-8 rounded-3xl border border-brand-100 shadow-sm">'
);
content = content.replace(
  '<h3 className="font-bold text-green-900 text-2xl mb-4 border-b border-green-200 pb-3 font-serif">يشمل الإصدار الأساسي من «سجل تراث العائلة»:</h3>',
  '<h3 className="font-bold text-brand-900 text-2xl mb-4 border-b border-brand-100 pb-3 font-serif">يشمل الإصدار الأساسي من «سجل تراث العائلة»:</h3>'
);
content = content.replace(
  '<ul className="space-y-3 pr-4 text-green-900 font-medium">',
  '<ul className="space-y-3 pr-4 text-brand-800 font-medium">'
);
content = content.replaceAll(
  '<CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />',
  '<CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" />'
);
content = content.replace(
  '<h3 className="font-bold text-green-900 mt-8 mb-4 border-b border-green-200 pb-3 text-xl font-serif">ويتم تسليم العمل عبر:</h3>',
  '<h3 className="font-bold text-brand-900 mt-8 mb-4 border-b border-brand-100 pb-3 text-xl font-serif">ويتم تسليم العمل عبر:</h3>'
);
content = content.replace(
  '<ul className="space-y-3 pr-4 text-green-900 font-medium">',
  '<ul className="space-y-3 pr-4 text-brand-800 font-medium">'
);

content = content.replace(
  '<div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-200 shadow-sm">',
  '<div className="bg-white p-6 md:p-8 rounded-3xl border border-brand-100 shadow-sm">'
);
content = content.replace(
  '<h3 className="font-bold text-red-900 text-2xl mb-4 border-b border-red-200 pb-3 font-serif">ما الذي لا يشمله السجل؟</h3>',
  '<h3 className="font-bold text-brand-900 text-2xl mb-4 border-b border-brand-100 pb-3 font-serif">ما الذي لا يشمله السجل؟</h3>'
);
content = content.replace(
  '<p className="mb-4 text-red-900 font-medium">يركز الإصدار الأساسي على توثيق عمود النسب ضمن النطاق المتفق عليه. ولذلك، لا يشمل:</p>',
  '<p className="mb-4 text-brand-800 font-medium">يركز الإصدار الأساسي على توثيق عمود النسب ضمن النطاق المتفق عليه. ولذلك، لا يشمل:</p>'
);
content = content.replace(
  '<ul className="space-y-3 pr-4 text-red-900">',
  '<ul className="space-y-3 pr-4 text-brand-800">'
);
content = content.replaceAll(
  '<XCircle className="w-6 h-6 text-red-600 shrink-0" />',
  '<XCircle className="w-6 h-6 text-brand-400 shrink-0" />'
);
content = content.replace(
  '<p className="mt-6 text-red-900 font-medium p-4 bg-white rounded-xl border border-red-100 shadow-sm border-r-4 border-r-red-400">',
  '<p className="mt-6 text-brand-900 font-medium p-4 bg-brand-50 rounded-xl border border-brand-100 shadow-sm border-r-4 border-r-brand-400">'
);

if(!content.includes('ChevronDown')) {
  content = content.replace('Info,', 'Info, ChevronDown,');
}

content = content.replace(
  '<Info className="w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto" />',
  '<ChevronDown className="w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto" />'
);
content = content.replace(
  '<Info className="w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto" />',
  '<ChevronDown className="w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto" />'
);

fs.writeFileSync('src/pages/Services.tsx', content);
