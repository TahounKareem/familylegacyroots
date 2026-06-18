const fs = require('fs');
let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const sortOld = `const needsActionA = a.actionPhase === "تمت المسودة" || a.actionPhase === "تم التصويب";
            const needsActionB = b.actionPhase === "تمت المسودة" || b.actionPhase === "تم التصويب";`;

const sortNew = `const needsActionA = a.actionPhase === "تمت المسودة" || a.actionPhase === "تم التصميم الإلكتروني" || a.actionPhase === "تم التصويب";
            const needsActionB = b.actionPhase === "تمت المسودة" || b.actionPhase === "تم التصميم الإلكتروني" || b.actionPhase === "تم التصويب";`;

admin = admin.replace(sortOld, sortNew);
fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
