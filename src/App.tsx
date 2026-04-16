import { Routes, Route } from "react-router";
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

export default function App() {
  return (
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
  );
}
