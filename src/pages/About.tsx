import { BookOpen, Milestone, Users, Archive, Library, Palette, Waypoints, Handshake } from "lucide-react";

export function About() {
  return (
    <div className="bg-brand-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <div className="bg-white py-16 mb-12 shadow-sm border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-brand-900 mb-6">من نحن وماذا نقدم</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* من نحن */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">من نحن</h2>
          <div className="space-y-6 text-brand-800 text-lg font-light leading-relaxed">
            <p><strong className="text-brand-900 font-semibold">شركتنا:</strong> شركة جيني لاب ، شركة متخصصة في مجال الأنساب "الجينيولوجي"، وتاريخ العائلات.</p>
            <p><strong className="text-brand-900 font-semibold">فريقنا:</strong> لدينا فريق مميز ، يملك خبرات واسعة في تنسيق وتقديم خدمات بحثية و نشر فني مميز.</p>
            <p><strong className="text-brand-900 font-semibold">شبكتنا:</strong> ترتبط شركتنا بعلاقات واسعة مع مختبرات علمية ومراكز بحوث ، وباحثين أكاديميين و نسابين تقليديين من جميع انحاء العالم العربي ودول المهجر.</p>
            <p><strong className="text-brand-900 font-semibold">بياناتنا:</strong> لدينا امتيازات وصول الى عدة قواعد بيانات عن الأنساب تتيح لنا تنسيق وتقديم خدمات بحث علمية أصيلة وموثوقة .</p>
          </div>
        </section>

        {/* رسالتنا */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">رسالتنا</h2>
          <p className="text-brand-800 text-lg font-light leading-relaxed">
            نؤمن بأن "الماضي لايُستعاد ، لكنه يُقرأ حين يُوثق" . يقوم مشروع "سجل تراث العائلة" البحثي على شغف عميق بتوثيق الأنساب العربية بطريقة علمية موثقة ، وإخراجها في قالب فني يليق بمقام وتاريخ العائلة.
          </p>
        </section>

        {/* رؤيتنا */}
        <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-brand-100">
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-8 border-b border-brand-100 pb-4">رؤيتنا</h2>
          <p className="text-brand-800 text-lg font-light leading-relaxed">
            أن نكون المرجع البحثي والتوثيقي الأول لحفظ تراث العائلات في العالم العربي، ونوفر منصة رقمية تجمع بين عراقة الماضي وتقنيات المستقبل، لربط الأجيال الشابة بتاريخ وأمجاد أجدادهم.
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
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">البحث العلمي</h3>
                <p className="text-brand-700 leading-relaxed font-light">نبحث في قواعد البيانات المتخصصة والمصادر المموثوقة ، كما نقوم بمراجعة رواياتكم النسبية ووثائقكم المرفقة بدقة منهجية لتقديم سجلات تراث موثوقة.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Waypoints className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">توثيق الأصل / عمود النسب</h3>
                <p className="text-brand-700 leading-relaxed font-light">نقوم بتوثيق الأصل العائلي وكذلك عمود نسبكم وتحديد نقطة الالتقاء النسبي مع طبقات النسب المعروفة والموثقة من أجل ابراز اصل الإنتساب ولتكون العمود الفقري لسجل تراث عائلتكم .</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">الإخراج الفني الأنيق</h3>
                <p className="text-brand-700 leading-relaxed font-light">نصمم سجل تراث عائلتكم كتحفة فنية. من خطوط الطباعة الراقية إلى تصميم مشجر عمود الأنتساب بطريقة واضحة وجميلة تسرد قصة عائلتكم .</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Handshake className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">منصة تعاونية</h3>
                <p className="text-brand-700 leading-relaxed font-light">نوفر لوحة تحكم سهلة تتيح لكم التواصل معنا لتبادل البيانات التي تخدم بناء سجل تراث عائلتكم وتوثيق تاريخ عائلتكم.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
