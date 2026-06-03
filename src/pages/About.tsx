import React from "react";
import { BookOpen, Milestone, Users, Archive, Library, Palette, Waypoints, Handshake } from "lucide-react";

export function About() {
  return (
    <div className="bg-brand-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <div className="bg-white py-16 mb-12 shadow-sm border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-brand-900 mb-6">من نحن</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* من نحن */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">شركة متخصصة في توثيق الأنساب وتراث العائلات</h2>
          <div className="space-y-6 text-brand-800 text-lg font-light leading-relaxed">
            <p>
              “جينيا لاب” شركة متخصصة في مجال الأنساب (Genealogy) وتاريخ العائلات، تعمل على بناء سجلات عائلية موثقة تجمع بين البحث التاريخي، ودراسة عمود النسب، والإخراج الفني المعاصر، ضمن منهجية تحفظ الذاكرة العائلية للأجيال القادمة.
            </p>
          </div>
        </section>

        {/* لماذا وُجد هذا المشروع؟ */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">لماذا وُجد هذا المشروع؟</h2>
          <div className="space-y-6 text-brand-800 text-lg font-light leading-relaxed">
            <p>
              كثير من الروايات العائلية تبدأ قوية وواضحة، ثم تتفرق تفاصيلها مع الزمن، وتتحول بعض الأسماء والقصص والوثائق إلى ذاكرة شفوية معرضة للنسيان أو الاختلاف.
            </p>
            <p>
              ومن هنا جاء مشروع “سجل تراث العائلة”:<br />
              ليكون سجلًا يوثق عمود النسب والذاكرة العائلية في قالب بحثي وفني يليق بقيمة العائلة وتاريخها.
            </p>
            <p className="font-bold text-brand-900 bg-brand-50 p-6 rounded-2xl border border-brand-100 text-center italic">
              "الماضي لا يُستعاد… لكنه يُقرأ حين يُوثق."
            </p>
          </div>
        </section>

        {/* فريقنا */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">فريقنا</h2>
          <div className="space-y-6 text-brand-800 text-lg font-light leading-relaxed">
            <p>يعمل على المشروع فريق يمتلك خبرات بحثية وفنية في:</p>
            <ul className="list-disc list-inside space-y-2 text-brand-700 pr-4">
              <li>توثيق الأنساب.</li>
              <li>دراسة الروايات العائلية.</li>
              <li>مراجعة الوثائق والمصادر.</li>
              <li>تنسيق السجلات العائلية.</li>
              <li>الإخراج الفني والتصميم.</li>
            </ul>
            <p>وذلك بهدف تقديم سجل يجمع بين الدقة البحثية وجودة الإخراج.</p>
          </div>
        </section>

        {/* شبكتنا البحثية */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">شبكتنا البحثية</h2>
          <div className="space-y-6 text-brand-800 text-lg font-light leading-relaxed">
            <p>ترتبط الشركة بشبكة واسعة من:</p>
            <ul className="list-disc list-inside space-y-2 text-brand-700 pr-4">
              <li>الباحثين الأكاديميين.</li>
              <li>والنسابين التقليديين.</li>
              <li>والمراكز البحثية.</li>
              <li>والمختبرات العلمية المتخصصة.</li>
            </ul>
            <p>في مختلف أنحاء العالم العربي ودول المهجر، بما يساعد على الوصول إلى مصادر متنوعة تخدم أعمال التوثيق والدراسة.</p>
          </div>
        </section>

        {/* منهجيتنا */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">منهجيتنا</h2>
          <div className="space-y-6 text-brand-800 text-lg font-light leading-relaxed">
            <p>نعتمد في أعمالنا على:</p>
            <ul className="list-disc list-inside space-y-2 text-brand-700 pr-4">
              <li>مراجعة الروايات العائلية.</li>
              <li>والوثائق والمصادر المتاحة.</li>
              <li>وقواعد البيانات المتخصصة.</li>
              <li>والربط المنهجي بين طبقات النسب.</li>
            </ul>
            <p>وذلك ضمن منهجية بحثية تهدف إلى بناء سجل عائلي موثق ومتوازن، يراعي أصول التوثيق ودقة العرض.</p>
          </div>
        </section>

        {/* رسالتنا */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">رسالتنا</h2>
          <p className="text-brand-800 text-lg font-light leading-relaxed">
            نسعى إلى حفظ الذاكرة العائلية العربية عبر توثيق عمود النسب والروايات والوثائق المرتبطة به، وتقديمها في سجل يجمع بين البحث التاريخي والإخراج الفني، بما يساعد العائلات على قراءة امتدادها التاريخي بصورة واضحة ومنظمة.
          </p>
        </section>

        {/* رؤيتنا */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">رؤيتنا</h2>
          <p className="text-brand-800 text-lg font-light leading-relaxed">
            أن نساهم في بناء تجربة توثيق عائلي حديثة تحفظ تراث العائلات العربية، وتربط الأجيال الجديدة بتاريخها وهويتها، من خلال منصة تجمع بين المعرفة البحثية والتقنيات المعاصرة.
          </p>
        </section>

        {/* ماذا نقدم */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-10 border-b border-brand-100 pb-4">ماذا نقدم</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Library className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">البحث والتوثيق</h3>
                <p className="text-brand-700 leading-relaxed font-light">نعمل على مراجعة الروايات والوثائق والمصادر المتخصصة، وبناء دراسة متدرجة لعمود النسب وفق منهجية بحثية دقيقة تساعد على تقديم سجل موثق ومتوازن.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Waypoints className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">توثيق عمود النسب</h3>
                <p className="text-brand-700 leading-relaxed font-light">يرتكز المشروع على دراسة وتوثيق عمود النسب الصاعد للعميل/أمين السجل، وربطه بطبقات النسب المعروفة والمصادر المتاحة، بهدف بناء أصل نسبي واضح يمثل العمود الفقري للسجل.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Archive className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">سجل عائلي متكامل</h3>
                <p className="text-brand-700 leading-relaxed font-light">لا يقتصر العمل على الأسماء والتشجير فقط، بل يشمل تنظيم الروايات والصور والوثائق والمواد العائلية ضمن سجل واحد يقدم تاريخ العائلة بصورة مترابطة ومنظمة.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">التصميم والإخراج الفني</h3>
                <p className="text-brand-700 leading-relaxed font-light">يتم تصميم “سجل تراث العائلة” بأسلوب بصري يجمع بين الطابع الوثائقي والهوية الفنية الراقية، بدءًا من تنسيق الصفحات والخطوط وحتى تصميم مشجرات عمود النسب والمحتوى البصري للسجل.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start md:col-span-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Handshake className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">منصة إدارة السجل</h3>
                <div className="text-brand-700 leading-relaxed font-light">
                  <p>نوفر منصة خاصة تتيح للعميل/أمين السجل:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>متابعة مراحل العمل.</li>
                    <li>رفع الوثائق والمواد.</li>
                    <li>إدارة الإدراجات العائلية.</li>
                    <li>التواصل مع فريق العمل.</li>
                    <li>مراجعة واعتماد البيانات والمخرجات.</li>
                  </ul>
                  <p className="mt-2">وذلك ضمن بيئة منظمة تحفظ خصوصية المشروع واستقرار مسار التوثيق.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
