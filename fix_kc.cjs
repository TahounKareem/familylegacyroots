const fs = require('fs');
let file = 'src/pages/KnowledgeCenter.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '}, (error) => {\n      // Suppress missing permissions error during check\n      setLoading(false);\n    }, (error) => {\n      console.warn("KnowledgeCenter permissions error:", error);\n      setLoading(false);\n    });',
  '}, (error) => {\n      console.warn("KnowledgeCenter permissions error:", error);\n      setLoading(false);\n    });'
);

fs.writeFileSync(file, code);
