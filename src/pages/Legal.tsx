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

        <section id="copyright" className="bg-white p-8 md:p-12 rounded-3xl border border-brand-100 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b-2 border-brand-100 pb-4">إشعار حقوق النشر وإخلاء المسؤولية</h2>
          <div className="prose prose-brand text-brand-800 leading-relaxed font-light max-w-none">
            <p className="font-bold text-brand-900 mb-6 flex items-center gap-2">
              <span dir="ltr">© {new Date().getFullYear()}</span> 
              <span>شركة جيني لاب جميع الحقوق محفوظة.</span>
            </p>
            
            <p className="mb-8">يُعتبر هذا الكتيب “سجل تراث العائلة” عملًا إبداعيًا محميًا بموجب قوانين حقوق النشر في الولايات المتحدة الأمريكية، بما في ذلك قانون حقوق النشر لعام 1976 وقانون الألفية الرقمية لحقوق النشر DMCA لعام 1998، وأي قوانين دولية ذات صلة. تحتفظ شركة جيني لاب بحقوق النشر والملكية الفكرية في جميع جوانب الكتيب، بما في ذلك التصميم، التنظيم، التحليل، الشجرات العائلية، التقارير البحثية، والمحتوى الأصلي الذي أنتجته الشركة بناءً على البحث الجينيالوجي. لا يمكن نسخ أو إعادة إنتاج أو توزيع أو تعديل أي جزء من هذا الكتيب، سواء كليًا أو جزئيًا، بأي شكل إلكتروني أو مطبوع أو آخر، دون الحصول على إذن كتابي مسبق من شركة جيني لاب. يُحظر الاستخدام التجاري أو البيع أو النشر العام (بما في ذلك على الإنترنت أو وسائل التواصل الاجتماعي) دون موافقة صريحة.</p>

            <h3 className="font-serif text-2xl font-bold text-brand-800 mt-10 mb-4">حقوق العميل في المحتوى المقدم</h3>
            <p className="mb-4">تحتفظ أنت، كعميل، بحقوق الملكية الفكرية في أي محتوى قدمته لنا، مثل الصور العائلية، القصص الشخصية، الوثائق، أو المعلومات المتعلقة بأشخاص أحياء أو متوفين. بتقديم هذا المحتوى، تمنح شركة جيني لاب ترخيصًا غير حصري، خاليًا من الرسوم، دائمًا، لاستخدامه في إعداد هذا الكتيب وأي خدمات ذات صلة، بما في ذلك تخزينه ومعالجته لأغراض البحث الجينيالوجي. ومع ذلك، تظل ملكيتك لهذا المحتوى قائمة، ولا تمنح الشركة أي حقوق إضافية لاستخدامه خارج نطاق الخدمة المقدمة دون موافقتك الكتابية.</p>

            <p className="mb-8">بالنسبة للمعلومات المتعلقة بأشخاص أحياء، يجب عليك التأكد من الحصول على موافقتهم الصريحة قبل تقديم أي بيانات شخصية (مثل الأسماء، التواريخ، أو التفاصيل الحساسة) لنا. تحتفظ شركة جيني لاب بحق عدم تضمين أي معلومات قد تنتهك خصوصية الأفراد أو قوانين الخصوصية المعمول بها، مثل قانون خصوصية المستهلك في كاليفورنيا CCPA أو اللائحة العامة لحماية البيانات GDPR إذا كان ذلك ذا صلة. أنت مسؤول عن أي انتهاكات ناتجة عن تقديم معلومات غير مصرح بها.</p>

            <h3 className="font-serif text-2xl font-bold text-brand-800 mt-10 mb-4">الترخيص الممنوح للعميل</h3>
            <p className="mb-4">تمنح شركة جيني لاب لك، كعميل، ترخيصًا محدودًا، غير قابل للنقل، غير حصري، لاستخدام الكتيب لأغراض شخصية وعائلية فقط. يشمل ذلك:</p>
            <ul className="list-disc pr-6 mt-2 mb-6 space-y-2 marker:text-brand-500">
              <li>مشاركة الكتيب مع أفراد العائلة المباشرين.</li>
              <li>طباعة نسخ إضافية للاستخدام الشخصي (غير التجاري).</li>
              <li>استخدامه في بحث تاريخ العائلة الشخصي أو المهني غير التجاري.</li>
            </ul>
            <p className="mb-8">لا يشمل هذا الترخيص أي استخدام تجاري، مثل البيع، التوزيع العام، النشر على الإنترنت، أو دمجه في منتجات أخرى دون إذن كتابي. كما يُحظر استخدام أي مواد من قواعد بيانات الشركة (مثل الوثائق التاريخية أو السجلات) خارج نطاق هذا الكتيب دون الامتثال لشروط الخدمة الخاصة بنا. في حالة أي انتهاك، تحتفظ الشركة بحق اتخاذ الإجراءات القانونية، بما في ذلك تقديم إشعار إزالة بموجب DMCA إذا كان الانتهاك رقميًا.</p>

            <h3 className="font-serif text-2xl font-bold text-brand-800 mt-10 mb-4">إخلاء المسؤولية</h3>
            <p className="mb-4">يُقدم هذا الكتيب بناءً على البحث المتاح والمعلومات المقدمة من قبلك. على الرغم من بذلنا قصارى جهدنا لضمان الدقة، إلا أن أبحاث الأنساب ليست علمًا دقيقًا، وقد تكون هناك أخطاء أو إغفالات ناتجة عن نقص السجلات التاريخية أو تفسيرات مختلفة. لا تقدم شركة جيني لاب أي ضمانات، صريحة أو ضمنية، بشأن دقة أو كمال أو ملاءمة المعلومات الواردة في هذا الكتيب لأي غرض معين. نرفض جميع الضمانات الضمنية المتعلقة بالتسويق أو الملاءمة لغرض معين. أنت تقر بأنك تستخدم هذا الكتيب على مسؤوليتك الخاصة، وأن شركة جيني لاب غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية ناتجة عن استخدامه.</p>
            
            <p className="mb-10">في حالة وجود أي نزاع، يخضع هذا الكتيب لقوانين ولاية وايومنغ الولايات المتحدة الأمريكية، ويتم حل النزاعات حصريًا في محاكم شيريدان. للحصول على مزيد من التفاصيل، يرجى الرجوع إلى شروط الخدمة الكاملة على موقعنا الإلكتروني أو الاتصال بنا.</p>

            <div className="mt-12 pt-8 border-t border-brand-200 flex flex-col gap-3 bg-brand-50/50 p-6 rounded-2xl">
              <strong className="text-xl font-serif text-brand-900 mb-1">شركة جيني لاب</strong>
              <span dir="ltr" className="text-right inline-block text-brand-700">30 N Gould St, STE R, Sheridan, WY 82801, USA</span>
              <a href="mailto:info@TheFamilyLegacyRoots.com" className="text-brand-600 font-medium hover:text-brand-800 transition">info@TheFamilyLegacyRoots.com</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
