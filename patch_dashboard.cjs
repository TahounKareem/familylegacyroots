const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(/window\.location\.href = "\/auth"/g, 'navigate("/auth", { replace: true })');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
