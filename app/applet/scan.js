const fs = require('fs');
const execSync = require('child_process').execSync;
console.log("Checking if Mail exists in lucide-react...");
try {
  const code = `import * as lc from "lucide-react"; console.log(Object.keys(lc).includes("Mail"));`;
  fs.writeFileSync('test_Mail.mjs', code);
  const out = execSync('npx node test_Mail.mjs').toString();
  console.log("Result:", out.trim());
} catch (e) {
  console.log("Failed:", e.message);
}
