const fs = require('fs');

let emailService = fs.readFileSync('src/lib/emailService.ts', 'utf8');

emailService = emailService.replace(/genealabllc@gmail\.com/g, 'info@thefamilylegacyroots.com');

fs.writeFileSync('src/lib/emailService.ts', emailService);
