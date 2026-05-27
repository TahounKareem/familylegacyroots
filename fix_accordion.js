import fs from 'fs';

let content = fs.readFileSync('src/components/AccordionContract.tsx', 'utf8');

// Replace \`\${ with `${ and }\` with }`
content = content.replace(/\\`\\\$\{(.*?)\}\\`/g, '`${$1}`');
// And regular escaped backticks
content = content.replace(/\\`/g, '`');
// And escape \n which was somehow double-escaped as \\n
content = content.replace(/\\\\n/g, '\\n');


fs.writeFileSync('src/components/AccordionContract.tsx', content);
