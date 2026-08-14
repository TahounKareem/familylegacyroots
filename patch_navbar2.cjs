const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

code = code.replace(
  `onClick={() => { logout(); navigate('/auth'); }}`,
  `onClick={() => { const isAdmin = currentUser?.role !== 'user'; logout(); navigate(isAdmin ? '/Team' : '/auth'); }}`
);

code = code.replace(
  `onClick={() => { logout(); navigate('/auth'); setIsOpen(false); }}`,
  `onClick={() => { const isAdmin = currentUser?.role !== 'user'; logout(); navigate(isAdmin ? '/Team' : '/auth'); setIsOpen(false); }}`
);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
