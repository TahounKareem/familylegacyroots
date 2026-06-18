const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Replace target icon in dashboard
// From: { tab: "أعلام الأسرة وألقابها", icon: <ShieldCheck
// To: { tab: "أعلام الأسرة وألقابها", icon: <Users
// And: { tab: "نافذة الإدراج العائلي", icon: <Users
// To: { tab: "نافذة الإدراج العائلي", icon: <FolderTree
content = content.replace(
  /\{ tab: "أعلام الأسرة وألقابها", icon: <ShieldCheck/g,
  '{ tab: "أعلام الأسرة وألقابها", icon: <Users'
);
content = content.replace(
  /\{ tab: "نافذة الإدراج العائلي", icon: <Users/g,
  '{ tab: "نافذة الإدراج العائلي", icon: <FolderTree'
);

// We need to move the progress block to before 'إثراء السجل العائلي'
const progressBlockStartStr = `<div className="mt-8 bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-sm text-center relative overflow-hidden">`;
const progressBlockEndStr = `{completionPercentage >= 100 ? (`; // Need to find exact boundary

// Let's use regex matching for the entire progress block:
const blockRegex = /<div className="mt-8 bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-sm text-center relative overflow-hidden">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

// Actually it's easier to use specific markers if we know where they end.
// Let's find exactly the blocks.
fs.writeFileSync('src/pages/Dashboard.tsx', content);

