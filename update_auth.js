import fs from 'fs';

let content = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

// Change isLogin default to false
content = content.replace(
  'const [isLogin, setIsLogin] = useState(true);',
  'const [isLogin, setIsLogin] = useState(false);'
);

// Inject 4-step diagram above the title
const authDiagram = `      <div className="sm:mx-auto sm:w-full sm:max-w-3xl transform scale-75 origin-top mb-1 mt-10">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2 lg:gap-4 hidden md:flex">
          {[
            { title: "ابدأ سجل عائلتك" },
            { title: "حدثنا عن عائلتك" },
            { title: "نقوم بالبحث والتوثيق" },
            { title: "استلم السجل" }
          ].map((step, idx) => (
            <div key={idx} className="relative flex-1 flex items-center group">
              <div 
                className="bg-brand-50 z-10 font-bold text-brand-900 border border-brand-100 shadow-sm py-4 px-2 flex-1 text-center h-full flex flex-col justify-center transition-colors"
                style={{
                  clipPath: idx === 0 
                    ? 'polygon(0% 0%, 85% 0, 100% 50%, 85% 100%, 0% 100%)' 
                    : idx === 3 
                      ? 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%, 15% 50%)' 
                      : 'polygon(0% 0%, 85% 0, 100% 50%, 85% 100%, 0% 100%, 15% 50%)',
                  borderRadius: idx === 0 ? '1rem' : idx === 3 ? '1rem' : '0'
                }}
              >
                <span className="text-base px-3">{step.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
`;

content = content.replace(
  '<div className="sm:mx-auto sm:w-full sm:max-w-md">\n        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-brand-900">',
  authDiagram + '\n      <div className="sm:mx-auto sm:w-full sm:max-w-md">\n        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-brand-900">'
);

// Swap the bottom layouts for isLogin
const newBottomLayout = `        {!isLogin ? (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-50 text-brand-500">لديك حساب بالفعل؟</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-brand-500 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <button 
                onClick={() => setIsLogin(true)} 
                className="relative flex items-center justify-center gap-2 w-full py-4 bg-white border border-brand-200 rounded-[2rem] text-brand-700 font-bold hover:text-brand-900 transition shadow-sm hover:shadow-md"
              >
                <Home className="w-5 h-5 text-brand-600" />
                تسجيل الدخول
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-50 text-brand-500">مستخدم جديد؟</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center relative group">
              <button 
                onClick={() => setIsLogin(false)} 
                className="relative flex items-center justify-center gap-2 w-full py-4 bg-white border border-brand-200 rounded-[2rem] text-brand-700 font-bold hover:text-brand-900 transition shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-5 h-5 text-brand-600" />
                إنشاء حساب جديد الآن
              </button>
            </div>
          </div>
        )}`;

// Note the original ternary was `{isLogin ? ( ... ) : ( ... )}`.
// I'll replace it entirely using string matching.

const startIdx = content.indexOf('{isLogin ? (');
const endStr = '      </div>\n    </div>\n  );\n}\n';
const endIdx = content.lastIndexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newBottomLayout + '\n' + content.substring(endIdx);
}

fs.writeFileSync('src/pages/Auth.tsx', content);
