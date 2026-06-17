const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

code = code.replace(/const isUnread = notif\.timestamp > lastReadNotifsTime;/g, 'const isUnread = (!readNotifIds.has(notif.id));');

fs.writeFileSync('src/pages/AdminPanel.tsx', code);
