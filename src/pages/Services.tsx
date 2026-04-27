import { Link } from "react-router";

export function Services() {
  const sections = [
    {
      title: "القسم الأول: السجل العام (تحت إشرافكم)",
      desc: "يحتوي على: مقدمة، رسالة من العميل، النبذة التاريخية عن العائلة، العادات والمآثر، وتصنيف الوثائق العائلية كالصور والشهادات التاريخية.",
    },
    {
      title: "القسم الثاني: السجل النسبي (من إعداد الباحثين)",
      desc: "توثيق النسب بناءً على نقطة الانطلاق والمراجع التاريخية، مع رسم مشجرة شاملة لنسب الأحياء، والنسب العالي للعائلة.",
    },
    {
      title: "القسم الثالث: الملحقات والربط التقني",
      desc: "نظام التحديثات المستمرة وربط السجل تاريخياً برمز استجابة سريع (QR Code) لتسهيل طباعة المخطوطات والوثائق من قبلكم بكل سهولة.",
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-brand-950 text-white py-24 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6">قيمة ما نُقدمه</h1>
        <p className="text-xl text-brand-200 max-w-2xl mx-auto leading-relaxed">
          نقدم خدمة توثيقية متكاملة تنتهي بإصدار سجل رقمي فني متقن يسرد قصة عائلتكم بدقة وعناية، ليكون مرجعاً موثوقاً تتوارثه الأجيال.
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-brand-900 mb-10">باقة توثيق السجل العائلي</h2>
        <div className="border border-brand-200 bg-white rounded-3xl p-10 hover:shadow-lg transition">
          <h3 className="text-2xl font-serif font-bold text-brand-900 mb-2">الباقة الرقمية الشاملة</h3>
          <p className="text-brand-500 mb-6">توثيق منهجي دقيق مع مشجرة متكاملة</p>
          <div className="text-4xl font-bold text-brand-700 mb-8 font-mono">$1999</div>
          <ul className="text-right space-y-4 text-brand-700 mb-10 border-t border-brand-100 pt-6">
            <li>✓ وثيقة رقمية فاخرة (بدون طباعة مطبعية)</li>
            <li>✓ مشجرة شاملة لنسب الأحياء مع أسماء الأبناء</li>
            <li>✓ رفع النسب العالي الخاص للعائلة بالمراجع المعتمدة</li>
            <li>✓ ربط تاريخي بـ QR Code مخصص لسهولة الاستعراض والطباعة من العميل</li>
            <li>✓ مدة الإنجاز والتسليم: خلال 90 يوماً (كحد أقصى)</li>
          </ul>
          <Link to="/order" className="block w-full bg-brand-600 text-white hover:bg-brand-700 text-center py-4 rounded-md font-semibold transition shadow-md text-lg">بدء إجراءات التوثيق الدقيق</Link>
        </div>
      </div>
    </div>
  );
}
