const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const s1 = `<div className="bg-white rounded-3xl p-8 border border-brand-100 shadow-sm mt-8">
                                <div className="text-center mb-8">
                                  <h3 className="text-2xl font-bold text-brand-900 mb-4">
                                    إثراء السجل العائلي`;
const idx1 = content.indexOf(s1);

const s2 = `                              <div className="mt-8 bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-sm text-center relative overflow-hidden">
                                <div className="absolute top-0 start-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -translate-x-10 -translate-y-10 opacity-50 pointer-events-none"></div>`;
const idx2 = content.indexOf(s2);

const s3 = `                                  );
                                })()}
                              </div>`;
const idx3 = content.indexOf(s3, idx2) + s3.length;

if (idx1 > -1 && idx2 > -1 && idx3 > idx2) {
  const block2 = content.substring(idx2, idx3);
  // remove block2 from its original position
  content = content.substring(0, idx2) + content.substring(idx3);
  // insert block2 before block1
  content = content.substring(0, idx1) + block2 + '\n\n' + content.substring(idx1);
  fs.writeFileSync('src/pages/Dashboard.tsx', content);
  console.log("Blocks swapped!");
} else {
  console.log("Could not find sections");
}
