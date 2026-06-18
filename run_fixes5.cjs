const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// Remove the wrong Printer import
admin = admin.replace('import {\n  Printer,\n  doc,', 'import {\n  doc,');

// Insert Printer into lucide-react. Let's find "lucide-react" imports
// Because the regex for lucide is multiline, we can do this string replace:
// '} from "lucide-react";' => ' Printer } from "lucide-react";'
admin = admin.replace(/\} from "lucide-react";/g, '  Printer\n} from "lucide-react";');

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
