import { Link } from "react-router";
import { BookOpen, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <footer className="bg-[#8E9091] text-white pt-16 pb-8 border-t-4 border-brand-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Main Info */}
          <div className="md:w-1/3">
            <Link to="/" className="flex items-center gap-2 mb-6 text-white hover:text-brand-300 transition">
              <span className="font-serif text-2xl font-bold">سجل تراث العائلة</span>
            </Link>
            <p className="text-white text-sm leading-relaxed mb-8">
              <span className="block mb-2">منصة متخصصة في توثيق عمود النسب والذاكرة العائلية</span>
              <span className="block">ضمن سجلات معرفية تجمع البحث التاريخي والإخراج الفاخر.</span>
            </p>
            {/* Social Icons matching theme, on the left side above the line */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Facebook */}
              <a href="https://www.facebook.com/TheFamilyLegacyRoots" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 hover:text-white transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/TheFamilyLegacyRoots" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 hover:text-white transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              {/* X (Twitter) */}
              <a href="https://x.com/TFamilyLegacy" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 hover:text-white transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.6 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@TheFamilyLegacyRoots" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 hover:text-white transition shadow-sm" title="TikTok">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 448 512"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 162.6 162.6v82.08A80.59 80.59 0 1 0 243.1 325.2V20.27h82.08a162.33 162.33 0 0 0 122.8 122.8v66.84z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@TheFamilyLegacyRoots" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 hover:text-white transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Menu Sections Combined & Aligned */}
          <div className="md:w-2/3 flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h3 className="font-serif text-lg text-white mb-6">استكشف المنصة</h3>
              <ul className="space-y-4 text-white">
                <li><Link to="/services" className="hover:text-brand-300 transition">سجل تراث العائلة</Link></li>
                <li><Link to="/about" className="hover:text-brand-300 transition">من نحن</Link></li>
                <li><Link to="/knowledge" className="hover:text-brand-300 transition">المركز المعرفي</Link></li>
                <li><Link to="/contact" className="hover:text-brand-300 transition">تواصل معنا</Link></li>
              </ul>
            </div>
            
            <div className="md:w-1/2 pt-0 md:pt-14">
              <ul className="space-y-4 text-white">
                <li><Link to="/faq" className="hover:text-brand-300 transition">الأسئلة الشائعة</Link></li>
                <li><Link to="/guide" className="hover:text-brand-300 transition">الدليل الإرشادي</Link></li>
                <li>
                  <button 
                    onClick={() => setLegalOpen(!legalOpen)} 
                    className="hover:text-brand-300 transition flex items-center justify-start gap-1 w-full text-right"
                  >
                    الوثائق القانونية
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${legalOpen ? "rotate-180" : ""}`} />
                  </button>
                  {legalOpen && (
                    <ul className="space-y-3 mt-3 pr-4 border-r-2 border-white/20 text-sm">
                      <li><Link to="/legal/terms" className="hover:text-brand-300 transition">شروط استخدام الموقع والمنصة</Link></li>
                      <li><Link to="/legal/privacy" className="hover:text-brand-300 transition">سياسة الخصوصية وسرية البيانات</Link></li>
                      <li><Link to="/legal/cookies" className="hover:text-brand-300 transition">سياسة ملفات تعريف الارتباط</Link></li>
                      <li><Link to="/legal/refund" className="hover:text-brand-300 transition">سياسة الإلغاء وعدم الاسترجاع</Link></li>
                      <li><Link to="/legal/payments" className="hover:text-brand-300 transition">سياسة الدفع والفوترة والمعاملات المالية</Link></li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#A0A2A3] flex flex-col items-center gap-6 text-sm text-white">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-3xl font-bold font-serif mb-4 text-white">ما لا يُوثق اليوم… قد يصبح مجرد رواية غامضة غدًا.</p>
            <div className="bg-white p-2 rounded-md mb-2 mt-4 inline-block">
              <img src="https://i.postimg.cc/cHChY5vS/Genea-Lab-Logo.jpg" alt="GeneaLab LLC" className="h-8 w-auto object-contain block" />
            </div>
            <p className="text-[#D1D5DB] text-xs">تعمل المنصة من خلال شركة جينيا لاب - الولايات المتحدة الأمريكية.</p>
            <p className="text-[#D1D5DB] text-xs mt-1">© 2026 GeneaLab LLC — جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
