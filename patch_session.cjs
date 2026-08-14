const fs = require('fs');
let code = fs.readFileSync('src/components/ui/SessionManager.tsx', 'utf8');

code = code.replace(
  `import { addDoc, collection, serverTimestamp } from 'firebase/firestore';`,
  `import { addDoc, collection, serverTimestamp } from 'firebase/firestore';\nimport { useNavigate } from 'react-router';`
);

code = code.replace(
  `export function SessionManager() {
  const { currentUser, logout } = useAppStore();`,
  `export function SessionManager() {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();`
);

code = code.replace(
  `    if (["admin", "maestro", "research", "design", "marketing", "accounting", "compliance", "shipping"].includes(role || '')) {
      window.location.href = '/team/login';
    } else {
      window.location.href = '/auth';
    }`,
  `    if (["admin", "maestro", "research", "design", "marketing", "accounting", "compliance", "shipping"].includes(role || '')) {
      navigate('/Team', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }`
);

fs.writeFileSync('src/components/ui/SessionManager.tsx', code);
