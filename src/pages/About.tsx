import { BookOpen, Milestone, Users, Archive, Library, Palette, Waypoints, Handshake } from "lucide-react";

export function About() {
  return (
    <div className="bg-brand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-serif text-5xl font-bold text-brand-900 mb-8 text-center">قصتنا ورسالتنا</h1>
        
        <p className="text-xl text-brand-800 leading-loose mb-16 text-center font-light">
          نؤمن بأن "من لا ماضي له، لا حاضر ولا مستقبل له". تأسس مشروع <b>سجل تراث العائلة</b> من شغف عميق بتوثيق الأنساب العربية بطريقة علمية موثقة، وإخراجها في قالب فني يليق بمقام وتاريخ عائلتكم.
        </p>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-brand-100 mb-16">
          <h2 className="font-serif text-3xl text-brand-900 mb-6 border-b border-brand-200 pb-4">رؤيتنا</h2>
          <p className="text-brand-700 leading-relaxed text-lg">
            أن نكون المرجع الرقمي والتوثيقي الأول لحفظ تراث العائلات في العالم العربي، ونوفر منصة تجمع بين عراقة الماضي وتقنيات المستقبل، لربط الأجيال الشابة بتاريخ وأمجاد أجدادهم.
          </p>
        </div>

        <h2 className="font-serif text-3xl text-brand-900 mb-10 text-center">أركان عملنا</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-brand-200 text-brand-700 flex items-center justify-center shrink-0">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-900 mb-2">البحث والتدقيق الأرشيفي</h3>
              <p className="text-brand-600 leading-relaxed">فريقنا مكون من باحثين في التاريخ والأنساب، يقومون بمراجعة الوثائق المرفقة والمصادر والمشجرات القديمة بدقة منهجية.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-brand-200 text-brand-700 flex items-center justify-center shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-900 mb-2">الإخراج الفني المتقن</h3>
              <p className="text-brand-600 leading-relaxed">نصمم السجل كتحفة فنية. من خطوط الطباعة الملكية إلى تصميم شجرة العائلة بطريقة واضحة وجميلة تسرد قصة العائلة.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-brand-200 text-brand-700 flex items-center justify-center shrink-0">
              <Waypoints className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-900 mb-2">ربط التسلل الزمني</h3>
              <p className="text-brand-600 leading-relaxed">توضيح الخط الزمني من "نقطة البداية" وصولًا لأحدث المواليد، مع ذكر النوابغ والمؤثرين من أبناء الخط التاريخي.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-brand-200 text-brand-700 flex items-center justify-center shrink-0">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-900 mb-2">منصة تعاونية</h3>
              <p className="text-brand-600 leading-relaxed">نوفر لوحة تحكم تتيح كبار العائلة التواصل معنا لإيضاح المستجدات واعتماد التصاميم قبل الطباعة والنشر.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
