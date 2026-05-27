import fs from 'fs';

let content = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

content = content.replace(/\|\| "";\s*\};\s*/g, '');

fs.writeFileSync('src/pages/OrderFlow.tsx', content);
