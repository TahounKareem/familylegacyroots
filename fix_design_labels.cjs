const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

content = content.replace('رابط بوستر المشجرة (إن وجد)', 'رابط بوستر المشجرة للتحميل');
content = content.replace('بيانات شحنة النسخة المطبوعة', 'بيانات الشحنة');

fs.writeFileSync('src/pages/AdminPanel.tsx', content);
