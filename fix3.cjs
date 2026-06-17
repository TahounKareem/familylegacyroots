const fs = require('fs');

const file = 'src/pages/AdminPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ \|\| paymentRequestOrder\.actionPhase === "تم التوثيق"/g, '');

fs.writeFileSync(file, content);
console.log('done fixing تم التوثيق TS errors');
