import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { KnowledgeCenter } from "./pages/KnowledgeCenter";
import { Contact } from "./pages/Contact";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { OrderFlow } from "./pages/OrderFlow";
import { AdminPanel } from "./pages/AdminPanel";
import { Legal } from "./pages/Legal";
import { useAppStore } from "./lib/store";
import { CookieBanner } from "./components/ui/CookieBanner";
import { Chatbot } from "./components/ui/Chatbot";

export default function App() {
  const initializeFirebase = useAppStore(state => state.initializeFirebase);
  const isAuthReady = useAppStore(state => state.isAuthReady);

  useEffect(() => {
    initializeFirebase();
  }, [initializeFirebase]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-brand-600 font-bold text-xl animate-pulse">جاري تحميل النظام...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/knowledge" element={<KnowledgeCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
        </Route>
        
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<OrderFlow />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <CookieBanner />
      <Chatbot />
    </>
  );
}
