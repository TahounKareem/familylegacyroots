const fs = require('fs');
let s = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

s = s.replace(
  '        (() => {\n          return (\n            <div className="space-y-8">\n              <ChatbotManagement />\n              <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">',
  '        (() => {\n          return (\n            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">'
);

s = s.replace(
  '                  </tbody>\n                </table>\n              </div>\n            </div>\n            </div>\n          );\n        })()}',
  '                  </tbody>\n                </table>\n              </div>\n            </div>\n          );\n        })()}'
);

fs.writeFileSync('src/pages/AdminPanel.tsx', s);
