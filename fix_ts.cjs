const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const regex = /timestamp: new Date\(event\.timestamp \|\| 0\)\.getTime\(\),/;
const replacement = `
               timestamp: (() => {
                 let ts = 0;
                 if (event.timestamp) {
                   if (typeof event.timestamp === "number") ts = event.timestamp;
                   else if (event.timestamp.toDate) ts = event.timestamp.toDate().getTime();
                   else ts = new Date(event.timestamp).getTime();
                 }
                 return isNaN(ts) ? 0 : ts;
               })(),`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync('src/pages/AdminPanel.tsx', code);
