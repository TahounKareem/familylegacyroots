const fs = require('fs');
let text = fs.readFileSync('src/pages/Dashboard_TEMP.tsx', 'utf8');

// Also need to re-apply the changes done by other scripts:
// fix_part1: hide correction form form isPostInitialDelivery
const isPostInitialDelivStr = "const isPostInitialDelivery = [\"تم تسليم الإصدار الأول\", \"مكتمل\", \"طلب مكتمل\", \"تأكيد اعتماد النسخة\", \"جاهز للطباعة\", \"جاهز للتسليم للعميل\"].includes(order?.status) || [\"تم إصدار النسخة الأولية\", \"جاري التصويب\", \"تم التصويب\", \"جاهز للتسليم للعميل\", \"تم التسليم\"].includes(order?.actionPhase);";

text = text.replace('const status = order?.status;', `${isPostInitialDelivStr}\n  const status = order?.status;`);
text = text.split('{status !== "closed" ? (').join('{status !== "closed" && !isPostInitialDelivery ? (');

const oldCondition = `) : order?.status !== "مكتمل" &&
                        order?.status !== "طلب مكتمل" &&
                        order?.status !== "تم تسليم الإصدار الأول" &&
                        order?.status !== "تم الإصدار" &&
                        order?.issueStatus !== "تم الإصدار" &&
                        order?.actionPhase !== "جاري التصويب" &&
                        order?.issueStatus !== "جاري التصويب" ? (`;

const newCondition = `) : !["مكتمل", "طلب مكتمل", "تم الإصدار", "تم تسليم الإصدار الأول"].includes(order?.status || "") &&
                        !["جاري التصويب", "تم التصويب"].includes(order?.actionPhase || "") &&
                        !["جاري التصويب", "تم التصويب", "تم الإصدار"].includes(order?.issueStatus || "") &&
                        order?.actionPhase !== "تم إصدار النسخة الأولية" ? (`;

text = text.replace(oldCondition, newCondition);

// fix_part2: States and Modals
text = text.replace(
  /const \[replyAttachments, setReplyAttachments\] = useState<string\[\]>\(\[\]\);/,
  `const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});`
);

text = text.replace(
  /alert\("تم حفظ كمسودة بنجاح. يمكنك العودة لتعديلها لاحقاً."\);/g,
  `setSuccessModal({isOpen: true, title: "تم الحفظ كمسودة بنجاح!", subtitle: "لقد تم الحفظ بنجاح، يمكنك العودة لتعديل هذه البيانات في أي وقت."});`
);

text = text.replace(
  /if \(confirm\("هل أنت متأكد من حفظ وإغلاق هذا القسم\؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين\."\)\) \{(.*?)\s*\}\s*\} else/gs,
  (match, p1) => {
     return `if (confirm("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.")) {${p1}
                                  setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
                                } else`
  }
);
// note the above regex relies on "} else" to boundary the capture group non-greedily, or we can just replace 'if (confirm("..."))' by 'if(confirm("...")){ let res = (old call inside); setSuccessModal(...); }' 
// Actually, it's easier to find the specific replace.
// Let's just use string replacement for the exact statements.

fs.writeFileSync('src/pages/Dashboard.tsx', text);
