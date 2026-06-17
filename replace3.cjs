const fs = require('fs');

const file = 'src/pages/AdminPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `const isUnread = !(notif.readBy || []).includes(currentUser?.id);`;
const replacement1 = `const isUnread = notif.timestamp > lastReadNotifsTime;`;

content = content.replace(new RegExp(target1.replace(/[.*+?^$\{key\}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replacement1);

const target2 = `<p className="text-sm text-brand-900 font-medium leading-relaxed mb-2">
                                {notif.message}
                              </p>`;
const replacement2 = `<p className="text-sm text-brand-900 font-bold mb-1">{notif.title}</p>
                              <p className="text-xs text-brand-700 font-medium leading-relaxed mb-2">
                                {notif.message}
                              </p>`;

content = content.replace(new RegExp(target2.replace(/[.*+?^$\{key\}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replacement2);

fs.writeFileSync(file, content);
console.log('done replacing notif rendering');
