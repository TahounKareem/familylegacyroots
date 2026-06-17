const fs = require('fs');
const file = 'src/lib/emailService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/"research@thefamilylegacyroots\.com"/g, '"eng.kareemsherif@gmail.com"');
content = content.replace(/"accounting@thefamilylegacyroots\.com"/g, '"tahoun.kareemsherif@gmail.com"');
content = content.replace(/"design@thefamilylegacyroots\.com"/g, '"ahlymember@gmail.com"');
content = content.replace(/"orders@thefamilylegacyroots\.com",\s*"manager@thefamilylegacyroots\.com",\s*"maestro@thefamilylegacyroots\.com",?/g, '"hassan.alamri@adamresearchcenter.net",\n      "kareem.tahoun@adamresearchcenter.net",');

fs.writeFileSync(file, content);
console.log('done!');
