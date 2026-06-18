const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace(
  /const \[replyAttachments, setReplyAttachments\] = useState<string\[\]>\(\[\]\);/,
  `const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});`
);

content = content.replace(
  /alert\("تم حفظ كمسودة بنجاح. يمكنك العودة لتعديلها لاحقاً."\);/g,
  `setSuccessModal({isOpen: true, title: "تم الحفظ كمسودة بنجاح!", subtitle: "لقد تم الحفظ بنجاح، يمكنك العودة لتعديل هذه البيانات في أي وقت."});`
);

content = content.replace(
  /if \(confirm\("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين."\)\) \{([\s\S]*?)\}/g,
  `if (confirm("هل أنت متأكد من حفظ وإغلاق هذا القسم؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.")) {
    $1
    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
  }`
);

fs.writeFileSync('src/pages/Dashboard.tsx', content);

