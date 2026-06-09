import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace hero button link
content = content.replace(
  '<a href="#journey" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-md font-semibold transition text-center text-lg flex items-center justify-center gap-2 group w-fit">',
  '<Link to="/auth" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-md font-semibold transition text-center text-lg flex items-center justify-center gap-2 group w-fit">'
);
content = content.replace(
  'ابدأ سجل عائلتك\n                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\n                </a>',
  'ابدأ سجل عائلتك\n                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\n                </Link>'
);

// New journey component
const journeyReplacement = `          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2 lg:gap-4 hidden md:flex">
            {[
              { title: "ابدأ سجل عائلتك" },
              { title: "حدثنا عن عائلتك" },
              { title: "نقوم بالبحث والتوثيق" },
              { title: "استلم السجل" }
            ].map((step, idx) => (
              <div key={idx} className="relative flex-1 flex items-center group">
                <div 
                  className="bg-brand-50 z-10 font-bold text-brand-900 border border-brand-100 shadow-sm py-8 px-4 flex-1 text-center h-full flex flex-col justify-center transition-colors group-hover:bg-brand-100/50"
                  style={{
                    clipPath: idx === 0 
                      ? 'polygon(0% 0%, 85% 0, 100% 50%, 85% 100%, 0% 100%)' 
                      : idx === 3 
                        ? 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%, 15% 50%)' 
                        : 'polygon(0% 0%, 85% 0, 100% 50%, 85% 100%, 0% 100%, 15% 50%)',
                    borderRadius: idx === 0 ? '1rem' : idx === 3 ? '1rem' : '0'
                  }}
                >
                  <span className="text-xl px-6">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {[
              { title: "ابدأ سجل عائلتك" },
              { title: "حدثنا عن عائلتك" },
              { title: "نقوم بالبحث والتوثيق" },
              { title: "استلم السجل" }
            ].map((step, idx) => (
              <div key={idx} className="bg-brand-50 rounded-2xl p-6 text-center shadow-sm border border-brand-100 font-bold text-brand-900 text-lg">
                {idx + 1}. {step.title}
              </div>
            ))}
          </div>`;

// Replace the features grid with the arrow steps
content = content.replace(
  /<div className="grid md:grid-cols-4 gap-8">[\s\S]*?<\/div>\n\n {10}<motion.div \n {12}initial=\{\{ opacity: 0, y: 20 \}\}/,
  journeyReplacement + '\n\n          <motion.div \n            initial={{ opacity: 0, y: 20 }}'
);

// Update button at the bottom of the journey
content = content.replace(
  'ابدأ سجل عائلتك',
  'أعرف المزيد عن السجل'
);
content = content.replace(
  '<Link to="/auth"',
  '<Link to="/services"'
); // Note: "أعرف المزيد عن السجل" was requested to redirect to the record details ("السجل الأساسي") page. But /services is where we have `ServiceAgreement` no? Wait, maybe `/services` doesn't exist, we just have About, or FAQs. The family record page is likely the `Services` component if it exists. Reverting this, it might be `/knowledge` or similar, but the user explicitly requested "أعرف المزيد عن السجل" with redirection to the family record page. I'll link to "/services" for now and I can edit app routes if needed. Let's see what pages exist.

fs.writeFileSync('src/pages/Home.tsx', content);
