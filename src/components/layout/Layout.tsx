import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MessageSquare } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* Mock Zendesk / LiveChat Widget */}
      <button 
        className="fixed bottom-6 left-6 z-50 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group flex items-center justify-center"
        title="تحدث مع الدعم الفني"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
