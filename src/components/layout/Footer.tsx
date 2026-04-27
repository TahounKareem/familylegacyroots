import { Link } from "react-router";
import { BookOpen, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100 pt-16 pb-8 border-t-4 border-brand-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 text-white hover:text-brand-300 transition">
              <BookOpen className="w-8 h-8 text-brand-500" />
              <span className="font-serif text-2xl font-bold">سجل تراث العائلة</span>
            </Link>
            <p className="text-brand-300 text-sm leading-relaxed mb-6">
              نحن مؤسسة متخصصة في توثيق تاريخ وعراقة العائلات، وتقديم خدمات البحث والتدقيق في الأنساب، مع إخراج فني احترافي.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-lg text-white mb-6">روابط سريعة</h3>
            <ul className="space-y-4 text-brand-300">
              <li><Link to="/about" className="hover:text-brand-400 transition">من نحن</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition">خدماتنا</Link></li>
              <li><Link to="/knowledge" className="hover:text-brand-400 transition">المركز المعرفي</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition">تواصل معنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg text-white mb-6">الوثائق القانونية</h3>
            <ul className="space-y-4 text-brand-300">
              <li><a href="https://adam.tahoun.live/legal#agreement" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">اتفاقية الخدمة</a></li>
              <li><a href="https://adam.tahoun.live/legal#privacy" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">سياسة الخصوصية</a></li>
              <li><a href="https://adam.tahoun.live/legal#terms" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">شروط الاستخدام</a></li>
              <li><a href="https://adam.tahoun.live/legal#cookies" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">سياسة الكوكيز</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg text-white mb-6">التواصل</h3>
            <ul className="space-y-4 text-brand-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <span dir="ltr" className="text-right">30 N Gould St, STE R, Sheridan, WY 82801, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                <span>info@thefamilylegacyroots.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-brand-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-brand-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()}</span>
            <div className="bg-white/90 p-1.5 rounded-md">
              <img src="https://i.postimg.cc/87JZxTP1/Genealab.png" alt="GeneaLab LLC" className="h-4 w-auto object-contain" />
            </div>
            <span>جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
