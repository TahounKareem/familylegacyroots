const fs = require('fs');
let file = fs.readFileSync('src/pages/ServiceAgreement.tsx', 'utf8');

const messyBlock = `medium ml-2">| Legal Acknowledgement & Agreement</span></h3>
          
          <div className="space-y-4">
            <CheckboxLabel 
              checked={req1} onChange={(v) => { setReq1(v); if(v) recordLegalConsent("electronic_signature_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أوافق على استخدام التوقيع الإلكتروني والسجلات الإلكترونية وسجل التدقيق (Audit Trail) وشهادة الإكمال (Certificate of Completion) كوسائل إثبات قانونية ملزمة، وأقر بحجيتها الكاملة وعدم اشتراط وجود أصل ورقي." 
              textEn="I agree to use electronic signatures, electronic records, the Audit Trail (Audit Trail), and the Certificate of Completion (Certificate of Completion) as legally binding means of evidence, and I acknowledge their full legal effect and that no paper original is required."
            />
          </div>

          {!scrolledToBottom && (
             <p className="text-red-500 text-sm mt-4 font-bold flex items-center gap-2">
               يرجى الاطلاع على كامل الاتفاقية حتى النهاية قبل المتابعة.
             </p>
          )}
        </div>`;

if (file.includes(messyBlock)) {
    file = file.replace(messyBlock, '');
    fs.writeFileSync('src/pages/ServiceAgreement.tsx', file, 'utf8');
    console.log("Fixed part 1!");
} else {
    console.log("Block 1 not found.");
}

const messyBlock2 = `original is required."
            />
          </div>لموافقة القانونية <span className="text-base text-slate-500 font-medium ml-2">| Legal Acknowledgement & Agreement</span></h3>
          
          <div className="space-y-4">
            <CheckboxLabel 
              checked={req1} onChange={(v) => { setReq1(v); if(v) recordLegalConsent("electronic_signature_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أوافق على استخدام التوقيع الإلكتروني والسجلات الإلكترونية وسجل التدقيق (Audit Trail) وشهادة الإكمال (Certificate of Completion) كوسائل إثبات قانونية ملزمة، وأقر بحجيتها الكاملة وعدم اشتراط وجود أصل ورقي." 
              textEn="I agree to use electronic signatures, electronic records, the Audit Trail (Audit Trail), and the Certificate of Completion (Certificate of Completion) as legally binding means of evidence, and I acknowledge their full legal effect and that no paper original is required."
            />
          </div>

          {!scrolledToBottom && (
             <p className="text-red-500 text-sm mt-4 font-bold flex items-center gap-2">
               يرجى الاطلاع على كامل الاتفاقية حتى النهاية قبل المتابعة.
             </p>
          )}
        </div>`;

// also wait there is an unclosed string tag on line 334 which ended with `identif          </div>` ... I will just regex replace the whole thing from {scrolledToBottom} up to {/* Action Bar */}

let regex = /                 \{scrolledToBottom \? \((.|\n)*\{scrolledToBottom \? 'border-brand-300 shadow-md' : 'border-brand-100 opacity-60 pointer-events-none'\} transition-all duration-500 mb-8\`\}>\n          <h3 className="text-xl font-bold text-brand-900 mb-6 border-b border-brand-100 pb-4">الإقرار والموافقة القانونية <span className="text-base text-slate-500 font-medium ml-2">\| Legal Acknowledgement & Agreement<\/span><\/h3>\n          \n          <div className="space-y-4">\n            <CheckboxLabel \n              checked=\{req2\} onChange=\{\(v\) => \{ setReq2\(v\); if\(v\) recordLegalConsent\("order_details_consent", \{ version: "v1.0" \}, contractId.current, orderId.current\); \}\} \n              textAr="تُعد صفحة بيانات الطلب هذه جزءًا لا يتجزأ من هذا العقد ومكملة لأحكامه، وتُقدَّم على أي وصف تجاري أو مراسلات سابقة فيما يخص تحديد المنتج والقيمة وبيانات العميل. وفي حال التعارض، تُقدَّم بيانات الطلب فيما يتعلق بالبيانات التعريفية للصفقة، وتبقى شروط العقد وأحكامه نافذة." \n              textEn="This Order Details page forms an integral part of, and supplements, this Agreement and prevails over any prior commercial description or communications regarding identification of the product\/service, price, and customer information. In the event of any conflict, the Order Details shall control with respect to the identifying information of the transaction, and the remaining terms and conditions of this Agreement shall remain in full force and effect."\n            \/>\n            <CheckboxLabel \n              checked=\{req1\} onChange=\{\(v\) => \{ setReq1\(v\); if\(v\) recordLegalConsent\("electronic_signature_consent", \{ version: "v1.0" \}, contractId.current, orderId.current\); \}\} \n              textAr="أوافق على استخدام التوقيع الإلكتروني والسجلات الإلكترونية وسجل التدقيق \(Audit Trail\) وشهادة الإكمال \(Certificate of Completion\) كوسائل إثبات قانونية ملزمة، وأقر بحجيتها الكاملة وعدم اشتراط وجود أصل ورقي." \n              textEn="I agree to use electronic signatures, electronic records, the Audit Trail \(Audit Trail\), and the Certificate of Completion \(Certificate of Completion\) as legally binding means of evidence, and I acknowledge their full legal effect and that no paper original is required."\n            \/>\n          <\/div>\n\n          \{\!scrolledToBottom && \(\n             <p className="text-red-500 text-sm mt-4 font-bold flex items-center gap-2">\n               يرجى الاطلاع على كامل الاتفاقية حتى النهاية قبل المتابعة.\n             <\/p>\n          \)\}\n        <\/div>)/;

let fullReplacement = \`
                {scrolledToBottom ? (
                  <div className="text-center mt-16 p-12 bg-[#F9F6F0] rounded-2xl border border-brand-200 flex flex-col items-center justify-center gap-6 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-50 opacity-40 mix-blend-multiply pattern-grid-lg"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <h4 className="text-xl font-bold text-brand-900 mb-1">نهاية الوثيقة</h4>
                      <h4 className="text-lg font-bold text-brand-900 mb-4 font-serif">End of Document</h4>
                      <p className="text-brand-700 font-medium text-center leading-relaxed max-w-md">
                        شكرًا لك. لقد أكملت الاطلاع على الاتفاقية بالكامل. يمكنك الآن الانتقال للموافقة على الإقرارات بالأسفل.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-12 py-12 bg-brand-50/80 rounded-2xl border border-brand-200 shadow-inner">
                    <p className="text-brand-600 font-medium flex items-center justify-center gap-2">
                       <ArrowRight className="w-5 h-5 animate-pulse" />
                       استمر بالتمرير للأسفل لتمكين الإقرار والموافقة
                       <ArrowLeft className="w-5 h-5 animate-pulse" />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Checkboxes */}
        <div className={\`bg-white rounded-3xl p-8 border \${scrolledToBottom ? 'border-brand-300 shadow-md' : 'border-brand-100 opacity-60 pointer-events-none'} transition-all duration-500 mb-8\`}>
          <h3 className="text-xl font-bold text-brand-900 mb-6 border-b border-brand-100 pb-4">الإقرار والموافقة القانونية <span className="text-base text-slate-500 font-medium ml-2">| Legal Acknowledgement & Agreement</span></h3>
          
          <div className="space-y-4">
            <CheckboxLabel 
              checked={req2} onChange={(v) => { setReq2(v); if(v) recordLegalConsent("order_details_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="تُعد صفحة بيانات الطلب هذه جزءًا لا يتجزأ من هذا العقد ومكملة لأحكامه، وتُقدَّم على أي وصف تجاري أو مراسلات سابقة فيما يخص تحديد المنتج والقيمة وبيانات العميل. وفي حال التعارض، تُقدَّم بيانات الطلب فيما يتعلق بالبيانات التعريفية للصفقة، وتبقى شروط العقد وأحكامه نافذة." 
              textEn="This Order Details page forms an integral part of, and supplements, this Agreement and prevails over any prior commercial description or communications regarding identification of the product/service, price, and customer information. In the event of any conflict, the Order Details shall control with respect to the identifying information of the transaction, and the remaining terms and conditions of this Agreement shall remain in full force and effect."
            />
            <CheckboxLabel 
              checked={req1} onChange={(v) => { setReq1(v); if(v) recordLegalConsent("electronic_signature_consent", { version: "v1.0" }, contractId.current, orderId.current); }} 
              textAr="أوافق على استخدام التوقيع الإلكتروني والسجلات الإلكترونية وسجل التدقيق (Audit Trail) وشهادة الإكمال (Certificate of Completion) كوسائل إثبات قانونية ملزمة، وأقر بحجيتها الكاملة وعدم اشتراط وجود أصل ورقي." 
              textEn="I agree to use electronic signatures, electronic records, the Audit Trail (Audit Trail), and the Certificate of Completion (Certificate of Completion) as legally binding means of evidence, and I acknowledge their full legal effect and that no paper original is required."
            />
          </div>

          {!scrolledToBottom && (
             <p className="text-red-500 text-sm mt-4 font-bold flex items-center gap-2">
               يرجى الاطلاع على كامل الاتفاقية حتى النهاية قبل المتابعة.
             </p>
          )}
        </div>\`;

let startIdx = file.indexOf('{scrolledToBottom ? (');
let endIdx = file.indexOf('{/* Action Bar */}');

if (startIdx > -1 && endIdx > -1) {
    file = file.substring(0, startIdx) + "\n" + fullReplacement + "\n\n        " + file.substring(endIdx);
    fs.writeFileSync('src/pages/ServiceAgreement.tsx', file, 'utf8');
    console.log("Replaced block completely via indices.");
}

