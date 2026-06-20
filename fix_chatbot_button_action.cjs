const fs = require('fs');
let s = fs.readFileSync('src/components/ui/Chatbot.tsx', 'utf8');

s = s.replace(
  'onClick={() => { window.location.href=\'/contact\'; }}',
  'onClick={() => setIsTicketMode(true)}'
);

fs.writeFileSync('src/components/ui/Chatbot.tsx', s);
