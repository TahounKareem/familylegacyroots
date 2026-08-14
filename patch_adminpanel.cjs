const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

code = code.replace(/window\.location\.href = "\/Team"/g, 'navigate("/Team", { replace: true })');

fs.writeFileSync('src/pages/AdminPanel.tsx', code);
