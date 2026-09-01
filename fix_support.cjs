const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SupportTicketsManagement.tsx', 'utf8');

code = code.replace(
  'const [filter, setFilter] = useState<string>("جديدة");',
  'const [filter, setFilter] = useState<string>("جديدة");\n  const [hasError, setHasError] = useState(false);'
);

code = code.replace(
  '      setTickets(msgs);\n    }, (error) => {\n      console.error("SupportTickets error:", error);\n    });',
  '      setTickets(msgs);\n      setHasError(false);\n    }, (error) => {\n      setHasError(true);\n      console.warn("Support tickets permission issue, please update your Firebase rules.");\n    });'
);

code = code.replace(
  '      <div className="space-y-4">',
  '      {hasError && (\n        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 font-bold flex items-center gap-2">\n          ⚠️ يرجى تحديث قواعد البيانات (Firestore Rules) لتتمكن من إدارة هذه الصفحة بشكل كامل.\n        </div>\n      )}\n      <div className="space-y-4">'
);

fs.writeFileSync('src/components/admin/SupportTicketsManagement.tsx', code);
