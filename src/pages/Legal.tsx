import { useEffect } from "react";
import { useLocation } from "react-router";

export function Legal() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
         setTimeout(() => {
           element.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <h1 className="font-serif text-4xl font-bold text-brand-900 mb-12 text-center border-b border-brand-200 pb-6">الوثائق القانونية</h1>
      
      <div className="space-y-16">
        <section id="agreement" className="bg-white p-8 rounded-3xl border border-brand-100">
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-6">اتفاقية الخدمة</h2>
          <div className="prose prose-brand text-brand-800 leading-relaxed font-light">
             <p>تحدد اتفاقية الخدمة هذه الشروط والأحكام التي تتحكم في استخدامكم لمنصتنا وطلبكم لخدمة توثيق سجل تراث العائلة. باستخدامك لمنصتنا أنت توافق التزامك الكامل بالنقاط أدناه.</p>
             <ul className="list-disc pr-6 mt-4 space-y-2">
                <li>يتعهد طالب الخدمة بتقديم معلومات صحيحة ودقيقة حول الأنساب والأسماء.</li>
                <li>تخلي المنصة مسؤوليتها عن أي نزاعات عائلية تنتج عن المعلومات المقدمة والمُوثقة بناءً على المراجع المقدمة من العميل.</li>
                <li>لا يحق للعميل الإخلال بالموعد المحدد لاعتماد المسودات وإلا اعتبرت المسودة الأخيرة معتمدة.</li>
             </ul>
          </div>
        </section>

        <section id="privacy" className="bg-white p-8 rounded-3xl border border-brand-100">
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-6">سياسة الخصوصية</h2>
          <div className="prose prose-brand text-brand-800 leading-relaxed font-light">
             <p>نحن نقدر خصوصيتك ونتعهد بحماية المعلومات الشخصية والعائلية الخاصة بك. الوثائق المرفقة (مثل الصكوك وبطاقات العائلة) تُستخدم حصرياً لأغراض التوثيق والتدقيق ولا تتم مشاركتها مع أطراف ثالثة نهائياً.</p>
          </div>
        </section>

        <section id="terms" className="bg-white p-8 rounded-3xl border border-brand-100">
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-6">شروط الاستخدام</h2>
          <div className="prose prose-brand text-brand-800 leading-relaxed font-light">
             <p>يحق للمنصة الاحتفاظ بالنموذج الهيكلي لشجرة العائلة لغرض تسهيل أي مسارات بحث مستقبلية لباقي فروع العائلة، ولا يتم نشر أي بيانات شخصية علانية بأي شكل من الأشكال.</p>
          </div>
        </section>

        <section id="copyright" className="bg-white p-8 rounded-3xl border border-brand-100">
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-6">حقوق الطبع والنشر وإخلاء المسؤولية</h2>
          <div className="prose prose-brand text-brand-800 leading-relaxed font-light">
             <p>جميع حقوق الطبع والنشر المتعلقة بالتصاميم والزخارف والنماذج الفنية لكتاب "سجل تراث العائلة" محفوظة لمنصتنا. لا يحق للعميل إعادة طباعة التصميم في مطابع خارجية دون إذن كتابي مسبق. السجل المطبوع هو ملك للعميل ولكن القالب الفني ملك للمنصة.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
