import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  '- البحث يعتمد حصرياً على السجلات الحكومية والوثائق العثمانية، ول  const systemInstruction = `أنت',
  '- البحث يعتمد حصرياً على السجلات الحكومية والوثائق العثمانية.\\n\\nconst systemInstruction = `أنت'
);

fs.writeFileSync('server.ts', content);
