const fs = require('fs');
let s = fs.readFileSync('src/components/ui/Chatbot.tsx', 'utf8');

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
  '{msg.text}\n                  </div>',
  '{msg.text}' + buttonRenderer + '\n                  </div>'
);

fs.writeFileSync('src/components/ui/Chatbot.tsx', s);
