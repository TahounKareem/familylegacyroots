import { Routes, Route } from "react-router";
import React, { useEffect, Suspense } from "react";
import { Layout } from "./components/layout/Layout";
import { useAppStore } from "./lib/store";
import { CookieBanner } from "./components/ui/CookieBanner";
import { Chatbot } from "./components/ui/Chatbot";
import { SessionManager } from "./components/ui/SessionManager";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { Loader2 } from "lucide-react";
import { MotionConfig } from "motion/react";

// Lazy Loaded Pages
const Home = React.lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const About = React.lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Services = React.lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const KnowledgeCenter = React.lazy(() => import("./pages/KnowledgeCenter").then(m => ({ default: m.KnowledgeCenter })));
const FAQ = React.lazy(() => import("./pages/FAQ").then(m => ({ default: m.FAQ })));
const HelpCenter = React.lazy(() => import("./pages/HelpCenter").then(m => ({ default: m.HelpCenter })));
const Contact = React.lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Auth = React.lazy(() => import("./pages/Auth").then(m => ({ default: m.Auth })));
const AdminAuth = React.lazy(() => import("./pages/AdminAuth").then(m => ({ default: m.AdminAuth })));
const Dashboard = React.lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const OrderFlow = React.lazy(() => import("./pages/OrderFlow").then(m => ({ default: m.OrderFlow })));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const Legal = React.lazy(() => import("./pages/Legal").then(m => ({ default: m.Legal })));
const ShippingDetails = React.lazy(() => import("./pages/ShippingDetails").then(m => ({ default: m.ShippingDetails })));
const ServiceAgreement = React.lazy(() => import("./pages/ServiceAgreement").then(m => ({ default: m.ServiceAgreement })));
const ESignature = React.lazy(() => import("./pages/ESignature").then(m => ({ default: m.ESignature })));
const ESignatureSuccess = React.lazy(() => import("./pages/ESignatureSuccess").then(m => ({ default: m.ESignatureSuccess })));
const MockSignature = React.lazy(() => import("./pages/MockSignature").then(m => ({ default: m.MockSignature })));

// Loading Component
const PageLoading = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
  </div>
);

export default function App() {
  const initializeFirebase = useAppStore(state => state.initializeFirebase);
  const isAuthReady = useAppStore(state => state.isAuthReady);

  useEffect(() => {
    initializeFirebase();
  }, [initializeFirebase]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-brand-600 font-bold text-xl animate-pulse flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" /> جاري تحميل النظام...
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/knowledge" element={<KnowledgeCenter />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/guide" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/:documentId" element={<Legal />} />
          </Route>
          
          <Route path="/auth" element={<Auth />} />
          <Route path="/Team" element={<AdminAuth />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order" element={<OrderFlow />} />
          <Route path="/shipping-details" element={<ShippingDetails />} />
          <Route path="/service-agreement" element={<ServiceAgreement />} />
          <Route path="/e-signature" element={<ESignature />} />
          <Route path="/e-signature-success" element={<ESignatureSuccess />} />
          <Route path="/mock-signature" element={<MockSignature />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
      <CookieBanner />
      <SessionManager />
      <Chatbot />
    </MotionConfig>
  );
}
