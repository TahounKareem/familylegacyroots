const fs = require('fs');
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dash = dash.replace(
  `<div className="w-20 h-20 bg-amber-100 text-amber-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-amber-50 shadow-inner mx-auto">
                              <CheckCircle className="w-10 h-10" />
                           </div>`,
  `<div className="w-20 h-20 bg-amber-100 text-amber-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-amber-50 shadow-inner mx-auto">
                              <Edit3 className="w-10 h-10" />
                           </div>`
);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
