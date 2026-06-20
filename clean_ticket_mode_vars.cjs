const fs = require('fs');
let s = fs.readFileSync('src/components/ui/Chatbot.tsx', 'utf8');

s = s.replace('  const [isTicketMode, setIsTicketMode] = useState(false);\n', '');
s = s.replace("  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success'>('idle');\n", '');

s = s.replace(/  const \[ticketData, setTicketData\] = useState\(\{[\s\S]*?\}\);\n/, '');

s = s.replace("import { createSupportTicket } from '@/lib/firebase';\n", '');

s = s.replace('[messages, isOpen, isTicketMode]', '[messages, isOpen]');

const submitMatch = `  const submitTicket = async (e: React.FormEvent) => {`;
const idx = s.indexOf(submitMatch);
if (idx !== -1) {
    const endMatch = `    }
  };`;
    const endIdx = s.indexOf(endMatch, idx) + endMatch.length;
    s = s.slice(0, idx) + s.slice(endIdx);
}

fs.writeFileSync('src/components/ui/Chatbot.tsx', s);
