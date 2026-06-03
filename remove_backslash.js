import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// The original line has \`; instead of `;
content = content.replace(
  'السجلات الحكومية والوثائق العثمانية.\\`;',
  'السجلات الحكومية والوثائق العثمانية.`;'
);

fs.writeFileSync('server.ts', content);
