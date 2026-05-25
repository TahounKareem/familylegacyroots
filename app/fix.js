const fs = require('fs');
let file = fs.readFileSync('src/pages/ServiceAgreement.tsx', 'utf8');

// I will just use string replacement for the big messed up block.
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
    console.log("Fixed!");
} else {
    console.log("Block not found.");
}
