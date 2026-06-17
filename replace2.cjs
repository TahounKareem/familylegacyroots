const fs = require('fs');

const files = ['src/pages/AdminPanel.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  newContent = newContent.replace(/تسليم مسودة للإعتماد/g, 'تسليم النسخة الأولية للإعتماد');
  newContent = newContent.replace(/تم تسليم المسودة/g, 'تم تسليم النسخة الأولية');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log('Updated ' + file);
  }
}
