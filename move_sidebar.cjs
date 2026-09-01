const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const sidebarItemCode = `
const SidebarItem = ({
  title,
  isActive,
  isLocked,
  info,
  badge,
  setActiveTab
}: {
  title: string;
  isActive: boolean;
  isLocked?: boolean;
  info?: string;
  badge?: number;
  setActiveTab: (tab: string) => void;
}) => (
  <button
    disabled={isLocked && title !== "السجل الأساسي"}
    onClick={() => setActiveTab(title)}
    className={\`w-full text-right px-4 py-2.5 rounded-xl transition flex items-center justify-between group/btn relative font-sans text-sm border
      \${isLocked && title !== "السجل الأساسي" ? "opacity-50 cursor-not-allowed" : ""}
      \${isActive ? "bg-brand-50 border-brand-200 text-black font-bold" : "text-black border-transparent hover:bg-brand-50 hover:border-brand-200"}\`}
  >
    <div className="flex items-center">
      <span>{title}</span>
      {badge !== undefined && badge > 0 && (
        <span className="mr-2 bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-pulse">
          {badge}
        </span>
      )}
      {info && (
        <div className="relative group/tooltip inline-flex items-center justify-center mr-2 z-50">
          <div className="w-4 h-4 rounded-full bg-brand-100 text-brand-500 font-bold text-[10px] flex items-center justify-center cursor-help transition-colors hover:bg-brand-200">
            i
          </div>
          <div className="absolute bottom-full mb-2 right-0 w-60 bg-brand-50 border border-brand-200 text-brand-800 font-normal text-xs rounded-xl p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none z-50">
            {info}
          </div>
        </div>
      )}
    </div>
    {isLocked && title !== "السجل الأساسي" && (
      <Lock className="w-4 h-4 text-brand-400 group-hover/btn:text-brand-500" />
    )}
  </button>
);
`;

code = code.replace(/const SidebarItem = \(\{.*?\}\) => \(\s*<button.*?<\/button>\s*\);/s, '');
code = code.replace('export function Dashboard', sidebarItemCode + '\nexport function Dashboard');
code = code.replace(/<SidebarItem\s+([^>]+)>/g, (match, props) => {
  return `<SidebarItem setActiveTab={setActiveTab} ${props}>`;
});
code = code.replace(/<SidebarItem\s+([^>]+)\s*\/>/g, (match, props) => {
  return `<SidebarItem setActiveTab={setActiveTab} ${props}/>`;
});

fs.writeFileSync('src/pages/Dashboard.tsx', code);
