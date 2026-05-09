import React, { useState, useRef, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAppStore, Message, Order, FamilyData } from "@/lib/store";
import { storage, auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Printer, Download, Settings, User, LogOut, Clock, AlertCircle, CheckCircle, FileText, UploadCloud, MessageSquare, ChevronRight, Lock, BookOpen, Paperclip, Check, MapPin, Mail, Phone, CalendarCheck, UserPlus, Compass, Telescope, Star, Play, Sparkles, Package, Image as ImageIcon, Home } from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";

export function Dashboard() {
  const { currentUser, orders, updateOrderStatus, addMessageToOrder } = useAppStore();
  const [activeTab, setActiveTab] = useState("حالة السجل");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [correctionSection, setCorrectionSection] = useState("");
  const [correctionPage, setCorrectionPage] = useState("");
  const [correctionText, setCorrectionText] = useState("");
  const [correctionError, setCorrectionError] = useState("");
  const [agreeToCorrectionTerms, setAgreeToCorrectionTerms] = useState(false);
  const [showCorrectionTerms, setShowCorrectionTerms] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  // Check for Stripe success redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const orderId = params.get("order_id");
    const isInvite = params.get("invite") === "true";

    if (success === "true" && orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order && order.status === "بانتظار الدفع") {
        updateOrderStatus(orderId, "قيد البحث");
        // Trigger email
        if (currentUser) {
          getDoc(doc(db, "users", currentUser.id)).then(userDoc => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              import("@/lib/emailService").then(({ sendOrderConfirmationEmail }) => {
                sendOrderConfirmationEmail(userData.email, userData.name || "العميل الكريم", order.orderNumber || orderId, isInvite);
              });
            }
          });
        }
        navigate("/dashboard", { replace: true });
      }
    }
  }, [location.search, orders, updateOrderStatus, navigate, currentUser]);

  if (!currentUser) return <Navigate to="/auth" />;

  const userOrders = orders.filter(o => o.userId === currentUser.id);
  const order = userOrders[0]; // ONLY 1 order allowed
  
  const isPaid = order && order.status !== "بانتظار الدفع";

  const handleResumePayment = async () => {
    if (!order) return;
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          packagePrice: 1999,
        }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("حدث خطأ.");
    }
  };

  const [pendingUpload, setPendingUpload] = useState<{file: File, arrayName: "documents"|"photos"} | null>(null);
  const [mediaMeta, setMediaMeta] = useState({ title: "", kind: "", description: "", purpose: "إضافة لسجل تراث العائلة", isCover: false });

  const updateSpecificData = async (updates: Partial<FamilyData>) => {
    if (!order) return;
    const newData = { ...order.data, ...updates };
    useAppStore.setState(s => ({
      orders: s.orders.map(o => o.id === order.id ? { ...o, data: newData } : o)
    }));
    await updateDoc(doc(db, "orders", order.id), { data: newData });
  };

  const uploadFileAndUpdate = (file: File, type: "documents" | "photos") => {
    setPendingUpload({ file, arrayName: type });
    setMediaMeta({ title: "", kind: "", description: "", purpose: "إضافة لسجل تراث العائلة", isCover: false });
  };

  const confirmUpload = () => {
    if (!pendingUpload || !order) return;
    setIsUploading(true);
    const storageRef = ref(storage, `${pendingUpload.arrayName}/${Date.now()}_${pendingUpload.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, pendingUpload.file);

    uploadTask.on('state_changed', null, 
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
        alert("فشل رفع الملف.");
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const currentArr = order.data[pendingUpload.arrayName] || [];
        await updateSpecificData({ [pendingUpload.arrayName]: [...currentArr, { url: downloadURL, ...mediaMeta }] });
        setIsUploading(false);
        setPendingUpload(null);
      }
    );
  };

  const handleSendCorrection = () => {
    if (!order || !correctionText.trim() || !correctionError.trim() || !correctionSection || !correctionPage || !agreeToCorrectionTerms) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "user",
      text: `طلب تصويب - القسم: ${correctionSection}\nالصفحة: ${correctionPage}\n\nالخطأ المزعوم:\n${correctionError}\n\nالتصويب المقترح:\n${correctionText}`,
      createdAt: new Date().toISOString()
    };
    addMessageToOrder(order.id, newMessage, "رسالة جديدة");
    setCorrectionText("");
    setCorrectionError("");
    setCorrectionPage("");
    setCorrectionSection("");
    setAgreeToCorrectionTerms(false);
    setShowCorrectionTerms(false);
    alert("تم إرسال طلب التصويب بنجاح. سيقوم فريق البحث بمراجعته.");
  };

  const handleSendReply = () => {
    if (!order || (!replyText.trim() && replyAttachments.length === 0)) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "user",
      text: replyText,
      attachments: replyAttachments,
      createdAt: new Date().toISOString()
    };
    addMessageToOrder(order.id, newMessage, "تم الرد");
    setReplyText("");
    setReplyAttachments([]);
  };

  const calculateDeliveryDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 90);
    return date.toLocaleDateString("ar-SA");
  };

  const InfoTooltip = ({ text }: { text: string }) => (
    <div className="relative group inline-flex items-center justify-center mr-2 z-50 align-middle">
      <div className="w-5 h-5 rounded-full bg-brand-200 text-brand-700 font-bold text-xs flex items-center justify-center cursor-help">i</div>
      <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-64 bg-brand-50 border border-brand-200 text-brand-800 text-xs rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none z-50">
        {text}
      </div>
    </div>
  );

  const SidebarItem = ({ title, isActive, isLocked, info, badge }: { title: string, isActive: boolean, isLocked?: boolean, info?: string, badge?: number }) => (
    <button 
      disabled={isLocked && title !== "حالة السجل"}
      onClick={() => setActiveTab(title)}
      className={`w-full text-right px-4 py-2.5 rounded-xl transition flex items-center justify-between group/btn relative
        ${isLocked && title !== "حالة السجل" ? "opacity-50 cursor-not-allowed" : ""}
        ${isActive ? "bg-brand-100 text-brand-900 font-bold" : "text-brand-700 hover:bg-brand-50"}`}
    >
      <div className="flex items-center">
        <span>{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="mr-2 bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-pulse">{badge}</span>
        )}
        {info && (
          <div className="relative group/tooltip inline-flex items-center justify-center mr-2 z-50">
            <div className="w-4 h-4 rounded-full bg-brand-200 text-brand-600 font-bold text-[10px] flex items-center justify-center cursor-help transition-colors hover:bg-brand-300">i</div>
            <div className="absolute bottom-full mb-2 right-0 w-60 bg-brand-50 border border-brand-200 text-brand-800 font-normal text-xs rounded-xl p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none z-50">
              {info}
            </div>
          </div>
        )}
      </div>
      {isLocked && title !== "حالة السجل" && <Lock className="w-4 h-4 text-brand-400 group-hover/btn:text-brand-500" />}
    </button>
  );

  const totalAdminMessagesUnread = order?.messages?.filter(m => m.senderRole === "admin" && !m.isRead).length || 0;

  useEffect(() => {
    if (activeTab === "رسائل فريق البحث" && totalAdminMessagesUnread > 0 && order) {
      useAppStore.getState().markMessagesAsRead(order.id, "user");
    }
  }, [activeTab, totalAdminMessagesUnread, order]);

  return (
    <div className="bg-brand-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Greeting */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand-100 mb-8 flex justify-between items-center relative z-[60]">
          <div className="flex flex-col md:flex-row items-center gap-4 relative">
             <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-14 h-14 rounded-full bg-brand-100 border border-brand-200 shadow-sm flex items-center justify-center text-brand-600 font-bold text-2xl hover:bg-brand-200 transition shrink-0 uppercase">
               {currentUser.name?.charAt(0) || "U"}
             </button>
             <div className="text-center md:text-right flex flex-col items-center md:items-start gap-1">
                <h1 className="text-2xl font-bold font-serif text-brand-900 leading-tight">أهلاً بك، {currentUser.name}</h1>
                <p className="text-sm text-brand-600 font-mono inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {currentUser.email}</p>
                {order && <span className="mt-1 px-3 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-mono border border-brand-200 shadow-sm shrink-0">رقم الطلب: #{order.orderNumber || order.id.toUpperCase()}</span>}
             </div>
             
             {showProfileMenu && (
               <>
                 <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)}></div>
                 <div className="absolute top-16 right-0 md:right-1/2 md:translate-x-12 w-64 bg-white rounded-2xl shadow-xl border border-brand-100 overflow-hidden py-2 z-40 animate-in fade-in slide-in-from-top-2">
                   <button onClick={() => { setActiveTab("الملف الشخصي"); setShowProfileMenu(false); }} className="w-full text-right px-4 py-3 text-sm hover:bg-brand-50 text-brand-700 font-semibold flex items-center gap-3"><User className="w-4 h-4 text-brand-500" /> الملف الشخصي</button>
                   <button onClick={() => { setActiveTab("إعدادات"); setShowProfileMenu(false); }} className="w-full text-right px-4 py-3 text-sm hover:bg-brand-50 text-brand-700 font-semibold flex items-center gap-3"><Settings className="w-4 h-4 text-brand-500" /> إعدادات</button>
                   <button onClick={() => { setActiveTab("عقد تسجيل الخدمة"); setShowProfileMenu(false); }} className="w-full text-right px-4 py-3 text-sm hover:bg-brand-50 text-brand-700 font-semibold flex items-center gap-3"><FileText className="w-4 h-4 text-brand-500" /> عقد تسجيل الخدمة</button>
                   <div className="border-t border-brand-100 my-1"></div>
                   <button onClick={async () => { await signOut(auth); useAppStore.getState().logout(); window.location.href = '/auth'; }} className="w-full text-right px-4 py-3 text-sm hover:bg-red-50 text-red-600 font-semibold flex items-center gap-3"><LogOut className="w-4 h-4" /> تسجيل الخروج</button>
                 </div>
               </>
             )}
          </div>
          <div className="flex gap-4">
             {!order && (
               <Link to="/order" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 shadow-sm transition">
                 إنشاء سجل وتوثيق نسب
               </Link>
             )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-100 sticky top-8 z-50">
              
              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">البوابة الرئيسية</h3>
                <div className="space-y-1">
                  <SidebarItem title="حالة السجل" isActive={activeTab === "حالة السجل"} />
                  <SidebarItem title="بيانات أمين السجل/العميل" isActive={activeTab === "بيانات أمين السجل/العميل"} isLocked={!isPaid} />
                  <SidebarItem title="نقطة بدء عمود النسب" isActive={activeTab === "نقطة بدء عمود النسب"} isLocked={!isPaid} />
                  <SidebarItem title="قالب التصميم المختار" isActive={activeTab === "قالب التصميم المختار"} isLocked={!isPaid} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4 flex items-center">
                  بيانات "الإدراج الإختياري"
                  <div className="relative group/tooltip inline-flex items-center justify-center mr-2 z-50">
                    <div className="w-4 h-4 rounded-full bg-brand-100 text-brand-500 font-bold text-[10px] flex items-center justify-center cursor-help">i</div>
                    <div className="absolute bottom-full mb-2 right-0 w-64 bg-brand-50 border border-brand-200 text-brand-800 font-normal text-xs rounded-xl p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none normal-case z-50">
                      هذا هو القسم الإختياري الذي يقدمه (أمين السجل / العميل) – عند رغبته – ليكون أحد أقسام السجل الأساسي ويسمى هذا القسم (بين يدي السجل ) من أجل جعل السجل أكثر خصوصية للعائلة والذي قد يشمل على سبيل المثال مايلي: ( كلمة لأمين السجل / العميل - نبذة تاريخية عن العائلة - مشجر الأحياء من العائلة والأسلاف ضمن عمود النسب ).
                    </div>
                  </div>
                </h3>
                <div className="space-y-1">
                  <SidebarItem title="نبذة وكلمة عن العائلة" isActive={activeTab === "نبذة وكلمة عن العائلة"} isLocked={!isPaid} info="اكتب – اذا رغبت - ماتتذكره من قصص الأجداد ومآثرهم ، كما يمكنك ان تكتب على سبيل المثال عن ؛ ،موطن العائلة الأصلي ، هجرة العائلة ، ابرز شخصيات العائلة ، (سيتم إدراجها في القسمالمسمى &#34;بين يدي السجل&#34; وهو القسم الخاص الذي يقع تحت اشرافكم)" />
                  <SidebarItem title="إدراج مشجر الأحياء" isActive={activeTab === "إدراج مشجر الأحياء"} isLocked={!isPaid} info="مشجر للأحياء من العائلة والأسلاف ضمن عمود النسب : ويقصد بها المشجرة التي يقوم (امين السجل / العميل ) بإدراجها عبر المنصة ، وينحصر التشجير في ذرية أمين السجل /العميل أو والده أو الجد المباشر فقط ولايشمل تشجير ذرية الأعمام ." />
                  <SidebarItem title="إدراج وثائق" isActive={activeTab === "إدراج وثائق"} isLocked={!isPaid} info="الوثائق : يمكن ادراج اي وثائق يرغب أمين السجل / العميل في ادراجها، مثل مشجرات تقليدية – شهادات – وثائق اثبات شخصية قديمة –وثائق وزاج – ولادة - وثائق صادرة من المحاكم الشرعية فيها معلومات عن العائلة او الأسلاف ..الخ ، ملحوظة : يتعين أن تكون الوثائق المدرجة ذات علاقة بالسجل ويتم إدراجها على مسؤلية أمين السجل / العميل الخاصة ، كما هو منصوص عليه في عقد تقديم الخدمة ." />
                  <SidebarItem title="إدراج صور" isActive={activeTab === "إدراج صور"} isLocked={!isPaid} info="الصور : يمكن لأمين السجل /العميل إدراج صور لأفراد العائلة مثل ( صور الأشخاص المدرجين ضمن مشجر الأحياء ، او صور بقية الأشخاص في عمود النسب الصاعد فقط . ملحوظة : يتعين أن تكون الصور المدرجة ذات علاقة بالسجل ويتم إدراجها على مسؤلية أمين السجل / العميل الخاصة ، كما هو منصوص عليه في عقد تقديم الخدمة ." />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">التواصل والتحديثات</h3>
                <div className="space-y-1">
                  <SidebarItem title="رسائل فريق البحث" isActive={activeTab === "رسائل فريق البحث"} isLocked={!isPaid} info="عند وجود استفسار من فريق البحث ستظهر لك رسالة طلب ايضاح من قبلهم ، بحيث ستتمكن من الرد على الإستفسار بسهولة وخصوصية وأمان ." badge={totalAdminMessagesUnread} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">ابق سجلك حياً</h3>
                <div className="space-y-1">
                  <SidebarItem title="النسخة الرقمية للسجل" isActive={activeTab === "النسخة الرقمية للسجل"} isLocked={!isPaid} />
                  <SidebarItem title="بوستر مشجر عمود النسب" isActive={activeTab === "بوستر مشجر عمود النسب"} isLocked={!isPaid} />
                  <SidebarItem title="التصويبات" isActive={activeTab === "التصويبات"} isLocked={!isPaid} info="هذه الخاصية ستظهر عند استلامكم السجل الخاص بكم حيث سيتم تفعيل هذه الخاصية لتتمكنوا من ارسال التصويبات ان وجدت ." />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">فتح الأبواب المغلقة</h3>
                <div className="space-y-1">
                   <SidebarItem title="فتح الأبواب المغلقة ( بحث متقدم )" isActive={activeTab === "فتح الأبواب المغلقة ( بحث متقدم )"} isLocked={!isPaid} info="هذه الخدمة ستظهر تفاصيلها بعد صدور السجل الأساسي والذي يمثل البوابة الرئيسية في سجل تراث العائلة ، من أجل فتح بعض الأبواب المغلقة وتوسيع البحث ." />
                </div>
              </div>

              {/* Social Media & Outer Links */}
              <div className="mt-8 border-t border-brand-100 pt-6">
                <button onClick={() => setActiveTab("حالة السجل")} className="w-full mb-3 bg-brand-900 text-white px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 hover:bg-brand-800 font-semibold shadow-sm">
                  <Compass className="w-5 h-5 text-brand-300" />
                  العودة للصفحة الرئيسية
                </button>
                <Link to="/" className="w-full mb-6 bg-white text-brand-700 px-4 py-3 rounded-xl border border-brand-200 transition flex items-center justify-center gap-2 hover:bg-brand-50 font-semibold shadow-sm text-sm">
                  <Home className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="truncate">العودة لموقع سجل تراث العائلة</span>
                </Link>
                
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-3 text-center">تواصل معنا</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="http://facebook.com/thefamilylegacyroots" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="https://www.instagram.com/thefamilylegacyroots" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="https://www.tiktok.com/@thefamilylegacyroots" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 162.6 162.6v82.08A80.59 80.59 0 1 0 243.1 325.2V20.27h82.08a162.33 162.33 0 0 0 122.8 122.8v66.84z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@TheFamilyLegacyRoots" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.snapchat.com/@thefamilylegacyroots" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.08 0C9.69-.02 7.74.83 6.09 2.5c-.8.81-1.37 1.83-1.63 3.02-.12.56-.21 1.13-.34 1.69-.17.72-.4 1.41-.85 2-.45.58-1 .99-1.74 1.12a2.31 2.31 0 0 0-.25.06c-.84.28-1.12 1.34-.51 1.96.22.22.48.42.76.57.85.45 1.76.77 2.7 1 .2.05.37.24.48.42.17.27.15.54 0 .8-.49.92-.99 1.84-1.55 2.72-.51.81-1.22 1.4-2.1 1.82-.47.22-.64.58-.59 1 .05.41.36.78.85.98.54.21 1.11.31 1.68.4.92.14 1.84.22 2.77.25 1.13.04 2.21.32 3.23.82.78.38 1.54.78 2.32 1.14.47.22 1 0 1.25-.46.06-.11.1-.23.15-.35.15-.35.29-.68.58-.92.83-.69 1.82-.93 2.87-1 1.09-.07 2.18-.08 3.27-.12.18-.01.37-.02.55-.03 1.07-.07 1.8-.83 1.69-1.86-.06-.5-.38-.85-.85-1.07-.85-.4-1.52-1.01-2-1.8-.57-.89-1.06-1.81-1.55-2.73-.13-.25-.13-.5 0-.75.1-.2.27-.38.48-.44.97-.24 1.9-.57 2.77-1.04.38-.2.7-.47 1-.84.45-.55.33-1.38-.27-1.76-.11-.07-.22-.12-.34-.17a4.93 4.93 0 0 1-1.95-1.34c-.4-.48-.65-1.06-.79-1.68-.13-.57-.22-1.13-.34-1.69-.26-1.19-.83-2.21-1.63-3.02C16.42.83 14.47-.02 12.08 0zm1.75 3.03c.5.09 1 .28 1.41.59.51.37.84.87 1.05 1.46.22.61.34 1.25.43 1.89.06.41.13.82.35 1.18.23.36.56.63.95.83.25.13.52.22.79.31a3 3 0 0 0 .5-.47c-.5-.11-1-.18-1.49-.33-.64-.21-.99-.68-1.03-1.35-.04-.6 0-1.21.05-1.81.08-.85.22-1.69.58-2.46.33-.71.85-1.25 1.55-1.59.69-.34 1.43-.46 2.19-.53.49-.04 1-.03 1.49 0 .15.86-.18 1.61-.75 2.17-.67.66-1.52.92-2.45.98-.67.04-1.35.01-2.02.04-.66.03-1.07.45-1.07 1.1 0 .66.42 1.06 1.05 1.09.73.04 1.46.03 2.19 0 1.15-.05 2.16-.48 2.92-1.36.65-.75.98-1.65 1.01-2.65.02-.91-.18-1.78-.6-2.58-.2-.37-.44-.71-.72-1.01A5.3 5.3 0 0 0 18.06 1.3c-.63-.25-1.3-.4-1.98-.44-.1-.01-.2 0-.3.01.21.84-.04 1.58-.6 2.16z"/></svg>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-brand-100 min-h-[600px]">
              
              {!order ? (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-brand-200 mx-auto mb-6" />
                  <h2 className="text-2xl font-serif text-brand-900 mb-4">ليس لديك طلب مسجل بعد</h2>
                  <p className="text-brand-600 mb-8 max-w-sm mx-auto">للبدء في توثيق تاريخ العائلة وفتح جميع أقسام المنصة، يرجى تقديم طلب جديد.</p>
                  <Link to="/order" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 inline-block">بدء رحلة التوثيق</Link>
                </div>
              ) : !isPaid ? (
                 <div className="text-center py-20 bg-brand-50 rounded-2xl border border-brand-200">
                  <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-serif text-brand-900 mb-4">تم حفظ بيانات الطلب</h2>
                  <p className="text-brand-600 mb-8 max-w-sm mx-auto">لم يتم إتمام عملية الدفع حتى الآن. يرجى إتمام الدفع لفتح جميع خدمات وإدراجات لوحة التحكم كأمين سجل.</p>
                  <button onClick={handleResumePayment} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg">إتمام الدفع واعتماد الطلب (1999$)</button>
                </div>
              ) : (
                /* PAID CONTENT */
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-3xl font-serif font-bold text-brand-900 mb-8 pb-4 border-b border-brand-100">{activeTab}</h2>

                  {activeTab === "حالة السجل" && (
                     <div className="bg-brand-50 p-8 rounded-2xl border border-brand-200">
                       <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-200">
                         {order.status === "مكتمل" ? <CheckCircle className="w-12 h-12 text-green-500" /> : <Clock className="w-12 h-12 text-orange-500" />}
                         <div>
                           <h3 className="text-xl font-bold text-brand-900 mb-2">حالة السجل الحالية: <span className="text-brand-600">{order.status}</span></h3>
                           <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-brand-600 text-sm mt-1">
                             <span className="flex items-center gap-1"><CalendarCheck className="w-4 h-4" /> تاريخ الطلب: <strong className="font-bold">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</strong></span>
                             {order.status === "مكتمل" ? (
                               <span className="flex items-center gap-1 text-green-600 font-bold text-base"><CheckCircle className="w-5 h-5" /> تم التسليم بنجاح!</span>
                             ) : (
                               <span className="flex items-center gap-1 text-orange-600"><Clock className="w-4 h-4" /> التسليم المتوقع: <strong className="font-bold border-b border-orange-200 pb-0.5">{calculateDeliveryDate(order.createdAt)}</strong></span>
                             )}
                           </div>
                         </div>
                       </div>
                       
                       {order.status === "مكتمل" ? (
                         <div className="space-y-4">
                           <h3 className="text-2xl font-bold text-brand-900 mb-4 tracking-tight">يسعدنا إتمام العمل!</h3>
                           <p className="text-brand-700 leading-relaxed text-lg">
                             لقد تم إصدار سجل تراث عائلتكم وهو الآن بين أيديكم. نأمل أن يكون هذا العمل على قدر تطلعاتكم وتوقعاتكم، وأن يكون مرجعاً يفخر به الأبناء والأحفاد.
                           </p>
                           <p className="text-brand-700 leading-relaxed text-lg">
                             بإمكانكم الآن الاطلاع على سجلكم الرقمي، كما ندعوكم لقراءة <strong className="text-brand-900">توصيات واقتراحات فريق البحث</strong> بعناية للاستفادة القصوى من العمل، ويمكنكم تقديم طلبات التصويب وفقاً للشروط والأحكام خلال الفترة المحددة.
                           </p>
                           <p className="text-brand-700 leading-relaxed text-lg">
                             وللتعمق أكثر في تاريخ عائلتكم، ندعوكم لاستكشاف خدمة <strong className="text-brand-900 text-xl border-b-2 border-brand-300 ml-1">فتح الأبواب المغلقة (بحث متقدم)</strong> للحصول على إصدارنا الثاني الحصري.
                           </p>
                         </div>
                       ) : (
                         <>
                           <p className="text-brand-900 font-bold mb-4">عزيزي أمين السجل / العميل</p>
                           
                           <ul className="space-y-4 text-brand-700 leading-relaxed text-lg">
                             <li className="flex items-start gap-3">
                               <BookOpen className="w-6 h-6 text-brand-400 shrink-0 mt-1" />
                               <span>يعمل فريق بحث سجل تراث العائلة على توثيق سجلك ، البحوث الجادة تأخذ وقتاً من اجل اعداد سجل نسبي موثوق .</span>
                             </li>
                             <li className="flex items-start gap-3">
                               <MessageSquare className="w-6 h-6 text-brand-400 shrink-0 mt-1" />
                               <span>في حالة وجود استفسار لدى فريق البحث فسيتم التواصل معك من خلال المنصة وسوف يتم اشعاركم بالبريد الالكتروني حول ذلك .</span>
                             </li>
                             <li className="flex items-start gap-3">
                               <CheckCircle className="w-6 h-6 text-brand-400 shrink-0 mt-1" />
                               <span>فريقنا في غاية الحماس كي يصدر سجل تراث عائلتكم في افضل جودة علمية واجمل اخراج وتصميم فني .</span>
                             </li>
                           </ul>
                         </>
                       )}

                       <div className="mt-8 border-t border-brand-200 pt-6">
                         <h4 className="font-bold text-brand-900 mb-2">رقم الطلب:</h4>
                         <p className="font-mono text-xl text-brand-600 bg-white inline-block px-4 py-2 border border-brand-200 rounded-lg">#{order.orderNumber || order.id.toUpperCase()}</p>
                       </div>
                     </div>
                  )}

                  {activeTab === "بيانات أمين السجل/العميل" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-brand-900 text-lg p-6 bg-white border border-brand-100 rounded-2xl shadow-sm">
                        <div className="col-span-2 border-b border-brand-100 pb-2 mb-2 font-bold flex items-center gap-2"><Lock className="w-4 h-4 text-brand-400" /> البيانات الأساسية (غير قابلة للتعديل)</div>
                        <div><span className="block text-sm text-brand-500 mb-1">الاسم الأول:</span> <strong>{order.data.firstName}</strong></div>
                        <div><span className="block text-sm text-brand-500 mb-1">اسم الأب:</span> <strong>{order.data.fatherName}</strong></div>
                        <div><span className="block text-sm text-brand-500 mb-1">اسم الجد:</span> <strong>{order.data.grandfatherName}</strong></div>
                        <div><span className="block text-sm text-brand-500 mb-1">اللقب / العائلة:</span> <strong>{order.data.familyName}</strong></div>
                        <div><span className="block text-sm text-brand-500 mb-1">القبيلة / العائلة:</span> <strong>{order.data.tribeName || 'غير متوفر'}</strong></div>
                        <div><span className="block text-sm text-brand-500 mb-1">الدولة:</span> <strong>{order.data.country}</strong></div>
                        <div><span className="block text-sm text-brand-500 mb-1">الموطن الأصلي:</span> <strong>{order.data.homeland}</strong></div>
                      </div>

                      <div className="p-6 bg-brand-50 border border-brand-200 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-brand-900 border-b border-brand-200 pb-4 mb-4 flex items-center gap-2 text-lg"><MapPin className="w-5 h-5 text-brand-600" /> بيانات التواصل والشحن (قابلة للتعديل)</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">الهاتف النقال</label>
                            <input 
                              type="text" 
                              className="w-full p-3 rounded-xl border border-brand-200 focus:ring-brand-500 focus:border-brand-500"
                              placeholder="رقم الهاتف متضمناً رمز الدولة"
                              value={order.data.mobileNumber || ""}
                              onChange={e => {
                                const val = e.target.value;
                                useAppStore.setState(s => ({
                                  orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, mobileNumber: val } } : o)
                                }));
                              }}
                              onBlur={e => updateSpecificData({ mobileNumber: e.target.value })}
                            />
                          </div>
                          
                          <div className="col-span-2 mt-4">
                            <label className="flex items-center text-brand-900 font-bold mb-4">العنوان البريدي (الذي ترغب شحن الباقة اليه): <InfoTooltip text="العنوان البريدي من اجل توصيل الباقة اليكم ." /></label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">الدولة</label>
                                <input type="text" className="w-full p-3 rounded-xl border border-brand-200" 
                                  value={order.data.shippingAddress?.country || ""} 
                                  onChange={e => {
                                    const val = e.target.value;
                                    useAppStore.setState(s => ({ orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, shippingAddress: { ...o.data.shippingAddress, country: val } as any } } : o) }));
                                  }}
                                  onBlur={e => updateSpecificData({ shippingAddress: { ...(order.data.shippingAddress as any), country: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">المقاطعة / المحافظة</label>
                                <input type="text" className="w-full p-3 rounded-xl border border-brand-200" 
                                  value={order.data.shippingAddress?.state || ""} 
                                  onChange={e => {
                                    const val = e.target.value;
                                    useAppStore.setState(s => ({ orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, shippingAddress: { ...o.data.shippingAddress, state: val } as any } } : o) }));
                                  }}
                                  onBlur={e => updateSpecificData({ shippingAddress: { ...(order.data.shippingAddress as any), state: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">العنوان بالتفصيل</label>
                                <input type="text" className="w-full p-3 rounded-xl border border-brand-200" 
                                  value={order.data.shippingAddress?.street || ""} 
                                  onChange={e => {
                                    const val = e.target.value;
                                    useAppStore.setState(s => ({ orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, shippingAddress: { ...o.data.shippingAddress, street: val } as any } } : o) }));
                                  }}
                                  onBlur={e => updateSpecificData({ shippingAddress: { ...(order.data.shippingAddress as any), street: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">الرقم البريدي</label>
                                <input type="text" className="w-full p-3 rounded-xl border border-brand-200" 
                                  value={order.data.shippingAddress?.zip || ""} 
                                  onChange={e => {
                                    const val = e.target.value;
                                    useAppStore.setState(s => ({ orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, shippingAddress: { ...o.data.shippingAddress, zip: val } as any } } : o) }));
                                  }}
                                  onBlur={e => updateSpecificData({ shippingAddress: { ...(order.data.shippingAddress as any), zip: e.target.value } })}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-brand-400 mt-3">يتم حفظ التعديلات تلقائياً عند النقر خارج المربع.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "نقطة بدء عمود النسب" && (
                    <div className="p-8 bg-brand-50 rounded-2xl border border-brand-200 text-center">
                      <p className="text-brand-600 mb-4 font-light">بناءً على طلبكم، نقطة الانطلاق المعتمدة لبدء التوثيق لعمود النسب هي:</p>
                      <div className="flex justify-center items-center gap-4 text-3xl font-serif text-brand-900 font-bold border-y-2 border-brand-200 py-6 max-w-md mx-auto">
                        <UserPlus className="w-10 h-10 text-brand-600" />
                        <span>
                          {order.data.startingPointType === "أنا أمين السجل" ? order.data.firstName :
                           order.data.startingPointType === "اسم العائلة" ? `عائلة (${order.data.familyName})` :
                           order.data.startingPointType === "احد الأسلاف" ? order.data.startingPointName :
                           order.data.startingPoint}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "قالب التصميم المختار" && (
                    <div className="p-8 bg-white border-2 border-brand-100 rounded-2xl text-center">
                      <div className="text-4xl font-serif text-brand-900 mb-4">{order.data.designTemplate}</div>
                      <p className="text-brand-600">سيتم تصميم نسخة أنيقة من سجلك بناءً على النموذج {order.data.designTemplate}.</p>
                    </div>
                  )}

                  {activeTab === "نبذة وكلمة عن العائلة" && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm">
                        <p className="text-brand-900 font-bold mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5 text-brand-600" />نبذة تاريخية عن العائلة</p>
                        <p className="text-brand-600 mb-4 text-sm">اكتب كل ما تود إرفاقه فيما يتعلق بالنبذة التاريخية (يُدرج بسجلكم بخصوصية).</p>
                        <textarea 
                          className="w-full h-48 border-brand-200 bg-brand-50 rounded-xl p-4 focus:ring-brand-500 focus:border-brand-500 text-brand-900" 
                          value={order.data.historicalNotes || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            useAppStore.setState(s => ({
                              orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, historicalNotes: val } } : o)
                            }));
                          }}
                          onBlur={(e) => updateSpecificData({ historicalNotes: e.target.value })}
                          placeholder="ابدا الكتابة هنا..."
                        />
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm">
                        <p className="text-brand-900 font-bold mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-brand-600" />كلمة أمين السجل</p>
                        <p className="text-brand-600 mb-4 text-sm">مساحة مخصصة لكتابة كلمتك كأمين سجل والتي سيتم اعتمادها وإدراجها.</p>
                        <textarea 
                          className="w-full h-32 border-brand-200 bg-brand-50 rounded-xl p-4 focus:ring-brand-500 focus:border-brand-500 text-brand-900" 
                          value={order.data.managerWord || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            useAppStore.setState(s => ({
                              orders: s.orders.map(o => o.id === order.id ? { ...o, data: { ...o.data, managerWord: val } } : o)
                            }));
                          }}
                          onBlur={(e) => updateSpecificData({ managerWord: e.target.value })}
                          placeholder="ابدا الكتابة هنا..."
                        />
                      </div>
                      
                      <p className="text-xs text-brand-400 mt-2 text-center">يتم حفظ التعديلات تلقائياً عند النقر خارج المربع.</p>
                    </div>
                  )}

                  {activeTab === "إدراج مشجر الأحياء" && (
                    <div className="space-y-4">
                      <p className="text-brand-600 mb-4">أضف أفراد عائلتك لبناء مشجرة الأحياء (اقتصر على إشرافك المباشر في هذا المخطط).</p>
                      <div className="h-[75vh] min-h-[600px] border-2 border-brand-100 rounded-2xl overflow-hidden bg-white shadow-inner relative">
                        <TreeBuilder 
                          initialNodes={order.data.treeData?.nodes || []} 
                          initialEdges={order.data.treeData?.edges || []} 
                          onChange={(nodes, edges) => updateSpecificData({ treeData: { nodes, edges } })}
                          familyName={order.data.familyName}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "إدراج وثائق" && (
                    <div className="space-y-6">
                      {pendingUpload?.arrayName === "documents" ? (
                         <div className="bg-brand-50 p-6 md:p-8 rounded-2xl border border-brand-200">
                           <h4 className="font-bold text-brand-900 mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-brand-500"/> تفاصيل الوثيقة: <span className="text-brand-600 font-normal">{pendingUpload.file.name}</span></h4>
                           <div className="space-y-4">
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">عنوان الوثيقة (إختياري)</label>
                               <input type="text" className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" value={mediaMeta.title} onChange={e => setMediaMeta({...mediaMeta, title: e.target.value})} placeholder="مثال: وثيقة زواج جدي" />
                             </div>
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">النوع (إختياري)</label>
                               <input type="text" className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" value={mediaMeta.kind} onChange={e => setMediaMeta({...mediaMeta, kind: e.target.value})} placeholder="صك محكمة، شهادة ميلاد..." />
                             </div>
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">الوصف (إختياري)</label>
                               <textarea className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" rows={3} value={mediaMeta.description} onChange={e => setMediaMeta({...mediaMeta, description: e.target.value})} placeholder="أي تفاصيل تود توضيحها حول هذه الوثيقة..."></textarea>
                             </div>
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">الغرض من الإدراج</label>
                               <select className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white" value={mediaMeta.purpose} onChange={e => setMediaMeta({...mediaMeta, purpose: e.target.value})}>
                                 <option value="إضافة لسجل تراث العائلة">إضافة لسجل تراث العائلة الرئيسي</option>
                                 <option value="مشاركة للغرض البحثي فقط">مشاركة مع فريق البحث للغرض البحثي فقط</option>
                                 <option value="غلاف للسجل">استخدام كغلاف لسجل تراث العائلة</option>
                               </select>
                             </div>
                             <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
                               <button disabled={isUploading} onClick={confirmUpload} className="flex-1 bg-brand-600 text-white rounded-xl py-3 font-bold hover:bg-brand-700 transition flex justify-center items-center gap-2">
                                 {isUploading ? <><UploadCloud className="w-5 h-5 animate-pulse" /> جاري الرفع...</> : 'حفظ ورفع الوثيقة'}
                               </button>
                               <button disabled={isUploading} onClick={() => setPendingUpload(null)} className="flex-1 bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 rounded-xl py-3 font-bold transition">إلغاء</button>
                             </div>
                           </div>
                         </div>
                      ) : (
                        <div onClick={() => !isUploading && fileInputRef.current?.click()} className={`border-2 border-dashed border-brand-300 rounded-2xl p-10 text-center transition ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-50 cursor-pointer'}`}>
                           <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { if(e.target.files && e.target.files[0]) { uploadFileAndUpdate(e.target.files[0], "documents"); e.target.value = ''; } }} accept=".pdf,.doc,.docx" disabled={isUploading} />
                           <UploadCloud className="w-12 h-12 text-brand-400 mx-auto mb-4" />
                           <p className="text-brand-800 font-bold mb-2">انقر هنا لرفع وثيقة تاريخية جديدة</p>
                           <p className="text-sm text-brand-600">(الرفع لمرفق واحد في كل مرة)</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.data.documents?.map((docItem, i) => {
                           const isStr = typeof docItem === 'string';
                           const url = isStr ? docItem : docItem.url;
                           const title = isStr ? url.split('%2F').pop()?.split('?')[0] || 'وثيقة' : (docItem.title || url.split('%2F').pop()?.split('?')[0] || 'وثيقة');
                           return (
                             <a key={i} href={url} target="_blank" rel="noreferrer" className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-brand-200 hover:border-brand-400 hover:shadow-md transition group relative overflow-hidden">
                               <div className="absolute top-0 right-0 w-1 h-full bg-brand-400 group-hover:bg-brand-500 transition-colors"></div>
                               <div className="flex items-start gap-3">
                                 <FileText className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                                 <div>
                                   <h4 className="font-bold text-brand-900 line-clamp-1" dir="auto">{title}</h4>
                                   {!isStr && <p className="text-xs text-brand-600 mt-1 font-mono">{docItem.purpose} {docItem.kind ? ` • ${docItem.kind}` : ''}</p>}
                                 </div>
                               </div>
                               {!isStr && docItem.description && <p className="text-xs text-brand-500 mt-2 line-clamp-2 pr-8">{docItem.description}</p>}
                             </a>
                           );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === "إدراج صور" && (
                    <div className="space-y-6">
                      {pendingUpload?.arrayName === "photos" ? (
                         <div className="bg-brand-50 p-6 md:p-8 rounded-2xl border border-brand-200">
                           <h4 className="font-bold text-brand-900 mb-6 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand-500"/> تفاصيل الصورة: <span className="text-brand-600 font-normal">{pendingUpload.file.name}</span></h4>
                           <div className="space-y-4">
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">عنوان الصورة (إختياري)</label>
                               <input type="text" className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" value={mediaMeta.title} onChange={e => setMediaMeta({...mediaMeta, title: e.target.value})} placeholder="مثال: صورة للعائلة في قرية..." />
                             </div>
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">النوع (إختياري)</label>
                               <input type="text" className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" value={mediaMeta.kind} onChange={e => setMediaMeta({...mediaMeta, kind: e.target.value})} placeholder="صورة شخصية، صورة جماعية، معلم أثري..." />
                             </div>
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">الوصف (إختياري)</label>
                               <textarea className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" rows={3} value={mediaMeta.description} onChange={e => setMediaMeta({...mediaMeta, description: e.target.value})} placeholder="أي تفاصيل تود توضيحها حول هذه الصورة..."></textarea>
                             </div>
                             <div>
                               <label className="block text-sm font-semibold text-brand-700 mb-1">الغرض من الإدراج</label>
                               <select className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white" value={mediaMeta.purpose} onChange={e => setMediaMeta({...mediaMeta, purpose: e.target.value})}>
                                 <option value="إضافة لسجل تراث العائلة">إضافة لسجل تراث العائلة الرئيسي</option>
                                 <option value="مشاركة للغرض البحثي فقط">مشاركة مع فريق البحث للغرض البحثي فقط</option>
                                 <option value="غلاف للسجل">استخدام الصورة كغلاف لسجل تراث العائلة</option>
                               </select>
                             </div>
                             <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
                               <button disabled={isUploading} onClick={confirmUpload} className="flex-1 bg-brand-600 text-white rounded-xl py-3 font-bold hover:bg-brand-700 transition flex justify-center items-center gap-2">
                                 {isUploading ? <><UploadCloud className="w-5 h-5 animate-pulse" /> جاري الرفع...</> : 'حفظ ورفع الصورة'}
                               </button>
                               <button disabled={isUploading} onClick={() => setPendingUpload(null)} className="flex-1 bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 rounded-xl py-3 font-bold transition">إلغاء</button>
                             </div>
                           </div>
                         </div>
                      ) : (
                        <div onClick={() => !isUploading && photosInputRef.current?.click()} className={`border-2 border-dashed border-brand-300 rounded-2xl p-10 text-center transition ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-50 cursor-pointer'}`}>
                           <input type="file" className="hidden" ref={photosInputRef} onChange={(e) => { if(e.target.files && e.target.files[0]) { uploadFileAndUpdate(e.target.files[0], "photos"); e.target.value = ''; } }} accept="image/jpeg,image/png,image/jpg" disabled={isUploading} />
                           <ImageIcon className="w-12 h-12 text-brand-400 mx-auto mb-4" />
                           <p className="text-brand-800 font-bold mb-2">انقر هنا لرفع صورة عائلية موثقة</p>
                           <p className="text-sm text-brand-600">(الرفع لمرفق واحد في كل مرة)</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {order.data.photos?.map((photoItem, i) => {
                           const isStr = typeof photoItem === 'string';
                           const url = isStr ? photoItem : photoItem.url;
                           const title = !isStr && photoItem.title ? photoItem.title : '';
                           return (
                             <a key={i} href={url} target="_blank" rel="noreferrer" className="aspect-[4/5] bg-white rounded-xl overflow-hidden border border-brand-200 hover:border-brand-400 hover:shadow-md transition block relative group">
                               <img src={url} alt={`Photo ${i}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-xs text-brand-400 p-2 text-center">لا يمكن عرض الصورة هنا، انقر للعرض</div>'; }} />
                               {!isStr && (photoItem.title || photoItem.purpose) && (
                                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                                   <p className="text-xs font-bold line-clamp-1">{photoItem.title || "صورة عائلية"}</p>
                                   <p className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{photoItem.purpose}</p>
                                 </div>
                               )}
                             </a>
                           );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === "رسائل فريق البحث" && (
                    <div className="bg-white border rounded-2xl flex flex-col h-[600px] border-brand-200 overflow-hidden relative">
                      <div className="bg-brand-50 border-b border-brand-200 p-4">
                        <h4 className="font-bold text-brand-900">تواصل آمن ومباشر</h4>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                        {(!order.messages || order.messages.length === 0) ? (
                          <div className="text-center py-20 text-brand-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />لا توجد رسائل بعد.</div>
                        ) : (
                          order.messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}>
                               <div className={`max-w-[75%] rounded-2xl p-4 ${msg.senderRole === "user" ? "bg-brand-600 text-white rounded-tl-sm" : "bg-brand-100 text-brand-900 rounded-tr-sm"}`}>
                                 <p className="whitespace-pre-wrap">{msg.text}</p>
                                 {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {msg.attachments.map((att, i) => (
                                        <a key={i} href={att} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] bg-white text-brand-900 px-2 py-1 rounded">مرفق <Paperclip className="w-3 h-3" /></a>
                                      ))}
                                    </div>
                                 )}
                                 <div className={`text-xs mt-2 opacity-75`}>{new Date(msg.createdAt).toLocaleString("ar-SA")}</div>
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {replyAttachments.length > 0 && (
                        <div className="absolute bottom-[72px] left-4 right-4 bg-gray-100 p-2 rounded-lg flex gap-2 overflow-x-auto border border-gray-200">
                           {replyAttachments.map((url, i) => (
                             <div key={i} className="bg-white px-2 py-1 text-xs rounded border flex items-center gap-2">
                               مرفق أدخلته
                               <button onClick={() => setReplyAttachments(replyAttachments.filter(a => a !== url))} className="text-red-500 font-bold hover:text-red-700">X</button>
                             </div>
                           ))}
                        </div>
                      )}
                      
                      <div className="p-4 bg-white border-t border-brand-200 flex gap-2 absolute bottom-0 left-0 right-0">
                        <input type="file" className="hidden" ref={chatFileInputRef} onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const storageRef = ref(storage, `chat/${Date.now()}_${file.name}`);
                            const uploadTask = uploadBytesResumable(storageRef, file);
                            uploadTask.on('state_changed', null, null, async () => {
                              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                              setReplyAttachments([...replyAttachments, downloadURL]);
                            });
                          }
                        }} />
                        <button onClick={() => chatFileInputRef.current?.click()} className="p-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 border border-brand-200" title="إرفاق ملف"><Paperclip className="w-5 h-5"/></button>
                        <input type="text" className="flex-1 border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 px-4" placeholder="إكتب رسالتك هنا..." value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendReply()} />
                        <button onClick={handleSendReply} className="px-6 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700">إرسال</button>
                      </div>
                    </div>
                  )}

                  {activeTab === "النسخة الرقمية للسجل" && (
                    <div className="text-center py-24 bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300"></div>
                      {!order.digitalCopyLink ? (
                        <>
                          <Sparkles className="w-16 h-16 text-brand-400 mx-auto mb-6 animate-pulse" />
                          <h3 className="text-2xl font-bold text-brand-900 mb-3 tracking-tight">قريباً سيكون سجل تراث عائلتك بين يديك!</h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg">سيظهر لك هنا رابط تحميل <strong className="text-brand-900">سجل تراث عائلتك الرقمي</strong> فور اعتماده وإصداره.</p>
                        </>
                      ) : (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <BookOpen className="w-20 h-20 text-brand-600 mx-auto mb-6" />
                          <h3 className="text-3xl font-bold text-brand-900 mb-4 tracking-tight">سجل تراث عائلتك جاهز للتصفح</h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg mb-10">لقد انتهينا من إعداد نسختك الرقمية بأعلى معايير الجودة والإخراج.</p>
                          <div className="flex flex-col items-center justify-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                              <a href={order.digitalCopyLink} target="_blank" rel="noopener noreferrer" className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto">
                                <Download className="w-6 h-6" /> تحميل النسخة الرقمية
                              </a>
                            </div>
                            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-sm md:text-base font-semibold max-w-lg mt-2 flex items-start gap-4 text-right">
                              <Package className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                              <p className="leading-relaxed">يسعدنا إبلاغك بأنه تم إرسال الشحنة وهي في طريقها إليك! <br/><span className="font-bold underline decoration-green-300 decoration-2">تتضمن الشحنة:</span> 10 نسخ مطبوعة فاخرة، وبوستر مشجرة العائلة.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "بوستر مشجر عمود النسب" && (
                    <div className="text-center py-24 bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300"></div>
                      {!order.posterLink ? (
                        <>
                          <Star className="w-16 h-16 text-brand-400 mx-auto mb-6 animate-pulse" />
                          <h3 className="text-2xl font-bold text-brand-900 mb-3 tracking-tight">لوحة فنية توثق جذور عائلتك!</h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg">سيظهر لك هنا رابط تحميل <strong className="text-brand-900">بوستر مشجر عمود نسبكم</strong> بصيغة رقمية أصلية عند الإصدار.</p>
                        </>
                      ) : (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <Compass className="w-20 h-20 text-brand-600 mx-auto mb-6" />
                          <h3 className="text-3xl font-bold text-brand-900 mb-4 tracking-tight">بوستر مشجرة العائلة جاهز!</h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg mb-10">تحفة فنية فريدة صُممت لتوثيق عمود نسبكم عبر الأجيال.</p>
                          <div className="flex flex-col items-center justify-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                              <a href={order.posterLink} target="_blank" rel="noopener noreferrer" className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto">
                                <Download className="w-6 h-6" /> تحميل البوستر عالي الدقة
                              </a>
                            </div>
                            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-sm md:text-base font-semibold max-w-lg mt-2 flex items-start gap-4 text-right">
                              <Package className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                              <p className="leading-relaxed">يسعدنا إبلاغك بأنه تم إرسال الشحنة وهي في طريقها إليك! <br/><span className="font-bold underline decoration-green-300 decoration-2">تتضمن الشحنة:</span> 10 نسخ مطبوعة فاخرة، وبوستر مشجرة العائلة.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "التصويبات" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 overflow-hidden">
                      {order.status !== "مكتمل" ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">سيظهر لك هنا نموذج التصويبات</h3>
                           <p className="text-brand-600 font-light max-w-sm mx-auto">لتتمكن من التبليغ عن الأخطاء ليتم بناءاً عليها من إصلاح وتحديث الاخطاء عند وجودها، وذلك بعد إصدار السجل.</p>
                        </div>
                      ) : (
                        <div className="px-6 md:px-12 py-8">
                          {order.researchRecommendations && (
                            <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-6 md:p-8 mb-10 shadow-sm">
                              <h3 className="text-xl md:text-2xl font-bold text-brand-900 mb-4 leading-tight flex items-center gap-3">
                                <Star className="w-6 h-6 text-brand-500 fill-brand-500" /> توصيات واقتراحات فريق البحث
                              </h3>
                              <div className="text-brand-800 text-lg leading-relaxed text-right whitespace-pre-line bg-white p-6 rounded-xl border border-brand-100 shadow-inner">
                                {order.researchRecommendations}
                              </div>
                            </div>
                          )}
                          <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-brand-600" /> نموذج طلب تصويب
                          </h3>
                          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 mb-8">
                            <p className="text-brand-800 font-medium mb-4">نأمل منكم في حالة وجود أي ملاحظات أو أخطاء مطبعية أو علمية تعبئة النموذج أدناه بدقة ليتسنى لفريق البحث إدراجها وتحديث السجل.</p>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-brand-700 mb-1">أي قسم في سجل تراث العائلة يحتاج لهذا التصويب؟</label>
                                  <input type="text" list="sections" className="w-full border border-brand-200 rounded-xl focus:ring-brand-500 bg-white p-3" placeholder="اختر أو اكتب يدوياً..." value={correctionSection} onChange={(e) => setCorrectionSection(e.target.value)} />
                                  <datalist id="sections">
                                    <option value="الباب الأول: التسلسل النسبي" />
                                    <option value="الباب الثاني: الوثائق" />
                                    <option value="الباب الثالث: الصور" />
                                    <option value="مقدمة السجل" />
                                  </datalist>
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-brand-700 mb-1">رقم الصفحة في سجل تراث العائلة التي تحتاج لهذا التصويب</label>
                                  <input type="text" className="w-full border border-brand-200 rounded-xl focus:ring-brand-500 bg-white p-3" placeholder="مثال: 45" value={correctionPage} onChange={(e) => setCorrectionPage(e.target.value)} />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-brand-700 mb-1">مساحة حرة لتحديد مايراه يستحق التصويب</label>
                                <textarea className="w-full border border-brand-200 rounded-xl focus:ring-brand-500 bg-white min-h-[80px] p-3" placeholder="اكتب الجملة أو المعلومات التي ترى أنها تحتاج لتصويب..." value={correctionError} onChange={(e) => setCorrectionError(e.target.value)}></textarea>
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-brand-700 mb-1">كتابة التصويب مع توضيح مرجعيته أو مصادره لهذا التصويب إن وجد</label>
                                <textarea className="w-full border border-brand-200 rounded-xl focus:ring-brand-500 bg-white min-h-[120px] p-3" placeholder="اكتب التصويب الصحيح ومصادرك..." value={correctionText} onChange={(e) => setCorrectionText(e.target.value)}></textarea>
                              </div>
                              
                              <div className="flex items-start gap-3 mt-4 bg-white p-4 rounded-xl border border-brand-100">
                                <input type="checkbox" id="terms" className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500" checked={agreeToCorrectionTerms} onChange={(e) => setAgreeToCorrectionTerms(e.target.checked)} />
                                <label htmlFor="terms" className="text-sm text-brand-700 leading-relaxed cursor-pointer select-none">
                                  تخضع كافة التصويبات للمراجعة والتدقيق العلمي والإعتماد من قبل فريق البحث للتحقق من صحتها وتطابقها مع المصادر. وأقر بالموافقة على <button className="text-brand-600 font-bold underline" onClick={(e) => { e.preventDefault(); setShowCorrectionTerms(true); }}>تطبيق الشروط والأحكام</button> الخاصة بالتعديلات.
                                </label>
                              </div>

                              <button onClick={handleSendCorrection} disabled={!correctionSection || !correctionPage || !correctionText || !correctionError || !agreeToCorrectionTerms} className="mt-6 w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm">
                                <Send className="w-5 h-5" /> إرسال طلب التصويب
                              </button>
                            </div>
                          </div>

                          {/* Previous Corrections List */}
                          {order.messages && order.messages.filter(m => m.text.includes('طلب تصويب - القسم')).length > 0 && (
                            <div className="mt-12 bg-brand-50 rounded-2xl p-6 md:p-8 border border-brand-100 shadow-sm">
                              <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-brand-600" />
                                طلبات التصويب السابقة
                              </h3>
                              <div className="space-y-4">
                                {order.messages.filter(m => m.text.includes('طلب تصويب - القسم')).map(msg => (
                                  <div key={msg.id} className="bg-white p-5 rounded-xl border border-brand-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-sm font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
                                        تم الإرسال
                                      </span>
                                      <span className="text-xs text-brand-500 font-mono" dir="ltr">{new Date(msg.createdAt).toLocaleString('ar-SA')}</span>
                                    </div>
                                    <p className="text-brand-800 whitespace-pre-line text-sm mt-3">{msg.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {showCorrectionTerms && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-right p-6">
                                <h3 className="text-xl font-bold text-brand-900 mb-4">شروط وأحكام التصويبات</h3>
                                <ul className="list-disc list-inside space-y-2 text-brand-700 text-sm mb-6 pb-4 border-b border-gray-100">
                                  <li>يحق للعميل تقديم طلب تصويب واحد مجاني خلال 30 يوماً من استلام السجل.</li>
                                  <li>يجب الإشارة إلى المصدر المعتمد للتصويب إذا كان تعديلاً جوهرياً في النسب.</li>
                                  <li>عمليات التصحيح الإملائي والتنسيقي تتم مراجعتها وتعديلها مباشرة.</li>
                                  <li>التحديثات الجذرية التي تتطلب إعادة بحث قد يترتب عليها رسوم إضافية.</li>
                                </ul>
                                <button onClick={() => setShowCorrectionTerms(false)} className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700">إغلاق ومتابعة</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "فتح الأبواب المغلقة ( بحث متقدم )" && (
                    <div className="py-12 px-4 sm:px-8 bg-white shadow-inner rounded-3xl border border-brand-200">
                      <div className="text-center mb-10">
                        <Telescope className="w-20 h-20 text-brand-600 mx-auto mb-6 opacity-90" />
                        {!order.researchRecommendations ? (
                          <h3 className="text-2xl md:text-3xl font-bold text-brand-900 mb-4 leading-tight">هنا ستظهر توصيات واقتراحات فريق البحث<br/>بعد صدور "سجل تراث العائلة"</h3>
                        ) : (
                          <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-8 mb-8 shadow-sm">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-900 mb-4 leading-tight flex justify-center items-center gap-3">
                              <Star className="w-8 h-8 text-brand-500 fill-brand-500" /> توصيات واقتراحات فريق البحث
                            </h3>
                            <div className="text-brand-800 text-lg leading-relaxed text-right whitespace-pre-line bg-white p-6 rounded-xl border border-brand-100 shadow-inner">
                              {order.researchRecommendations}
                            </div>
                          </div>
                        )}
                        <p className="text-brand-500 font-bold bg-brand-50 inline-block px-4 py-2 rounded-full border border-brand-100">تعتبر خدمة فتح الأبواب المغلقة خدمة مستقلة - تنطبق الشروط والأحكام</p>
                      </div>
                      
                      <div className="space-y-8 text-brand-800 leading-relaxed bg-brand-50 p-6 sm:p-10 rounded-2xl border border-brand-100 text-lg">
                        <p className="font-medium">يعتبر "سجل تراث العائلة" - السجل الأساسي - عند صدوره هو العمل الجوهري الذي تكون من خلالة رحلة توثيق عمود النسب ، وعند صدوره قد يقترح فريق البحث بعض التوصيات في بعض الحالات التي لاتتوفر فيها مصادر كافية أو يحتاج البحث الى بحث متقدم من نوع آخر ، وهنا تأتي خدمة "فتح الأبواب المغلقة" لتفتح ابواباً آخرى من البحث عند رغبة (أمين السجل/العميل) في ذلك .</p>
                        
                        <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm">
                          <h4 className="font-bold text-brand-900 text-xl mb-3 flex items-center gap-3"><Compass className="w-7 h-7 text-brand-600" /> خدمة فتح الأبواب المغلقة :</h4>
                          <p>خدمة اختيارية تُقدَّم بعد تثبيت الأصل، وتهدف إلى تعميق التوثيق عبر أدوات بحث متقدمة، تُفعّل جزئيًا أو كليًا حسب مقتضيات البحث العلمي .</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm">
                          <h4 className="font-bold text-brand-900 text-xl mb-3 flex items-center gap-3"><MapPin className="w-7 h-7 text-brand-600" /> كيف تعمل خدمة فتح الأبواب المغلقة</h4>
                          <p className="mb-4">تشمل خدمة "فتح الأبواب المغلقة" على انواع من البحوث المتخصصة والمعمقة ، من أجل فتح بعض الأبواب المغلقة والتي ابرزها الأصدار الأساسي للسجل ، وقد تكون على سبيل المثال أحد هذه الأنواع من الأعمال البحثية:</p>
                          <ul className="space-y-3 mt-4 text-brand-900">
                            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-500"></div>البحث في الوثائق والسجلات الرسمية.</li>
                            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-500"></div>البحث في الأراشيف الحكومية التاريخية.</li>
                            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-500"></div>تفسير نتائج الحمض النووي وربطها بالسياق النسبي</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "الملف الشخصي" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 p-8">
                       <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3"><User className="w-8 h-8 text-brand-600" /> الملف الشخصي</h3>
                       <form onSubmit={async (e) => {
                         e.preventDefault();
                         const formData = new FormData(e.currentTarget);
                         const newName = formData.get('name') as string;
                         const newPhone = formData.get('phone') as string;
                         const newCountry = formData.get('country') as string;
                         const newState = formData.get('state') as string;
                         const newStreet = formData.get('street') as string;
                         const newZip = formData.get('zip') as string;
                         
                         try {
                           // Update user doc
                           await updateDoc(doc(db, "users", currentUser.id), {
                             name: newName,
                             phone: newPhone,
                             shippingAddress: { country: newCountry, state: newState, street: newStreet, zip: newZip }
                           });
                           useAppStore.setState({ currentUser: { ...currentUser, name: newName } });
                           alert('تم حفظ البيانات بنجاح.');
                         } catch (err) {
                           console.error(err);
                           alert('حدث خطأ أثناء الحفظ.');
                         }
                       }}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-50 p-6 rounded-2xl border border-brand-100">
                            <div>
                              <label className="block text-sm font-bold text-brand-700 mb-2">الاسم</label>
                              <input required name="name" type="text" className="w-full border-brand-200 rounded-xl bg-white" defaultValue={currentUser.name || ""} />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-brand-700 mb-2">البريد الإلكتروني (لا يمكن تعديله)</label>
                              <input type="text" className="w-full border-brand-200 object-not-allowed bg-gray-100 text-gray-500 rounded-xl" value={currentUser.email || ""} disabled />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-brand-700 mb-2">رقم الهاتف</label>
                              <input name="phone" type="text" className="w-full border-brand-200 rounded-xl bg-white" defaultValue={order?.data.mobileNumber || ""} placeholder="رقم الهاتف" />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                              <h4 className="col-span-2 text-sm font-bold text-brand-700 mt-2">عنوان الشحن الدائم</h4>
                              <div>
                                <label className="block text-xs text-brand-600 mb-1">الدولة</label>
                                <input name="country" type="text" className="w-full border-brand-200 rounded-xl bg-white" defaultValue={order?.data.shippingAddress?.country || ""} placeholder="الدولة" />
                              </div>
                              <div>
                                <label className="block text-xs text-brand-600 mb-1">المنطقة/المدينة</label>
                                <input name="state" type="text" className="w-full border-brand-200 rounded-xl bg-white" defaultValue={order?.data.shippingAddress?.state || ""} placeholder="المدينة" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs text-brand-600 mb-1">الشارع والوصف</label>
                                <input name="street" type="text" className="w-full border-brand-200 rounded-xl bg-white" defaultValue={order?.data.shippingAddress?.street || ""} placeholder="اسم الشارع أو وصف دقيق" />
                              </div>
                              <div>
                                <label className="block text-xs text-brand-600 mb-1">الرمز البريدي</label>
                                <input name="zip" type="text" className="w-full border-brand-200 rounded-xl bg-white" defaultValue={order?.data.shippingAddress?.zip || ""} placeholder="الرمز البريدي" />
                              </div>
                            </div>
                         </div>
                         <div className="mt-6 flex justify-end">
                           <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-sm transition">حفظ التغييرات</button>
                         </div>
                       </form>
                    </div>
                  )}

                  {activeTab === "إعدادات" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 p-8">
                       <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3"><Settings className="w-8 h-8 text-brand-600" /> الإعدادات</h3>
                       
                       <div className="space-y-8">
                         {/* Security Setting */}
                         <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                            <h4 className="font-bold text-brand-800 mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-brand-600" /> الأمان وتسجيل الدخول</h4>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-brand-700">تغيير كلمة المرور</p>
                                <p className="text-xs text-brand-500 mt-1">يُنصح بتحديث كلمة المرور بشكل دوري للحفاظ على أمان حسابك.</p>
                              </div>
                              <button onClick={() => alert("سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.")} className="px-6 py-2 border border-brand-300 text-brand-700 rounded-xl hover:bg-brand-100 transition text-sm font-medium whitespace-nowrap">تغيير كلمة المرور</button>
                            </div>
                         </div>
                         
                         {/* Notifications Setting */}
                         <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                            <h4 className="font-bold text-brand-800 mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-brand-600" /> الإشعارات والتنبيهות</h4>
                            <div className="space-y-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500" />
                                <div>
                                  <p className="text-sm font-semibold text-brand-700">تنبيهات حالة الطلب</p>
                                  <p className="text-xs text-brand-500">إرسال بريد إلكتروني عند تغير حالة طلبك (مثل: قيد البحث، مكتمل).</p>
                                </div>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500" />
                                <div>
                                  <p className="text-sm font-semibold text-brand-700">رسائل فريق العمل</p>
                                  <p className="text-xs text-brand-500">إشعار بالبريد الإلكتروني عند ورود استفسارات من فريق البحث.</p>
                                </div>
                              </label>
                            </div>
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === "عقد تسجيل الخدمة" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 p-8">
                       <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3"><FileText className="w-8 h-8 text-brand-600" /> عقد تسجيل الخدمة</h3>
                       {!order ? (
                         <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
                            <AlertCircle className="w-10 h-10 text-orange-500" />
                            <div>
                              <h4 className="font-bold text-orange-800 text-lg">لم تقم بالتوقيع على العقد بعد</h4>
                              <p className="text-sm text-orange-700">لم يتم العثور على سجل مرتبط بحسابك.</p>
                            </div>
                         </div>
                       ) : (
                         <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-4 shadow-sm">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                            <div>
                              <h4 className="font-bold text-green-800 text-lg">تم توقيع العقد بنجاح</h4>
                              <p className="text-sm text-green-700 font-mono mt-1" dir="ltr">{new Date(order.createdAt).toLocaleString('ar-SA')}</p>
                            </div>
                         </div>
                       )}
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
