const fs = require('fs');
let s = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const tabToAdd = `
    {
      id: "chatbot_management",
      label: "إدارة المرشد الذكي",
      desc: "إضافة وتعديل الأسئلة والأجوبة التسويقية لتحسين ردود المرشد الذكي",
      roles: ["maestro", "admin", "customer_support"],
      icon: MessageCircle,
      color: "bg-indigo-50 border-indigo-200 hover:shadow-indigo-100",
      iconBg: "bg-indigo-100 text-indigo-600",
      textColor: "text-indigo-900",
    },`;

s = s.replace(
  'const availableTabs = [',
  'const availableTabs = [' + tabToAdd
);

// We need to add MessageCircle to the lucide-react imports if not there.
if (!s.includes('MessageCircle') && s.includes('lucide-react')) {
  s = s.replace('import {', 'import { MessageCircle,');
}

fs.writeFileSync('src/pages/AdminPanel.tsx', s);
