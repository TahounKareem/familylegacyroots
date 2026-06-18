const fs = require('fs');
let order = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

order = order.replaceAll('<input', '<input autoComplete="new-password"');
// remove duplicate autoCompletes if any
order = order.replaceAll('<input autoComplete="new-password" autoComplete="new-password"', '<input autoComplete="new-password"');

fs.writeFileSync('src/pages/OrderFlow.tsx', order);
console.log("Replaced all order inputs with autocomplete off.");
