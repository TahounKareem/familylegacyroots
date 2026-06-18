const fs = require('fs');

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const t1 = '{status !== "closed" && order?.actionPhase !== "تمت المسودة" ? (';
const r1 = '{status !== "closed" && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي"].includes(order?.actionPhase || "") ? (';

const t2 = '{status !== "closed" && order?.actionPhase !== "تمت المسودة" && (';
const r2 = '{status !== "closed" && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي"].includes(order?.actionPhase || "") && (';

const t3 = '{order.data.sectionStatuses?.archive !== "closed" && order?.actionPhase !== "تمت المسودة" && (';
const r3 = '{order.data.sectionStatuses?.archive !== "closed" && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي"].includes(order?.actionPhase || "") && (';

dash = dash.split(t1).join(r1);
dash = dash.split(t2).join(r2);
dash = dash.split(t3).join(r3);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
console.log("Fixed Customer Dashboard hide save buttons");
