import React from "react";
import { Printer, CheckCircle, Database, Shield, FileText } from "lucide-react";

export function LegalAuditTrailReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-brand-200 overflow-hidden relative print:block print:shadow-none print:border-none print:overflow-visible">
      <div className="absolute top-0 right-0 w-3 h-full bg-indigo-600 rounded-r-3xl print:hidden" />
      
      <div className="p-8 md:p-12 border-b border-brand-100 bg-gradient-to-r from-indigo-50 to-white print:px-0 print:py-4 print:bg-white print:border-b-2 print:border-black print:mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center print:hidden">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-900">Legal Audit Trail</h2>
              <p className="text-brand-600 mt-2 font-medium">تقرير حصر وتتبع إقرارات وعقود المنصة القانونية</p>
            </div>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-brand-200 hover:bg-brand-50 text-brand-800 px-6 py-3 rounded-xl font-bold shadow-sm transition print:hidden"
          >
            <Printer className="w-5 h-5" />
            طباعة التقرير
          </button>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-12">
        {/* Section 1 */}
        <section className="relative">
          <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
            1. إقرار سياسة الخصوصية وشروط الخدمة (عن التسجيل)
          </h3>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4">
            <ul className="space-y-4 text-brand-700">
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                صفحة إنشاء وتوثيق الحساب (Auth / Order Flow).
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">طريقة الإقرار:</span>
                موافقة صريحة من المستخدم (Checkbox) قبل تفعيل الحساب أو إتمام شراء باقة.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900 flex items-center gap-1"><Database className="w-4 h-4"/> قاعدة البيانات:</span>
                <div>
                  تُحفظ في مجموعة <code className="bg-white px-2 py-1 rounded text-indigo-600 shadow-sm mx-1">users</code> لكل مستخدم.
                  <br/><span className="text-sm text-gray-500 mt-1 inline-block">الحقول: <code className="text-xs font-mono bg-white">agreedToTermsAt</code> و <code className="text-xs font-mono bg-white">legalConsent</code>.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="relative">
          <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
             <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
            2. إقرارات الزوار لملفات الارتباط (Cookies Content)
          </h3>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4">
            <ul className="space-y-4 text-brand-700">
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                نافذة منبثقة أولية للزوار بمجرد الدخول للمنصة (Cookie Banner).
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">طريقة الإقرار:</span>
                موافقة على جميع الملفات (All)، أو ملفات أساسية فقط (Essential)، أو تخصيص.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900 flex items-center gap-1"><Database className="w-4 h-4"/> قاعدة البيانات:</span>
                <div>
                  تُحفظ للزوار في السجل المركزي <code className="bg-white px-2 py-1 rounded text-indigo-600 shadow-sm mx-1">audit_logs</code> وللمسجلين في <code className="bg-white px-2 py-1 rounded text-indigo-600 shadow-sm mx-1">users</code> مع تسجيل رقم الـ IP لضمان الموثوقية.
                  <br/><span className="text-sm text-gray-500 mt-1 inline-block">الحقول: <code className="text-xs font-mono bg-white">cookieConsentLevel</code> و <code className="text-xs font-mono bg-white">cookieConsentAt</code>.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="relative">
          <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
             <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
            3. عقد اتفاقية تقديم الخدمة (شروط التنفيذ والبحث)
          </h3>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mr-4">
            <ul className="space-y-4 text-brand-800">
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                الخطوة الإلزامية قبل إتمام عملية الدفع وتوثيق الطلب (ServiceAgreement).
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">طريقة الإقرار:</span>
                نموذج قانوني يضم 6 بنود محددة لمسار البحث، التاريخ الشفوي، النفقات، وشروط الإنسحاب، يتم التوقيع عليها إلكترونياً بخط اليد المباشر أو الرفع كملف PDF.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900 flex items-center gap-1"><Database className="w-4 h-4 text-blue-600"/> قاعدة البيانات:</span>
                <div>
                  تُحفظ كإرتباط دائم بعملية الطلب في مجموعة <code className="bg-white px-2 py-1 rounded text-blue-700 shadow-sm mx-1">orders</code> الخاصة بالعميل.
                  <br/><span className="text-sm text-blue-600/80 mt-1 inline-block">الحقول: <code className="text-xs font-mono bg-white">contractSigned</code>، <code className="text-xs font-mono bg-white">signatureName</code>، ومرفق داخل المصفوفة <code className="text-xs font-mono bg-white">data.documents</code> كـ (توقيع إلكتروني).</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="relative">
          <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
             <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
            4. إقرارات ومطالبات حقوق البيانات الشخصية (GDPR / حذف بيانات)
          </h3>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4">
            <ul className="space-y-4 text-brand-700">
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                منطقة (تنزيل / حذف معلوماتك الشخصية) من لوحة تحكم العميل المباشرة.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900">طريقة الإقرار:</span>
                طلب رسمي من داخل واجهة الحساب مع تنبيه بمحو البيانات نهائياً خلال 14 يوماً.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold min-w-[120px] text-brand-900 flex items-center gap-1"><Database className="w-4 h-4"/> قاعدة البيانات:</span>
                <div>
                  يسجل كتذكرة منفصلة للرقابة ضمن <code className="bg-white px-2 py-1 rounded text-indigo-600 shadow-sm mx-1">support_tickets</code> لضمان توثيق وقت الطلب.
                  <br/><span className="text-sm text-gray-500 mt-1 inline-block">بحقول مخصصة للأرشفة: <code className="text-xs font-mono bg-white">privacyType: "طلب حذف بيانات"</code> وتصنيف <code className="text-xs font-mono bg-white">categoryTitle: "الخصوصية والوثائق"</code>.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

      </div>
      
      {/* Footer stamp */}
      <div className="p-6 bg-brand-900 text-brand-200 text-center text-sm font-semibold mt-8 hidden print:block">
        Legal Department - Compliance Operations - System Auto-Generated Report - {new Date().toLocaleDateString('en-GB')}
      </div>
    </div>
  );
}
