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
    </div>
  );
}
