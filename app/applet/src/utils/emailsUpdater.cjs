const fs = require('fs');

let emailContent = fs.readFileSync('src/lib/emailService.ts', 'utf8');

// Update DEFAULT_FROM
emailContent = emailContent.replace(/const DEFAULT_FROM = ".*";/, 'const DEFAULT_FROM = "info@thefamilylegacyroots.com";');
emailContent = emailContent.replace(/genealabllc@gmail.com/g, 'info@thefamilylegacyroots.com');

fs.writeFileSync('src/lib/emailService.ts', emailContent);
console.log("Updated sender address");
