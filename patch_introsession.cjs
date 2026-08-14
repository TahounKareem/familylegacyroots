const fs = require('fs');
let code = fs.readFileSync('src/pages/IntroSession.tsx', 'utf8');

code = code.replace(
  `      // Trigger Email 1 immediately
      await addDoc(collection(db, "mail"), {
        to: formData.email,
        message: {`,
  `      // Trigger Email 1 immediately
      await addDoc(collection(db, "mail"), {
        to: formData.email,
        bcc: "info@thefamilylegacyroots.com",
        message: {`
);

code = code.replace(
  `            // Write email 2 to Firestore with scheduling
            await addDoc(collection(db, "mail"), {
              to: formData.email,
              message: {`,
  `            // Write email 2 to Firestore with scheduling
            await addDoc(collection(db, "mail"), {
              to: formData.email,
              bcc: "info@thefamilylegacyroots.com",
              message: {`
);

code = code.replace(
  `      // Admin email notification
      await addDoc(collection(db, "mail"), {
        to: "kaouther.douzi@adamresearchcenter.net",
        message: {`,
  `      // Admin email notification
      await addDoc(collection(db, "mail"), {
        to: "kaouther.douzi@adamresearchcenter.net",
        bcc: "info@thefamilylegacyroots.com",
        message: {`
);

fs.writeFileSync('src/pages/IntroSession.tsx', code);
