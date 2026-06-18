const fs = require('fs');

let auth = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

auth = auth.replaceAll('<input autoComplete="new-password" autoComplete="new-password"', '<input autoComplete="new-password"');

fs.writeFileSync('src/pages/Auth.tsx', auth);
console.log("Fixed duplicate auth inputs with autocomplete off.");
