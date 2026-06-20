const fs = require('fs');
let s = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const targetStart = `          return (
            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                <h2 className="font-bold text-lg text-brand-900">
                  إدارة خدمة العملاء (العملاء والطلبات)
                </h2>
              </div>`;

const replacementStart = `          return (
            <div className="space-y-8">
              <ChatbotManagement />
              <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                  <h2 className="font-bold text-lg text-brand-900">
                    إدارة خدمة العملاء (العملاء والطلبات)
                  </h2>
                </div>`;

const endTarget = `                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

      {currentTab === "users" &&`;

const endReplacement = `                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          );
        })()}

      {currentTab === "users" &&`;

s = s.replace(targetStart, replacementStart);
s = s.replace(endTarget, endReplacement);

fs.writeFileSync('src/pages/AdminPanel.tsx', s);
