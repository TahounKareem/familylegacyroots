const fs = require('fs');

const file = 'src/pages/AdminPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ \|\| currentPhase === "قيد البحث"/g, '');
content = content.replace(/currentPhase === "قيد البحث" \? "مرحلة البحث" : currentPhase/g, 'currentPhase');

fs.writeFileSync(file, content);
console.log('done fixing قيد البحث TS errors');
