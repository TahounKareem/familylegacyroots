const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const modalUI = `
      {successModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-fade-in relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
            <div className="bg-brand-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-brand-900 mb-3">{successModal.title}</h3>
            <p className="text-brand-600 font-light mb-8 leading-relaxed">
              {successModal.subtitle}
            </p>
            <button
              onClick={() => setSuccessModal({isOpen: false, title: "", subtitle: ""})}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all duration-300"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
      {/* Footer */}`;

content = content.replace('{/* Footer */}', modalUI);

fs.writeFileSync('src/pages/Dashboard.tsx', content);

