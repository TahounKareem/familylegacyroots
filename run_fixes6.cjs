const fs = require('fs');

let authTsx = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const inputs = authTsx.match(/<input[^>]*>/g) || [];
for (const inp of inputs) {
    if (!inp.includes('autoComplete')) {
        const newInp = inp.replace('<input ', '<input autoComplete="new-password" ');
        authTsx = authTsx.replace(inp, newInp);
    }
}
const forms = authTsx.match(/<form[^>]*>/g) || [];
for (const frm of forms) {
    if (!frm.includes('autoComplete')) {
        const newFrm = frm.replace('<form ', '<form autoComplete="off" ');
        authTsx = authTsx.replace(frm, newFrm);
    }
}

fs.writeFileSync('src/pages/Auth.tsx', authTsx);
