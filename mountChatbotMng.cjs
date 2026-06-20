const fs = require('fs');
let s = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

if (!s.includes('import { ChatbotManagement }')) {
  s = s.replace(
    'import { TreeBuilder } from "./TreeBuilder";',
    'import { TreeBuilder } from "./TreeBuilder";\nimport { ChatbotManagement } from "@/components/ChatbotManagement";'
  );
}

s = s.replace(
  '{currentTab === "customer_service" &&',
  '{currentTab === "chatbot_management" && <ChatbotManagement />}\n        {currentTab === "customer_service" &&'
);

fs.writeFileSync('src/pages/AdminPanel.tsx', s);
