const fs = require('fs');
let text = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const sBlock = `                      ) : order?.status !== "مكتمل" &&
                        order?.status !== "طلب مكتمل" &&
                        order?.status !== "تم تسليم الإصدار الأول" &&
                        order?.status !== "تم الإصدار" &&
                        order?.issueStatus !== "تم الإصدار" &&
                        order?.actionPhase !== "جاري التصويب" &&
                        order?.issueStatus !== "جاري التصويب" ? (`;

const newBlock = `                      ) : !["مكتمل", "طلب مكتمل", "تم تسليم الإصدار الأول", "تم الإصدار", "جاهز للطباعة", "جاهز للتسليم للعميل"].includes(order?.status || "") &&
                        !["جاري التصويب", "تم التصويب", "تم إصدار النسخة الأولية"].includes(order?.actionPhase || "") &&
                        !["جاري التصويب", "تم التصويب"].includes(order?.issueStatus || "") ? (`;

text = text.replace(sBlock, newBlock);

fs.writeFileSync('src/pages/Dashboard.tsx', text);
