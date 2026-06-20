const fs = require('fs');
let s = fs.readFileSync('src/components/ui/Chatbot.tsx', 'utf8');

const ticketFormStart = `              {/* نموذج فتح التذكرة */}
              {isTicketMode && ticketStatus !== 'success' && (`;
const idx = s.indexOf(ticketFormStart);
if (idx !== -1) {
    const endFormStr = `                  <p className="font-semibold text-sm">تم إرسال التذكرة بنجاح!</p>
                </div>
              )}`;
    const endIdx = s.indexOf(endFormStr) + endFormStr.length;
    s = s.slice(0, idx) + s.slice(endIdx);
}

// remove `{!isTicketMode && (`
s = s.replace(
  '{!isTicketMode && (\n              <div className="p-3 bg-white border-t border-brand-100">',
  '              <div className="p-3 bg-white border-t border-brand-100">'
);
s = s.replace(
  '                </div>\n              </div>\n            )}\n          </div>\n        )\n      )}',
  '                </div>\n              </div>\n          </div>\n        )\n      )}'
);

fs.writeFileSync('src/components/ui/Chatbot.tsx', s);
