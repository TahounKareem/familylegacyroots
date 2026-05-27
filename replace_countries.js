import fs from 'fs';

let content = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

// Replace all the large option groups with <CountrySelectOptions />
const optgroupRegex = /<optgroup label="شبة الجزيرة العربية">[\s\S]*?<\/optgroup>[\s\S]*?<optgroup label="أسيا العربية \( الهلال الخصيب \)">[\s\S]*?<\/optgroup>[\s\S]*?<optgroup label="شمال أفريقيا">[\s\S]*?<\/optgroup>[\s\S]*?<optgroup label="شرق أفريقيا">[\s\S]*?<\/optgroup>[\s\S]*?<optgroup label="باقي دول العالم">[\s\S]*?<\/optgroup>/g;

content = content.replace(optgroupRegex, '<CountrySelectOptions />');

// also replace the huge code for country codes
const phoneCodeRegex = /const getPhoneCode = \(c: string\) => \{[\s\S]*?return codes\[c\] || "";\s*\};/g;

content = content.replace(phoneCodeRegex, '');

// Import CountrySelectOptions and getPhoneCode
if (!content.includes('CountrySelectOptions')) {
  // Add exports
  const imports = `import { getPhoneCode } from "../data/countries";\nimport { CountrySelectOptions } from "../data/CountrySelectOptions";\n`;
  content = content.replace('import { TreeBuilder } from "./TreeBuilder";', 'import { TreeBuilder } from "./TreeBuilder";\n' + imports);
}

fs.writeFileSync('src/pages/OrderFlow.tsx', content);
