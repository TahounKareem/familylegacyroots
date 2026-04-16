import { Link } from "react-router";
import { Menu, X, BookOpen, User } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAppStore();

  const navLinks = [
    { text: "الرئيسية", path: "/" },
    { text: "عن سجلنا", path: "/about" },
    { text: "خدماتنا", path: "/services" },
    { text: "المركز المعرفي", path: "/knowledge" },
    { text: "اتصل بنا", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white group-hover:bg-brand-700 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold text-brand-900 tracking-tight">سجل تراث العائلة</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="text-brand-800 hover:text-brand-600 font-medium transition"
              >
                {link.text}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-brand-800 hover:text-brand-600 font-medium transition">
                  <User className="w-4 h-4" />
                  لوحة التحكم
                </Link>
                <button onClick={logout} className="text-sm text-red-600 hover:underline">
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-brand-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-brand-700 transition">
                ابدأ رحلتك
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-800">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-50 border-b border-brand-200 py-4 px-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="block text-brand-800 font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.text}
            </Link>
          ))}
          {currentUser ? (
            <>
              <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} className="block text-brand-800 font-medium" onClick={() => setIsOpen(false)}>لوحة التحكم</Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="block text-red-600 font-medium">تسجيل الخروج</button>
            </>
          ) : (
            <Link to="/auth" className="block text-center bg-brand-600 text-white px-6 py-3 rounded-md font-semibold" onClick={() => setIsOpen(false)}>
              ابدأ الموثوقية
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
