const fs = require('fs');
const path = require('path');
const file = path.resolve('src/lib/store.ts');
let content = fs.readFileSync(file, 'utf8');

const interfaceCode = `
export interface ChatbotFAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: number;
}
`;
if (!content.includes('export interface ChatbotFAQ')) {
  content = content.replace('export interface Order', interfaceCode + '\nexport interface Order');
  fs.writeFileSync(file, content);
}
