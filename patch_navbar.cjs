const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

code = code.replace(
  'import { Link, useLocation } from "react-router";',
  'import { Link, useLocation, useNavigate } from "react-router";'
);

code = code.replace(
  '  const { currentUser, logout } = useAppStore();',
  '  const { currentUser, logout } = useAppStore();\n  const navigate = useNavigate();'
);

code = code.replace(
  `onClick={() => { logout(); window.location.href = '/auth'; }}`,
  `onClick={() => { logout(); navigate('/auth'); }}`
);

code = code.replace(
  `onClick={() => { logout(); window.location.href = '/auth'; setIsOpen(false); }}`,
  `onClick={() => { logout(); navigate('/auth'); setIsOpen(false); }}`
);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
