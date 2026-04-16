import { FileText, Link as LinkIcon, Book } from "lucide-react";

export function KnowledgeCenter() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl font-bold text-brand-900 mb-6">المركز المعرفي ومكتبة الأنساب</h1>
        <p className="text-left text-brand-700 text-lg mx-auto text-center max-w-2xl">
          أدلة، مقالات، ومراجع تاريخية تساعدك في فهم علم الأنساب والوثائق المعتمدة في التدوين التراثي.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "كيف تقرأ المخطوطات القديمة؟", type: "مقال", icon: FileText, color: "bg-orange-50 text-orange-600" },
          { title: "أهمية توثيق شجرة العائلة", type: "دليل إرشادي", icon: Book, color: "bg-blue-50 text-blue-600" },
          { title: "الفرق بين القبيلة، الفخذ، والعشيرة", type: "مقال توضيحي", icon: FileText, color: "bg-green-50 text-green-600" },
          { title: "أساليب التحقق الجيني والمطابقة التاريخية", type: "بحث علمي", icon: LinkIcon, color: "bg-purple-50 text-purple-600" },
          { title: "كيف تحافظ على الوثائق الورقية القديمة لعائلتك", type: "دليل إرشادي", icon: Book, color: "bg-brand-100 text-brand-700" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-100 hover:shadow-lg transition-shadow group flex flex-col justify-between h-full">
            <div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2 block">{item.type}</span>
              <h3 className="font-serif text-xl font-bold text-brand-900 mb-4 leading-relaxed">{item.title}</h3>
            </div>
            <button className="text-right text-brand-600 font-medium flex items-center gap-2 group-hover:text-brand-800 transition">
              قراءة المزيد <span className="text-xl leading-none">&larr;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
