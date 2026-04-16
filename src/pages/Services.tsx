import { Link } from "react-router";

export function Services() {
  const sections = [
    {
      title: "القسم الأول: السجل العام (من إعدادكم)",
      desc: "يحتوي على: مقدمة، رسالة من عميد العائلة، النبذة التاريخية، العادات والمآثر، وتصنيف الوثائق العائلية كالصور والشهادات التاريخية.",
    },
    {
      title: "القسم الثاني: السجل النسبي (من إعداد الباحثين)",
      desc: "توثيق النسب بناءً على نقطة الانطلاق والمراجع التاريخية، مع رسم مشجر مفصل، توثيق تسلسل الأجيال والوثائق الرسمية.",
    },
    {
      title: "القسم الثالث: الملحقات والتحديثات",
      desc: "تخصيص صفحات للتحديثات المستمرة، المواليد الجدد، وقوائم التعديلات والتصويبات اللاحقة لضمان ديمومة السجل.",
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-brand-950 text-white py-24 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6">قيمة ما نُقدمه</h1>
        <p className="text-xl text-brand-200 max-w-2xl mx-auto leading-relaxed">
          نقدم خدمة توثيقية متكاملة تنتهي بإصدار مجلد فني مطبوع يسرد قصة عائلتكم بدقة وعناية، ليكون مرجعاً موثوقاً تتوارثه الأجيال.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-brand-100 flex flex-col gap-12">
          {sections.map((sec, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="text-6xl font-serif text-brand-200 font-bold leading-none">0{idx + 1}</div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-900 mb-4">{sec.title}</h2>
                <p className="text-brand-700 leading-relaxed text-lg">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-brand-900 mb-10">تفاصيل الباقات التسعيرية</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-brand-200 bg-white rounded-3xl p-10 hover:shadow-lg transition">
            <h3 className="text-2xl font-serif font-bold text-brand-900 mb-2">المسار العادي</h3>
            <p className="text-brand-500 mb-6">مناسب للاحتياجات المعتمدة بدون استعجال</p>
            <div className="text-4xl font-bold text-brand-700 mb-8 font-mono">$2000</div>
            <ul className="text-right space-y-4 text-brand-700 mb-10 border-t border-brand-100 pt-6">
              <li>✓ توثيق ومراجعة شاملة</li>
              <li>✓ رسم شجرة العائلة</li>
              <li>✓ مدة الإنجاز: شهر واحد</li>
              <li>✓ النسخة الأساسية: رقمية (PDF)</li>
              <li>✓ الطباعة: اختيارية بتكلفة إضافية لاحقاً</li>
            </ul>
            <Link to="/order" className="block w-full bg-brand-100 text-brand-800 hover:bg-brand-200 text-center py-3 rounded-md font-semibold transition">اختيار المسار</Link>
          </div>

          <div className="border-2 border-brand-600 bg-brand-50 rounded-3xl p-10 hover:shadow-lg transition relative overflow-hidden">
            <div className="absolute top-6 -left-10 bg-brand-600 text-white py-1 px-12 -rotate-45 text-sm font-bold">المسار الذهبي</div>
            <h3 className="text-2xl font-serif font-bold text-brand-900 mb-2">المسار السريع</h3>
            <p className="text-brand-500 mb-6">أولوية قصوى وفريق مخصص للمشروع</p>
            <div className="text-4xl font-bold text-brand-700 mb-8 font-mono">$4000</div>
            <ul className="text-right space-y-4 text-brand-700 mb-10 border-t border-brand-200 pt-6">
              <li>✓ جميع ميزات المسار العادي</li>
              <li>✓ أولوية التواصل والاعتماد</li>
              <li>✓ مدة الإنجاز: أسبوع واحد</li>
              <li>✓ مكالمتان لمراجعة التفاصيل تاريخياً</li>
              <li>✓ الطباعة: اختيارية بتكلفة إضافية لاحقاً</li>
            </ul>
            <Link to="/order" className="block w-full bg-brand-600 text-white hover:bg-brand-700 text-center py-3 rounded-md font-semibold transition shadow-md">اختيار المسار</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
