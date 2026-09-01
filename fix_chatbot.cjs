const fs = require('fs');
let code = fs.readFileSync('src/components/ChatbotManagement.tsx', 'utf8');

code = code.replace(
  'const [editForm, setEditForm] = useState<Partial<FAQ>>({});',
  'const [editForm, setEditForm] = useState<Partial<FAQ>>({});\n  const [hasError, setHasError] = useState(false);'
);

code = code.replace(
  '      setFaqs(data);\n    }, (error) => { console.error("ChatbotManagement error:", error); });',
  '      setFaqs(data);\n      setHasError(false);\n    }, (error) => { \n      setHasError(true);\n      console.warn("Chatbot FAQs permission issue, please update your Firebase rules.");\n    });'
);

fs.writeFileSync('src/components/ChatbotManagement.tsx', code);
