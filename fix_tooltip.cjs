const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const regex = /const InfoTooltip = \(\{ text \}: \{ text: string \}\) => \([\s\S]*?\);\s*/;
code = code.replace(regex, '');

const tooltipCode = `
const InfoTooltip = ({ text }: { text: string }) => (
  <div className="relative group inline-flex items-center justify-center mr-2 z-50 align-middle">
    <div className="w-5 h-5 rounded-full bg-brand-200 text-brand-700 font-bold text-xs flex items-center justify-center cursor-help">
      i
    </div>
    <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-64 bg-brand-50 border border-brand-200 text-brand-800 text-xs rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none z-50">
      {text}
    </div>
  </div>
);
`;
code = code.replace('export function Dashboard', tooltipCode + '\nexport function Dashboard');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
