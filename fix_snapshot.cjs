const fs = require('fs');

function fixChatbot() {
  let file = 'src/components/ui/Chatbot.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('setDynamicFaqs(faqsText);\n    });')) {
    code = code.replace(
      'setDynamicFaqs(faqsText);\n    });',
      'setDynamicFaqs(faqsText);\n    }, (error) => {\n      console.warn("Chatbot FAQs not available yet or permission denied:", error);\n    });'
    );
    fs.writeFileSync(file, code);
  }
}

function fixKnowledgeCenter() {
  let file = 'src/pages/KnowledgeCenter.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('setLoading(false);\n    });')) {
    code = code.replace(
      'setLoading(false);\n    });',
      'setLoading(false);\n    }, (error) => {\n      console.warn("KnowledgeCenter permissions error:", error);\n      setLoading(false);\n    });'
    );
    fs.writeFileSync(file, code);
  }
}

function fixAdminPanel() {
  let file = 'src/pages/AdminPanel.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('data.sort((a, b) => b.createdAt - a.createdAt);\n        setIntroSessions(data);\n      });')) {
    code = code.replace(
      'data.sort((a, b) => b.createdAt - a.createdAt);\n        setIntroSessions(data);\n      });',
      'data.sort((a, b) => b.createdAt - a.createdAt);\n        setIntroSessions(data);\n      }, (error) => console.warn("Admin intro_sessions error:", error));'
    );
  }
  
  if (code.includes('data.sort((a: any, b: any) => b.createdAt - a.createdAt);\n        setKnowledgeArticles(data);\n      });')) {
    code = code.replace(
      'data.sort((a: any, b: any) => b.createdAt - a.createdAt);\n        setKnowledgeArticles(data);\n      });',
      'data.sort((a: any, b: any) => b.createdAt - a.createdAt);\n        setKnowledgeArticles(data);\n      }, (error) => console.warn("Admin articles error:", error));'
    );
  }
  
  if (code.includes('setUsersList(data);\n      });')) {
    code = code.replace(
      'setUsersList(data);\n      });',
      'setUsersList(data);\n      }, (error) => console.warn("Admin users list error:", error));'
    );
  }
  
  fs.writeFileSync(file, code);
}

function fixStore() {
  let file = 'src/lib/store.ts';
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('set({ orders: ordersList, isLoading: false });\n            }\n          );')) {
    code = code.replace(
      'set({ orders: ordersList, isLoading: false });\n            }\n          );',
      'set({ orders: ordersList, isLoading: false });\n            },\n            (error) => {\n              console.warn("Store orders sync error:", error);\n              set({ isLoading: false });\n            }\n          );'
    );
    fs.writeFileSync(file, code);
  }
}

fixChatbot();
fixKnowledgeCenter();
fixAdminPanel();
fixStore();
