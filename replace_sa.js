import fs from 'fs';

let content = fs.readFileSync('src/pages/ServiceAgreement.tsx', 'utf8');

// The botched replacement removed everything from `{!scrolledToBottom` down to `disabled={signTimeLeft > 0}`
// The current code is broken. Let me just replace the broken part with the correct content:

const brokenPart = `          }
              disabled={signTimeLeft > 0}`;

const fixedPart = `        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-brand-100">
          <button 
            type="button" 
            onClick={() => navigate("/order?step=2")} 
            className="px-6 py-3 rounded-2xl font-medium text-brand-600 hover:bg-brand-50 transition flex items-center gap-2"
          >
           <ArrowRight className="w-5 h-5" /> عودة لتحديد النطاق
          </button>
          
          <button 
            onClick={handleProceed} 
            disabled={!canProceed || isSigning || signedInternally}
            className={\`px-10 py-3 rounded-2xl font-bold transition shadow-lg flex items-center gap-2 \${isSigning ? 'bg-orange-500 text-white animate-pulse-slow cursor-wait' : signedInternally ? 'bg-green-600 text-white cursor-default' : 'bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed'}\`}
          >
            {isSigning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> جاري التوقيع...
              </>
            ) : signedInternally ? (
              <>أتممت التوقيع <Check className="w-5 h-5" /></>
            ) : (
              <>
                وقع إلكترونياً <PenTool className="w-5 h-5" />
              </>
            )}
          </button>
          
          {signedInternally && (
             <button onClick={() => navigate("/order?step=4")} className="px-6 py-3 bg-brand-900 text-white rounded-2xl font-bold shadow-md hover:bg-brand-800 transition mr-2 flex items-center gap-2">
               المتابعة <ArrowLeft className="w-5 h-5" />
             </button>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: \`
        ::selection { background: transparent; }
        ::-moz-selection { background: transparent; }
        @media print {
          body { display: none !important; }
        }
      \`}} />

      {/* Manual Signature Confirmation Modal */}
      {showManuallySignedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-2 border-brand-200">
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 mb-4">التوقيع الإلكتروني المستقل</h2>
            <p className="text-brand-700 leading-relaxed mb-8">
              نظرًا لأهمية التوقيع والاعتماد، قمنا بفتح نافذة التوقيع بشكل مستقل وآمن عبر منصة SignNow لضمان عدم وجود أي قيود من المتصفح (موانع الاطارات الإعلانية).
              <br /><br />
              يرجى إتمام التوقيع في النافذة الأخرى، ثم العودة إلى هنا وتأكيد ذلك. (يفتح التوقيع في شاشة منفصلة).
            </p>
            
            <button
              onClick={() => {
                setShowManuallySignedModal(false);
                setSignedInternally(true);
              }}
              disabled={signTimeLeft > 0}`;

content = content.replace(brokenPart, fixedPart);

fs.writeFileSync('src/pages/ServiceAgreement.tsx', content);
