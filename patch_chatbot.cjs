const fs = require('fs');
let s = fs.readFileSync('src/components/ui/Chatbot.tsx', 'utf8');

const imports = `import { collection, onSnapshot } from 'firebase/firestore';\nimport { db } from '@/lib/firebase';`;
if (!s.includes('collection, onSnapshot')) {
  s = s.replace('import { createSupportTicket }', imports + '\nimport { createSupportTicket }');
}

const state = `  const [dynamicFaqs, setDynamicFaqs] = useState<string>("");`;
if (!s.includes('dynamicFaqs')) {
  s = s.replace('const [ticketStatus', state + '\n  const [ticketStatus');
}

const effect = `
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chatbot_faqs"), (snapshot) => {
      let faqsText = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.isActive) {
          faqsText += "سؤال: " + data.question + "\\nإجابة: " + data.answer + "\\n\\n";
        }
      });
      setDynamicFaqs(faqsText);
    });
    return () => unsubscribe();
  }, []);
`;
if (!s.includes('const unsubscribe = onSnapshot(collection(db, "chatbot_faqs"')) {
  // Try to place it under currentUser declaration
  s = s.replace('const messagesEndRef = useRef<HTMLDivElement>(null);', 'const messagesEndRef = useRef<HTMLDivElement>(null);\n' + effect);
}

s = s.replace(
  'body: JSON.stringify({ messages: newMessages })',
  'body: JSON.stringify({ messages: newMessages, dynamicContext: dynamicFaqs })'
);

const buttonRenderer = `
                      {msg.text.includes("مركز التواصل والدعم") && (
                         <div className="mt-3 text-center">
                            <button onClick={() => { window.location.href='/contact'; }} className="inline-block bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-emerald-100 hover:bg-emerald-50 transition">
                              فتح تذكرة دعم
                            </button>
                         </div>
                      )}
`;
s = s.replace(
  '{msg.text}\n                    </p>',
  '{msg.text}\n                    </p>' + buttonRenderer
);

fs.writeFileSync('src/components/ui/Chatbot.tsx', s);
