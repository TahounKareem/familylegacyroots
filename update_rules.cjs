const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');
code = code.replace(
  /get\(\/databases\/\$\(database\)\/documents\/users\/\$\(request\.auth\.uid\)\)\.data\.role/g,
  "get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get('role', 'user')"
);
fs.writeFileSync('firestore.rules', code);
