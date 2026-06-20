const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

// I also need to update the instructions to handle polite greetings.
s = s.replace(
  '-- يجب أن تكون ردودك هادئة، محايدة، مؤسساتية، ومهذبة جداً.',
  '-- يجب أن تكون ردودك هادئة، محايدة، مؤسساتية، ومهذبة جداً.\\n-- يمكنك الرد على التحيات البسيطة (مثل: أهلاً بك، السلام عليكم) بترحيب لبق وقصير، وسؤال العميل كيف يمكنك مساعدته في أعمال المنصة.'
);

s = s.replace('const { messages } = req.body;', 'const { messages, dynamicContext } = req.body;');
s = s.replace(
  'systemInstruction: systemInstruction,',
  'systemInstruction: dynamicContext ? systemInstruction + "\\n\\n### معلومات إضافية من الإدارة لتوفير إجابات دقيقة (Dynamic FAQs):\\n" + dynamicContext : systemInstruction,'
);

fs.writeFileSync('server.ts', s);
