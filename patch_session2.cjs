const fs = require('fs');
let code = fs.readFileSync('src/components/ui/SessionManager.tsx', 'utf8');

code = code.replace(
  `  }, [logout, currentUser]);`,
  `  }, [logout, currentUser, navigate]);`
);

fs.writeFileSync('src/components/ui/SessionManager.tsx', code);
