const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const infoTooltipMatch = code.match(/const InfoTooltip = \(\{ text \}: \{ text: string \}\) => \([\s\S]*?\);\s*/);

if (infoTooltipMatch) {
  code = code.replace(infoTooltipMatch[0], '');
  code = code.replace('export function Dashboard', infoTooltipMatch[0] + '\nexport function Dashboard');
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
  console.log("Moved InfoTooltip!");
} else {
  console.log("InfoTooltip not found");
}
