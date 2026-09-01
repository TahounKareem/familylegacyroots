const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');
code = code.replace(/export const db = initializeFirestore\(app, \{ experimentalForceLongPolling: true \}\);/g, 'export const db = getFirestore(app);');
fs.writeFileSync('src/lib/firebase.ts', code);
