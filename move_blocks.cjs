const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Icons replacement
content = content.replace(
  /\{ tab: "أعلام الأسرة وألقابها", icon: <ShieldCheck/g,
  '{ tab: "أعلام الأسرة وألقابها", icon: <Users'
);
content = content.replace(
  /\{ tab: "نافذة الإدراج العائلي", icon: <Users/g,
  '{ tab: "نافذة الإدراج العائلي", icon: <FolderTree'
);

// Progress replacement text
content = content.replace(/نسبة إنجاز ملف العائلة/g, 'نسبة المساهمة في الإثراء');
content = content.replace(/لقد أتممت ملف العائلة بنجاح/g, 'لقد أتممت مساهمتك في الإثراء بنجاح');
content = content.replace(/لاستكمال ملف عائلتك/g, 'لاستكمال المساهمة في الإثراء');

// Swap blocks:
// Block 1: "إثراء السجل العائلي" container
// Starts: `<div className="bg-white rounded-3xl p-8 border border-brand-100 shadow-sm mt-8">`
// Ends before `<div className="mt-8 bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-sm text-center relative overflow-hidden">`

const block1Regex = /(<div className="bg-white rounded-3xl p-8 border border-brand-100 shadow-sm mt-8">[\s\S]*?)(<div className="mt-8 bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-sm text-center relative overflow-hidden">[\s\S]*?\)\]\}\n\s*<\/div>)/;

const match = block1Regex.exec(content);
if (match) {
  const block1 = match[1];
  const block2 = match[2];
  content = content.replace(block1Regex, block2 + "\n" + block1);
} else {
  console.log("Blocks not found!");
}

fs.writeFileSync('src/pages/Dashboard.tsx', content);
