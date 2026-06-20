const fs = require('fs');

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dash = dash.split('!["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي"].includes(')
  .join('!["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "تم تسليم النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي", "تم التسليم"].includes(');

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
console.log("Updated Dashboard dashboard conditions");
