const fs = require('fs');
let code = fs.readFileSync('src/pages/IntroSession.tsx', 'utf8');

code = code.replace(
  `            await addDoc(collection(db, "mail"), {
              to: formData.email,
              message: {
                subject: "تذكير قبل الموعد بساعة",`,
  `            await addDoc(collection(db, "mail"), {
              to: formData.email,
              bcc: "info@thefamilylegacyroots.com",
              message: {
                subject: "تذكير قبل الموعد بساعة",`
);

fs.writeFileSync('src/pages/IntroSession.tsx', code);
