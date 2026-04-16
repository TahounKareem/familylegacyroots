export function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-brand-100 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold text-brand-900 mb-6">تواصل معنا</h1>
          <p className="text-brand-600 mb-8 leading-relaxed">
            نسعد بالرد على استفساراتكم بخصوص توثيق السجلات، الشراكات، أو طلبات الدعم الخاصة بإدارة حساباتكم.
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">الاسم الكامل</label>
              <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-brand-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">البريد الإلكتروني</label>
              <input type="email" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-brand-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">الرسالة</label>
              <textarea rows={5} className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-brand-50"></textarea>
            </div>
            <button className="bg-brand-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-brand-700 transition">إرسال الرسالة</button>
          </form>
        </div>

        <div className="md:w-1/3 bg-brand-950 text-white rounded-3xl p-8 h-fit">
          <h3 className="font-serif text-xl mb-6">معلومات الاتصال المباشر</h3>
          <div className="space-y-6 text-sm text-brand-200">
             <div>
               <p className="font-bold text-white mb-1">الشركة</p>
               <p>GeneaLab LLC</p>
             </div>
             <div>
               <p className="font-bold text-white mb-1">البريد الإلكتروني</p>
               <p>info@thefamilylegacyroots.com</p>
             </div>
             <div>
               <p className="font-bold text-white mb-1">العنوان</p>
               <p dir="ltr" className="text-right block">30 N Gould St, STE R<br/>Sheridan, WY 82801, USA</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
