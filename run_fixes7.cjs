const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const oldFilter = `(o.actionPhase === "تمت المسودة" ||
                o.actionPhase === "تم التصميم الإلكتروني" ||
                o.actionPhase === "تم التصويب" ||
                o.actionPhase === "تم تجهيز السجل للطباعة" ||
                o.actionPhase === "جاهز للطباعة" ||
                o.actionPhase === "جاهز للتسليم" ||
                o.actionPhase === "تم التسليم"),`;

const newFilter = `(o.actionPhase === "تمت المسودة" ||
                o.actionPhase === "تم التصميم الإلكتروني" ||
                o.actionPhase === "تم إصدار النسخة الأولية" ||
                o.actionPhase === "تم الإصدار" ||
                o.actionPhase === "تم تسليم الإصدار الأول" ||
                o.actionPhase === "تم التصويب" ||
                o.actionPhase === "تم تجهيز السجل للطباعة" ||
                o.actionPhase === "جاهز للطباعة" ||
                o.actionPhase === "جاهز للتسليم" ||
                o.actionPhase === "تم التسليم"),`;

admin = admin.replace(oldFilter, newFilter);

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
