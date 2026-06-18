const fs = require('fs');

let auth = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

auth = auth.replaceAll('<input', '<input autoComplete="new-password"');

fs.writeFileSync('src/pages/Auth.tsx', auth);
console.log("Replaced all auth inputs with autocomplete off.");
