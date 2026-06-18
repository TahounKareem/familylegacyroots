const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

admin = admin.replace(
  '&& currentUser?.role !== "design" && (',
  '&& ('
);

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
console.log("Fixed role issue for design manager download link");
