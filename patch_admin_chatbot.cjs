const fs = require('fs');
let s = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// 1. Remove chatbot_management tab from availableTabs
s = s.replace(/\{\s*id:\s*"chatbot_management"[\s\S]*?\},/, '');

// 2. Remove isolated chatbot_management rendering
s = s.replace(/\{currentTab === "chatbot_management" && <ChatbotManagement \/>\}\n/, '');

// 3. Inject ChatbotManagement inside customer_service tab
s = s.replace(
  '        {currentTab === "customer_service" &&\n        (() => {\n          let filteredUsers = usersList.filter((u) => u.role === "user");',
  '        {currentTab === "customer_service" &&\n        (() => {\n          let filteredUsers = usersList.filter((u) => u.role === "user");'
);

s = s.replace(
  '          return (\n            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">',
  '          return (\n            <div className="space-y-8">\n              <ChatbotManagement />\n              <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">'
);

s = s.replace(
  '                  </tbody>\n                </table>\n              </div>\n            </div>\n          );\n        })()}',
  '                  </tbody>\n                </table>\n              </div>\n            </div>\n            </div>\n          );\n        })()}'
);

fs.writeFileSync('src/pages/AdminPanel.tsx', s);
