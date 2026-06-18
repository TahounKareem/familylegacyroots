const fs = require('fs');

let content = fs.readFileSync('src/pages/TreeBuilder.tsx', 'utf8');
content = content.replace(
  'name: familyName || "أنت", relation: "نقطة البداية"',
  'name: familyName || "اسم العائلة", relation: "نقطة البداية"'
);

fs.writeFileSync('src/pages/TreeBuilder.tsx', content);

console.log("Done TreeBuilder");
