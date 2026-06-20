const fs = require('fs');
let s = fs.readFileSync('src/components/ChatbotManagement.tsx', 'utf8');

s = s.replace(/\\`border/g, '`border');
s = s.replace(/hover:shadow-md\\`/g, 'hover:shadow-md`');
s = s.replace(/className={\\`flex/g, 'className={`flex');
s = s.replace(/text-gray-700"}\\`/g, 'text-gray-700"}`');

fs.writeFileSync('src/components/ChatbotManagement.tsx', s);
