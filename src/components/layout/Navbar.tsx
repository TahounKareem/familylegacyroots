import { Link, useLocation } from "react-router";
import { Menu, X, BookOpen, User } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAppStore();
  const location = useLocation();

  const navLinks = [
    { text: "الرئيسية", path: "/" },
    { text: "سجل تراث العائلة", path: "/services" },
    { text: "من نحن", path: "/about" },
    { text: "المركز المعرفي", path: "/knowledge" },
    { text: "مركز التواصل والدعم", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-3 group">
            <img src="https://i.postimg.cc/KvK4Lspq/Segel-Logo.png" alt="سجل تراث العائلة" className="h-14 w-auto object-contain drop-shadow-sm" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`font-serif transition text-sm ${isActive ? 'text-[#C3262A] font-bold border-b-2 border-[#C3262A] pb-1' : 'text-[#8E9091] hover:text-[#C3262A] font-medium'}`}
                >
                  {link.text}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to={currentUser.role === 'user' ? '/dashboard' : '/admin'} className="flex items-center gap-2 text-[#8E9091] hover:text-[#C3262A] font-serif font-medium transition text-sm">
                  <User className="w-4 h-4" />
                  لوحة التحكم
                </Link>
                <button onClick={() => { logout(); window.location.href = '/auth'; }} className="text-[#8E9091] hover:text-[#C3262A] font-serif font-medium transition text-sm">
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-[#8E9091] hover:text-[#C3262A] font-serif font-medium transition text-sm">
                تسجيل الدخول / إنشاء حساب
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
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`block font-serif ${isActive ? 'text-[#C3262A] font-bold border-r-4 border-[#C3262A] pr-2' : 'text-brand-800 font-medium'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            );
          })}
          {currentUser ? (
            <>
              <Link to={currentUser.role === 'user' ? '/dashboard' : '/admin'} className="block text-brand-800 font-serif font-medium" onClick={() => setIsOpen(false)}>لوحة التحكم</Link>
              <button onClick={() => { logout(); window.location.href = '/auth'; setIsOpen(false); }} className="block text-brand-800 hover:text-red-600 font-serif font-medium">تسجيل الخروج</button>
            </>
          ) : (
            <Link to="/auth" className="block text-brand-800 font-serif font-medium" onClick={() => setIsOpen(false)}>
              تسجيل الدخول / إنشاء حساب
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
