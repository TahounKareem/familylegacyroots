import React, { useState, useRef, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAppStore, Message, Order, FamilyData, MediaItem } from "@/lib/store";
import { storage, auth, db } from "@/lib/firebase";
import { signOut, updatePassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Printer,
  Download,
  Settings,
  User,
  LogOut,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  UploadCloud,
  MessageSquare,
  ChevronRight,
  Lock,
  BookOpen,
  Paperclip,
  Check,
  MapPin,
  Mail,
  Phone,
  CalendarCheck,
  UserPlus,
  Compass,
  Telescope,
  Star,
  Play,
  Sparkles,
  Package,
  Image as ImageIcon,
  Home,
  Send,
  MoreVertical,
  Camera,
  Quote,
  Users,
  Book,
  X,
  Edit3,
  PenTool,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  Archive,
  FolderTree,
  Save,
  Trash2,
} from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";
import { TimelineBuilder } from "./TimelineBuilder";

export function Dashboard() {
  const { currentUser, orders, updateOrderStatus, addMessageToOrder } =
    useAppStore();
  const [activeTab, setActiveTab] = useState("السجل الأساسي");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [corrections, setCorrections] = useState([{ section: "", page: "", text: "", error: "" }]);
  const [agreeToCorrectionTerms, setAgreeToCorrectionTerms] = useState(false);
  const [agreeToUploadTerms, setAgreeToUploadTerms] = useState(false);
  const [showCorrectionTerms, setShowCorrectionTerms] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});
  const [confirmState, setConfirmState] = useState<{isOpen: boolean, action: (() => void) | null}>({isOpen: false, action: null});
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState("");

  const [pendingUpload, setPendingUpload] = useState<{
    file: File;
    arrayName: "documents" | "photos";
  } | null>(null);

  const handleProfilePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    try {
      const storageRef = ref(
        storage,
        `users/${currentUser.id}/profile_${Date.now()}`,
      );
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);

      await updateDoc(doc(db, "users", currentUser.id), {
        photoUrl: url,
      });
      useAppStore.setState({ currentUser: { ...currentUser, photoUrl: url } });
    } catch (err: any) {
      console.error("Profile photo upload failed", err);
      alert("حدث خطأ أثناء رفع الصورة الشخصية: " + (err.message || ''));
    } finally {
      setIsUploading(false);
    }
  };
  const [mediaMeta, setMediaMeta] = useState<MediaItem>({
    url: "",
    title: "",
    kind: "",
    description: "",
    purpose: "إضافة لسجل تراث العائلة",
    approximateDate: "",
    associatedPersonsOrPlaces: "",
    additionalNotes: "",
    isCover: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Check for Stripe success redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const orderId = params.get("order_id");
    const isInvite = params.get("invite") === "true";

    if (success === "true" && orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (
        order &&
        (order.status === "بانتظار الدفع" ||
          order.status === "بإنتظار إتمام الدفع")
      ) {
        updateOrderStatus(orderId, "قيد البحث");
        useAppStore.getState().fulfillOrder(orderId, {
          issueStatus: "جاري التنفيذ",
          actionPhase: "مرحلة البحث",
        });
        
        // Trigger emails
        if (currentUser) {
          getDoc(doc(db, "users", currentUser.id)).then((userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              import("@/lib/emailService").then(
                ({ sendCustomerResearchStartedEmail, sendManagementNewOrderEmail }) => {
                  sendCustomerResearchStartedEmail(
                    userData.email,
                    userData.name || "العميل الكريم",
                    order.orderNumber || orderId
                  ).catch(console.error);
                  if (sendManagementNewOrderEmail) {
                    sendManagementNewOrderEmail(order.orderNumber || orderId, order.data.familyName).catch(console.error);
                  }
                },
              );
            }
          });
        }
        navigate("/dashboard", { replace: true });
      }
    }
  }, [location.search, orders, updateOrderStatus, navigate, currentUser]);

  const totalAdminMessagesUnread =
    orders
      .find((o) => o.userId === currentUser?.id)
      ?.messages?.filter((m) => m.senderRole === "admin" && !m.isRead).length ||
    0;

  useEffect(() => {
    const order = orders.find((o) => o.userId === currentUser?.id);
    if (
      activeTab === "استيضاحات فريق البحث" &&
      totalAdminMessagesUnread > 0 &&
      order
    ) {
      useAppStore.getState().markMessagesAsRead(order.id, "user");
    }
  }, [activeTab, totalAdminMessagesUnread, orders, currentUser]);

  if (!currentUser) return <Navigate to="/auth" />;

  const userOrders = orders.filter((o) => o.userId === currentUser.id);
  const order = userOrders[0]; // ONLY 1 order allowed

  const isPostInitialDelivery = order && (
    order.actionPhase === "تم التصويب" ||
    order.actionPhase === "تم الإصدار" ||
    order.actionPhase === "تم تسليم الإصدار الأول" ||
    order.actionPhase === "جاهز للتسليم النهائي" ||
    order.actionPhase === "تم التسليم النهائي" ||
    order.status === "تم الإغلاق" ||
    order.status === "مكتمل"
  );

  // If user just registered and has no order setup, redirect them to complete their data
  // if (!order) return <Navigate to="/order" replace />;

  const isPaid =
    order &&
    order.status !== "بانتظار الدفع" &&
    order.status !== "بإنتظار إتمام الدفع";

  const handleResumePayment = async () => {
    navigate("/order?step=4");
  };

  const handleChangePasswordSubmit = async () => {
    if (!newPasswordValue.trim() || newPasswordValue.length < 8) {
      setPasswordChangeError("كلمة المرور يجب أن لا تقل عن 8 أحرف.");
      return;
    }
    if (!auth.currentUser) return;
    setPasswordChangeLoading(true);
    setPasswordChangeError("");
    try {
      await updatePassword(auth.currentUser, newPasswordValue);
      setShowChangePasswordModal(false);
      setNewPasswordValue("");
      const userEmail = currentUser?.email || auth.currentUser.email;
      const userName = currentUser?.name || "العميل الكريم";
      if (userEmail) {
        import("@/lib/emailService").then(({ sendPasswordChangedSuccessEmail }) => {
          sendPasswordChangedSuccessEmail(userEmail, userName).catch(console.error);
        });
      }
      setSuccessModal({
        isOpen: true,
        title: "تم تغيير كلمة المرور بنجاح",
        subtitle: "يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول."
      });
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/requires-recent-login') {
        setPasswordChangeError("الرجاء تسجيل الخروج وتسجيل الدخول مجدداً لتغيير كلمة المرور لدواعي أمنية.");
      } else {
        setPasswordChangeError("حدث خطأ أثناء تغيير كلمة المرور.");
      }
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const updateSpecificData = async (updates: Partial<FamilyData>) => {
    if (!order) return;
    const newData = { ...order.data, ...updates };
    useAppStore.setState((s) => ({
      orders: s.orders.map((o) =>
        o.id === order.id ? { ...o, data: newData } : o,
      ),
    }));
    await updateDoc(doc(db, "orders", order.id), { data: newData });
  };

  const uploadFileAndUpdate = (file: File, type: "documents" | "photos") => {
    setPendingUpload({ file, arrayName: type });
    setAgreeToUploadTerms(false);
    setMediaMeta({
      url: "",
      title: "",
      kind: "",
      description: "",
      purpose: "إضافة لسجل تراث العائلة",
      approximateDate: "",
      associatedPersonsOrPlaces: "",
      isCover: false,
    });
  };

  const confirmUpload = async () => {
    if (!pendingUpload || !order) return;
    setIsUploading(true);
    
    let fileToUpload = pendingUpload.file;
    // Check if it's an image and needs compression
    if (fileToUpload.type.startsWith('image/')) {
        try {
            const { default: imageCompression } = await import('browser-image-compression');
            const options = {
                maxSizeMB: 1, // Max size in MB
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            fileToUpload = await imageCompression(fileToUpload, options);
        } catch (error) {
            console.error("Image compression failed, using original file", error);
        }
    }

    const storageRef = ref(
      storage,
      `orders/${order.id}/${pendingUpload.arrayName}/${Date.now()}_${fileToUpload.name}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
        alert("فشل رفع الملف.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const currentArr = order.data[pendingUpload.arrayName] || [];
        await updateSpecificData({
          [pendingUpload.arrayName]: [
            ...currentArr,
            { ...mediaMeta, url: downloadURL },
          ],
        });
        setIsUploading(false);
        setPendingUpload(null);
      },
    );
  };

  const handleSendCorrection = async () => {
    const isValid = corrections.every(c => c.section.trim() && c.page.trim() && c.text.trim() && c.error.trim());
    if (
      !order ||
      !isValid ||
      !agreeToCorrectionTerms
    )
      return;
    
    let combinedMessage = "تم إرسال طلب تصويبات متعددة:\n\n";
    corrections.forEach((c, i) => {
      combinedMessage += `=== تصويب رقم ${i + 1} ===\n`;
      combinedMessage += `القسم: ${c.section}\nالصفحة: ${c.page}\nالملاحظة المطلوب تعديلها:\n${c.error}\nالتصويب المقترح:\n${c.text}\n\n`;
    });

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "user",
      text: combinedMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    
    // Status update & Timeline
    try {
      await addMessageToOrder(order.id, newMessage, order.status, {
        issueStatus: "جاري التصويب",
        actionPhase: "جاري التصويب",
      });

      await useAppStore.getState().logTimelineEvent(
        order.id,
        "العميل أرسل طلب تصويب - تم تغيير الحالة إلى جاري التصويب"
      );
      
      import("@/lib/emailService").then(({ sendCustomerCorrectionsReceivedEmail, sendResearchCorrectionsEmail }) => {
        sendCustomerCorrectionsReceivedEmail(
          currentUser.email || "info@thefamilylegacyroots.com", 
          currentUser.name || "العميل الكريم", 
          order.orderNumber || order.id
        ).catch(console.error);
        sendResearchCorrectionsEmail(
          order.data?.familyName || "العائلة",
          order.orderNumber || order.id
        ).catch(console.error);
      });
    } catch (e) {
      console.error(e);
    }

    setCorrections([{ section: "", page: "", text: "", error: "" }]);
    setAgreeToCorrectionTerms(false);
    setSuccessModal({
      isOpen: true,
      title: "تم إرسال طلب التصويب بنجاح!",
      subtitle: "استلمنا طلب التصويب، سيقوم فريق البحث والتوثيق بمراجعته ودراسته وسنوافيك بالتحديثات فور الانتهاء."
    });
    setShowCorrectionTerms(false);
  };

  const handleSendReply = () => {
    if (!order || (!replyText.trim() && replyAttachments.length === 0)) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "user",
      text: replyText,
      attachments: replyAttachments,
      createdAt: new Date().toISOString(),
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
      <div className="w-5 h-5 rounded-full bg-brand-200 text-brand-700 font-bold text-xs flex items-center justify-center cursor-help">
        i
      </div>
      <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-64 bg-brand-50 border border-brand-200 text-brand-800 text-xs rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none z-50">
        {text}
      </div>
    </div>
  );

  const SidebarItem = ({
    title,
    isActive,
    isLocked,
    info,
    badge,
  }: {
    title: string;
    isActive: boolean;
    isLocked?: boolean;
    info?: string;
    badge?: number;
  }) => (
    <button
      disabled={isLocked && title !== "السجل الأساسي"}
      onClick={() => setActiveTab(title)}
      className={`w-full text-right px-4 py-2.5 rounded-xl transition flex items-center justify-between group/btn relative font-sans text-sm border
        ${isLocked && title !== "السجل الأساسي" ? "opacity-50 cursor-not-allowed" : ""}
        ${isActive ? "bg-brand-50 border-brand-200 text-black font-bold" : "text-black border-transparent hover:bg-brand-50 hover:border-brand-200"}`}
    >
      <div className="flex items-center">
        <span>{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="mr-2 bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-pulse">
            {badge}
          </span>
        )}
        {info && (
          <div className="relative group/tooltip inline-flex items-center justify-center mr-2 z-50">
            <div className="w-4 h-4 rounded-full bg-brand-100 text-brand-500 font-bold text-[10px] flex items-center justify-center cursor-help transition-colors hover:bg-brand-200">
              i
            </div>
            <div className="absolute bottom-full mb-2 right-0 w-60 bg-brand-50 border border-brand-200 text-brand-800 font-normal text-xs rounded-xl p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none z-50">
              {info}
            </div>
          </div>
        )}
      </div>
      {isLocked && title !== "السجل الأساسي" && (
        <Lock className="w-4 h-4 text-brand-400 group-hover/btn:text-brand-500" />
      )}
    </button>
  );

  return (
    <div className="bg-brand-50 min-h-screen pb-10">
      {/* Header & Greeting */}
      <div className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-brand-100/50 mb-8 sticky top-0 z-[90] transition-all py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-5 relative w-full md:w-auto">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative shrink-0 group focus:outline-none focus:ring-4 focus:ring-brand-100 rounded-full transition-all"
            >
              {currentUser.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-[3px] border-white shadow-md object-cover group-hover:border-brand-100 transition-colors"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 border-[3px] border-white shadow-md flex items-center justify-center text-brand-700 font-bold text-2xl group-hover:from-brand-200 group-hover:to-brand-100 transition-all uppercase">
                  {currentUser.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute bottom-0 left-0 bg-white rounded-full p-1 border border-brand-100 shadow-sm flex items-center justify-center translate-y-1 -translate-x-1">
                <Settings className="w-3.5 h-3.5 text-brand-500" />
              </div>
            </button>
            <div className="text-center md:text-right flex flex-col items-center md:items-start">
              <span className="text-xs font-bold text-brand-400 mb-0.5 uppercase tracking-wider">مرحباً بك</span>
              <h1 className="text-2xl font-bold font-serif text-brand-900 leading-tight">
                {currentUser.name || "العميل الكريم"}
              </h1>
            </div>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                ></div>
                <div className="absolute top-[80px] right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 w-64 bg-brand-50 rounded-3xl shadow-xl border-2 border-brand-200 overflow-hidden py-3 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                  <button
                    onClick={() => {
                      setActiveTab("الملف الشخصي");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-right px-5 py-3.5 text-sm hover:bg-brand-100 text-brand-800 font-semibold flex items-center gap-3 transition-colors"
                  >
                    <User className="w-5 h-5 text-brand-600" /> الملف الشخصي
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("إعدادات");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-right px-5 py-3.5 text-sm hover:bg-brand-100 text-brand-800 font-semibold flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-brand-600" /> إعدادات
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("عقد تسجيل الخدمة");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-right px-5 py-3.5 text-sm hover:bg-brand-100 text-brand-800 font-semibold flex items-center gap-3 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-brand-600" /> عقد تسجيل
                    الخدمة
                  </button>
                  <div className="border-t border-brand-200 my-2 mx-4"></div>
                  <button
                    onClick={async () => {
                      await signOut(auth);
                      useAppStore.getState().logout();
                      window.location.href = "/auth";
                    }}
                    className="w-full text-right px-5 py-3.5 text-sm hover:bg-red-100 text-red-600 font-semibold flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> تسجيل الخروج
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("السجل الأساسي")}
              className="flex-1 sm:flex-none justify-center px-6 py-2.5 bg-brand-800 text-white hover:bg-brand-900 rounded-2xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-sm border border-brand-700"
            >
              <Compass className="w-4 h-4" />
              السجل الأساسي
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-100 sticky top-8 z-50">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">
                  البوابة الرئيسية
                </h3>
                <div className="space-y-1">
                  <SidebarItem
                    title="السجل الأساسي"
                    isActive={activeTab === "السجل الأساسي"}
                  />
                  <SidebarItem
                    title="بيانات أمين السجل"
                    isActive={activeTab === "بيانات أمين السجل"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="نقطة العرض الأساسية"
                    isActive={activeTab === "نقطة العرض الأساسية"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="قالب التصميم المختار"
                    isActive={activeTab === "قالب التصميم المختار"}
                    isLocked={!isPaid}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4 flex items-center">
                  إثراء سجل العائلة
                  <div className="relative group/tooltip inline-flex items-center justify-center mr-2 z-50">
                    <div className="w-4 h-4 rounded-full bg-brand-100 text-brand-500 font-bold text-[10px] flex items-center justify-center cursor-help">
                      i
                    </div>
                    <div className="absolute bottom-full mb-2 right-0 w-64 bg-brand-50 border border-brand-200 text-brand-800 font-normal text-xs rounded-xl p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl leading-relaxed whitespace-pre-wrap text-right pointer-events-none normal-case z-50">
                      هذا القسم يتيح لك إضافة المعلومات التي تجعل من السجل خاصاً ومميزاً لعائلتك. يمكنك من خلاله توثيق التاريخ والأماكن والشخصيات والذكريات.
                    </div>
                  </div>
                </h3>
                <div className="space-y-1">
                  <SidebarItem
                    title="ساهم في بناء ذاكرة عائلتك"
                    isActive={activeTab === "ساهم في بناء ذاكرة عائلتك"}
                    isLocked={!isPaid}
                  />
                  {(activeTab === "ساهم في بناء ذاكرة عائلتك" || ["كلمة أمين السجل", "نبذة عن العائلة", "أماكن ارتبطت بالعائلة", "أعلام الأسرة وألقابها", "شخصيات ورموز العائلة", "المهن والأعمال والإرث المهني", "ذاكرة العائلة والإرث الاجتماعي", "خزانة السجل (أرشيف العائلة)", "نافذة الإدراج العائلي", "التسلسل الزمني للعائلة"].includes(activeTab)) && (
                    <div className="pr-4 border-r-2 border-brand-100 flex flex-col gap-1 mt-1 mb-2">
                  <SidebarItem
                    title="كلمة أمين السجل"
                    isActive={activeTab === "كلمة أمين السجل"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="نبذة عن العائلة"
                    isActive={activeTab === "نبذة عن العائلة"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="أماكن ارتبطت بالعائلة"
                    isActive={activeTab === "أماكن ارتبطت بالعائلة"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="أعلام الأسرة وألقابها"
                    isActive={activeTab === "أعلام الأسرة وألقابها"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="شخصيات ورموز العائلة"
                    isActive={activeTab === "شخصيات ورموز العائلة"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="المهن والأعمال والإرث المهني"
                    isActive={activeTab === "المهن والأعمال والإرث المهني"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="ذاكرة العائلة والإرث الاجتماعي"
                    isActive={activeTab === "ذاكرة العائلة والإرث الاجتماعي"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="خزانة السجل (أرشيف العائلة)"
                    isActive={activeTab === "خزانة السجل (أرشيف العائلة)"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="نافذة الإدراج العائلي"
                    isActive={activeTab === "نافذة الإدراج العائلي"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="التسلسل الزمني للعائلة"
                    isActive={activeTab === "التسلسل الزمني للعائلة"}
                    isLocked={!isPaid}
                  />
                  </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">
                  التواصل والتحديثات
                </h3>
                <div className="space-y-1">
                  <SidebarItem
                    title="استيضاحات فريق البحث"
                    isActive={activeTab === "استيضاحات فريق البحث"}
                    isLocked={!isPaid}
                    info="عند وجود استفسار من فريق البحث ستظهر لك رسالة طلب ايضاح من قبلهم ، بحيث ستتمكن من الرد على الإستفسار بسهولة وخصوصية وأمان ."
                    badge={totalAdminMessagesUnread}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">
                  ابق سجلك حياً
                </h3>
                <div className="space-y-1">
                  <SidebarItem
                    title="النسخة الرقمية للسجل"
                    isActive={activeTab === "النسخة الرقمية للسجل"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="بوستر عمود النسب"
                    isActive={activeTab === "بوستر عمود النسب"}
                    isLocked={!isPaid}
                  />
                  <SidebarItem
                    title="التصويبات"
                    isActive={activeTab === "التصويبات"}
                    isLocked={!isPaid}
                    info="هذه الخاصية ستظهر عند استلامكم السجل الخاص بكم حيث سيتم تفعيل هذه الخاصية لتتمكنوا من ارسال التصويبات ان وجدت ."
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 pr-4">
                  فتح الأبواب المغلقة
                </h3>
                <div className="space-y-1">
                  <SidebarItem
                    title="فتح الأبواب المغلقة"
                    isActive={activeTab === "فتح الأبواب المغلقة"}
                    isLocked={!isPaid}
                    info="بحث متقدم. هذه الخدمة ستظهر تفاصيلها بعد صدور السجل الأساسي والذي يمثل البوابة الرئيسية في سجل تراث العائلة ، من أجل فتح بعض الأبواب المغلقة وتوسيع البحث ."
                  />
                </div>
              </div>

              {/* Social Media & Outer Links */}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-brand-100 min-h-[600px]">
                {/* MAIN CONTENT */}
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-3xl font-serif font-bold text-brand-900 mb-8 pb-4 border-b border-brand-100">
                    {activeTab}
                  </h2>

                  {(activeTab === "السجل الأساسي" || activeTab === "ساهم في بناء ذاكرة عائلتك") &&
                    (() => {
                      const isState1 = !order || order.issueStatus === "طلب غير مكتمل";
                      const isState2 =
                        order && (order.issueStatus === "بإنتظار إتمام الدفع" ||
                        (!isPaid && order.issueStatus !== "طلب غير مكتمل"));
                      const isState3 =
                        order?.issueStatus === "جاري التنفيذ" &&
                        order?.actionPhase === "مرحلة البحث";
                      const isState4 =
                        order?.issueStatus === "جاري التنفيذ" &&
                        (order?.actionPhase === "مرحلة التوثيق" || 
                         order?.actionPhase === "تمت المسودة" ||
                         order?.actionPhase === "تم التصميم الإلكتروني");
                      const isState5 = order?.issueStatus === "تم الإصدار";
                      const isState6 =
                        order?.issueStatus === "جاري التصويب" ||
                        order?.issueStatus === "يوجد تصويبات" ||
                        order?.actionPhase === "جاري التصويب";
                      const isState7 = order?.issueStatus === "تم الإغلاق";

                      let title = "";
                      const statusText = order?.issueStatus || "طلب غير مكتمل";
                      let actionText = "";
                      let subText = "";
                      let actionButton = null;

                      if (isState1) {
                        title =
                          "كل جيل يحمل جزءًا من الرواية… حتى يأتي من يجمعها في سجل واحد";
                        actionText = "يمكنك متابعة رحلة التوثيق في اي وقت";
                        actionButton = (
                          <button
                            onClick={() => {
                              if (!order) navigate("/order");
                              else setActiveTab("بيانات أمين السجل");
                            }}
                            className="mt-6 w-full text-center bg-[#C3262A] hover:bg-[#a61c20] text-white font-bold py-4 rounded-xl transition shadow-lg text-lg"
                          >
                            أكمل رحلة التوثيق
                          </button>
                        );
                      } else if (isState2) {
                        title =
                          "ما لا يُوثق اليوم… قد يصبح مجرد رواية غامضة غدًا.";
                        actionText =
                          "اكمل عملية الدفع ليتمكن الفريق من بدء التنفيذ";
                        actionButton = (
                          <button
                            onClick={handleResumePayment}
                            className="mt-6 w-full text-center bg-[#C3262A] hover:bg-[#a61c20] text-white font-bold py-4 rounded-xl transition shadow-lg text-lg"
                          >
                            إتمام الدفع وبدء التنفيذ
                          </button>
                        );
                      } else if (isState3) {
                        title =
                          "“كل إضافة اليوم… تصبح جزءًا محفوظًا من ذاكرة العائلة للأجيال القادمة.”";
                        actionText = "حالياً نقوم بالأعمال البحثية";
                        subText =
                          "نقوم بالأعمال البحثية وبناء عمود النسب لسجل عائلتكم وفق المواد والمعلومات المعتمدة.";
                      } else if (isState4) {
                        title =
                          "“كل إضافة اليوم… تصبح جزءًا محفوظًا من ذاكرة العائلة للأجيال القادمة.”";
                        actionText = "حالياً نقوم بأعمال التوثيق";
                        subText =
                          "نعمل حاليًا على توثيق مخرجات سجل تراث عائلتكم";
                      } else if (isState5) {
                        title =
                          "الآن اصبح تراث عائلتك كتاباً .. سجل تراث عائلتك بين يديك";
                        actionText = "تم إصدار النسخة الأولية";
                        subText =
                          'يسرنا اخبارك بصدور النسخة الأولية من سجل عائلتك ، يمكنك تصفح النسخة الرقمية من نافذة "النسخة الرقمية " ، كما يمكنك في حالة وجود تصويبات على هذه النسخة الأولية تعبئة جدول التصويبات عبر نافذة "تصويبات" في القائمة اليمنى.';
                        actionButton = (
                          <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button
                              onClick={() => {
                                setActiveTab("النسخة الرقمية للسجل");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="flex-1 text-center bg-[#C3262A] hover:bg-[#a61c20] text-white font-bold py-4 rounded-xl transition shadow-lg text-lg"
                            >
                              مشاهدة النسخة الرقمية
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab("التصويبات");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="flex-1 text-center bg-brand-50 border border-brand-200 text-brand-900 font-bold py-4 rounded-xl transition shadow-sm text-lg hover:bg-brand-100"
                            >
                              طلب تصويب
                            </button>
                          </div>
                        );
                      } else if (isState6) {
                        title =
                          "الآن اصبح تراث عائلتك كتاباً .. سجل تراث عائلتك بين يديك";
                        actionText = "سجل تراث عائلتكم قيد التصويب";
                        subText =
                          "نعمل حاليًا على مراجعة طلب التصويب لسجلكم ، ستتغير حالة السجل آلياً عند صدور النسخة النهائية من سجل تراث عائلتكم .";
                      } else if (isState7) {
                        title =
                          "الآن اصبح تراث عائلتك كتاباً .. سجل تراث عائلتك بين يديك";
                        actionText = "تم إصدار النسخة النهائية .";
                        subText =
                          'تم إصدار النسخة النهائية من سجل تراث عائلتكم ، ويمكنكم استعراض وتحميل هذه النسخة من نافذة "النسخة الرقمية" كما تم ارسال النسخ الورقية وبوستر مخطط عمود النسب الى عنوانكم البريدي .';
                        actionButton = (
                          <button
                            onClick={() => {
                              setActiveTab("النسخة الرقمية للسجل");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="mt-6 w-full text-center bg-[#C3262A] hover:bg-[#a61c20] text-white font-bold py-4 rounded-xl transition shadow-lg text-lg"
                          >
                            مشاهدة وتحميل النسخة الرقمية
                          </button>
                        );
                      } else {
                        title = "كل جيل يحمل جزءًا من الرواية…";
                        actionText = "تابع السجل";
                      }

                      return (
                        <div className="space-y-8 max-w-4xl mx-auto">
                          <div className="text-center py-8">
                            <h2 className="text-3xl md:text-4xl font-serif text-[#C3262A] font-bold leading-tight px-4">
                              {title}
                            </h2>
                          </div>

                          {activeTab !== "ساهم في بناء ذاكرة عائلتك" && (
                            <div className="bg-white rounded-3xl overflow-hidden border border-brand-100 shadow-sm relative">
                              <div className="bg-brand-50 p-6 border-b border-brand-100 text-center">
                                <h3 className="font-bold text-2xl text-brand-900 mb-1">
                                  السجل الأساسي
                                </h3>
                                <p className="text-brand-600">
                                  مركز إدارة ومتابعة إصدار سجل تراث عائلتكم
                                </p>
                              </div>

                              <div className="p-8 space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="flex-1 bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
                                    <div className="flex items-center gap-3 mb-2">
                                      <CheckCircle className="w-6 h-6 text-brand-400" />
                                      <h4 className="font-bold text-brand-900 text-lg">
                                        حالة السجل :
                                      </h4>
                                    </div>
                                    <p className="text-xl font-bold text-brand-600 mt-2">
                                      {statusText || "جاري التنفيذ"}
                                    </p>
                                  </div>

                                  <div className="flex-[2] bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Compass className="w-6 h-6 text-brand-400" />
                                      <h4 className="font-bold text-brand-900 text-lg">
                                        الإجراء :{" "}
                                        <span className="font-normal text-brand-700">
                                          {actionText}
                                        </span>
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {((subText && !(activeTab === "ساهم في بناء ذاكرة عائلتك" && isState3)) || actionButton) && (
                            <div className="bg-white rounded-3xl overflow-hidden border border-brand-100 shadow-sm relative mt-4">
                              <div className="p-8 space-y-6">
                                {(subText && !(activeTab === "ساهم في بناء ذاكرة عائلتك" && isState3)) && (
                                  <p className="text-lg text-brand-800 leading-relaxed font-medium text-center">
                                    {subText}
                                  </p>
                                )}
                                {actionButton}
                              </div>
                            </div>
                          )}

                          {(isState3 || isState4) && (
                            <>
                                                            <div className="mt-8 bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-sm text-center relative overflow-hidden">
                                <div className="absolute top-0 start-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -translate-x-10 -translate-y-10 opacity-50 pointer-events-none"></div>
                                <div className="absolute bottom-0 end-0 w-32 h-32 bg-brand-100 rounded-full blur-3xl translate-x-10 translate-y-10 opacity-50 pointer-events-none"></div>
                                <h3 className="text-2xl font-bold text-brand-900 mb-6 relative z-10">
                                  نسبة المساهمة في الإثراء
                                </h3>
                                {(() => {
                                  const closedCount = Object.values(order.data.sectionStatuses || {}).filter(s => s === "closed").length;
                                  const completionPercentage = (closedCount / 10) * 100;
                                  const orderDate = new Date(order.createdAt);
                                  const endDate = new Date(orderDate.getTime() + 15 * 24 * 60 * 60 * 1000);
                                  const today = new Date();
                                  const remainingMs = endDate.getTime() - today.getTime();
                                  const remainingDays = remainingMs > 0 ? Math.ceil(remainingMs / (1000 * 60 * 60 * 24)) : 0;
                                  
                                  return (
                                    <div className="relative z-10 max-w-2xl mx-auto">
                                      <div className="w-full bg-gray-100 rounded-full h-8 mb-4 border border-gray-200 overflow-hidden relative">
                                        <div 
                                          className="bg-green-500 h-8 rounded-full transition-all duration-1000 flex items-center justify-center text-white font-bold text-sm"
                                          style={{ width: `${completionPercentage}%` }}
                                        >
                                          {completionPercentage > 5 && `${completionPercentage}%`}
                                        </div>
                                        {completionPercentage <= 5 && <div className="absolute inset-0 flex items-center justify-center text-brand-700 font-bold text-sm">{completionPercentage}%</div>}
                                      </div>
                                      
                                      {completionPercentage === 100 ? (
                                        <p className="text-green-600 font-bold text-lg flex items-center justify-center gap-2 animate-pulse">
                                          <Sparkles className="w-5 h-5"/> شكراً لك، لقد أتممت مساهمتك في الإثراء بنجاح! <Sparkles className="w-5 h-5"/>
                                        </p>
                                      ) : (
                                        <p className="text-brand-700 font-bold text-lg bg-brand-50 p-3 rounded-xl inline-block border border-brand-100 shadow-sm">
                                          لازال أمامك ({remainingDays} يوم) لاستكمال المساهمة في الإثراء
                                        </p>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>

<div className="bg-white rounded-3xl p-8 border border-brand-100 shadow-sm mt-8">
                                <div className="text-center mb-8">
                                  <h3 className="text-2xl font-bold text-brand-900 mb-4">
                                    إثراء السجل العائلي
                                  </h3>
                                  <div className="space-y-4 text-brand-700 leading-relaxed max-w-3xl mx-auto">
                                    <h4 className="text-xl font-bold text-brand-800">ساهم في بناء ذاكرة عائلتك</h4>
                                    <p>
                                      لا تقتصر قيمة سجل تراث العائلة على ما تذكره المصادر والوثائق التاريخية فقط، بل تمتد إلى الروايات والذكريات والصور والوثائق الخاصة التي حفظتها العائلة عبر الأجيال.
                                    </p>
                                    <p>
                                      من خلال الأقسام التالية يمكنك إضافة ما تراه مناسباً من معلومات أو صور أو وثائق أو قصص عائلية، لتصبح جزءاً من المادة التي يستفيد منها فريق البحث عند إعداد سجل تراث عائلتك.
                                    </p>
                                    <p>
                                      جميع الأقسام التالية اختيارية، ويمكن استكمالها أو تعديلها في أي وقت خلال فترة إعداد السجل.<br />
                                      <strong>كل معلومة تضيفها اليوم قد تصبح جزءاً من الذاكرة التي تحفظها عائلتك للأجيال القادمة.</strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {[
                                    { tab: "كلمة أمين السجل", icon: <PenTool className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "تقديم وكلمة شخصية", desc: "نافذة تتيح لك كتابة تقديم لسجلك بحرية كاملة." },
                                    { tab: "نبذة عن العائلة", icon: <FileText className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "اكتب قصة عائلتكم", desc: "أضف نبذة تعريفية تُمهّد لسجل العائلة وتعكس هويتها." },
                                    { tab: "أماكن ارتبطت بالعائلة", icon: <MapPin className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "المأوى والجذور", desc: "وثق الأماكن التي ارتبطت بتطور واستقرار العائلة." },
                                    { tab: "أعلام الأسرة وألقابها", icon: <Users className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "الألقاب والأسماء", desc: "نبذة عن الألقاب التاريخية ومصادر أسماء العائلة." },
                                    { tab: "شخصيات ورموز العائلة", icon: <Star className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "الرموز والشخصيات", desc: "توثيق للشخصيات البارزة والمحورية في تاريخ العائلة." },
                                    { tab: "المهن والأعمال والإرث المهني", icon: <Briefcase className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "النشاط المهني والتجاري", desc: "ما تميزت به العائلة من مهن وتجارة عبر الأجيال." },
                                    { tab: "ذاكرة العائلة والإرث الاجتماعي", icon: <HeartHandshake className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "العادات والتراث", desc: "تدوين للتراث الاجتماعي والعادات التي احتفظت بها العائلة." },
                                    { tab: "خزانة السجل (أرشيف العائلة)", icon: <Archive className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "الصور والوثائق", desc: "أرشيف يضم الوثائق والمخطوطات والصور القديمة." },
                                    { tab: "نافذة الإدراج العائلي", icon: <FolderTree className="w-10 h-10 text-brand-400 mb-4 group-hover:text-brand-600 transition" />, subtitle: "مخطط شجرة العائلة", desc: "أدرج أفراد عائلتك في مخطط الشجرة المدمج." },
                                  ].map((item, idx) => {
                                    const keyMap: Record<string, string> = {
                                      "كلمة أمين السجل": "managerWord",
                                      "نبذة عن العائلة": "historicalNotes",
                                      "أماكن ارتبطت بالعائلة": "placesAssociated",
                                      "أعلام الأسرة وألقابها": "familyNames",
                                      "شخصيات ورموز العائلة": "familyPersonalities",
                                      "المهن والأعمال والإرث المهني": "professions",
                                      "ذاكرة العائلة والإرث الاجتماعي": "familyMemory",
                                      "خزانة السجل (أرشيف العائلة)": "archive",
                                      "نافذة الإدراج العائلي": "familyTree",
                                    };
                                    const storeKey = keyMap[item.tab];
                                    const status = storeKey ? order.data.sectionStatuses?.[storeKey] : null;
                                    const arrayData = storeKey === 'archive' ? order.data.documents : storeKey === 'familyTree' ? order.data.treeData?.nodes : null;
                                    const hasData = storeKey ? !!(storeKey === 'archive' || storeKey === 'familyTree' ? (arrayData && arrayData.length > 0) : (order.data as any)[storeKey]) : false;

                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => setActiveTab(item.tab)}
                                        className="relative p-6 bg-brand-50/30 border border-brand-100 rounded-2xl hover:border-brand-300 hover:bg-brand-50 transition text-right group flex flex-col items-start overflow-hidden"
                                      >
                                        {status === "closed" && (
                                          <div className="absolute top-0 right-0 left-0 bg-emerald-500 text-white text-[10px] font-bold py-1 px-3 text-center shadow-sm">
                                            مغلق - نسخة نهائية
                                          </div>
                                        )}
                                        {!status && hasData && (
                                          <div className="absolute top-0 right-0 left-0 bg-amber-500 text-white text-[10px] font-bold py-1 px-3 text-center shadow-sm">
                                            مسودة قيد التعديل
                                          </div>
                                        )}
                                        {status === "draft" && (
                                          <div className="absolute top-0 right-0 left-0 bg-amber-500 text-white text-[10px] font-bold py-1 px-3 text-center shadow-sm">
                                            مسودة قيد التعديل
                                          </div>
                                        )}
                                        <div className={`mt-${status || hasData ? '4' : '0'}`}>
                                          {item.icon}
                                        </div>
                                        <h4 className="font-bold text-brand-900 text-lg mb-2">
                                          {item.tab}
                                        </h4>
                                        <p className="text-brand-600 font-bold mb-2">
                                          {item.subtitle}
                                        </p>
                                        <p className="text-xs text-brand-500 leading-relaxed mt-auto">
                                          {item.desc}
                                        </p>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="bg-white rounded-3xl p-8 border border-brand-100 shadow-sm mt-8">
                                <div className="text-center mb-8">
                                  <h3 className="text-2xl font-bold text-brand-900 mb-2">
                                    التسلسل الزمني للعائلة
                                  </h3>
                                  <p className="text-black font-medium leading-relaxed max-w-2xl mx-auto">
                                    وثق أهم المحطات والأحداث التاريخية التي مرت بها العائلة وصنع منها تسلسلاً زمنياً
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                  <button
                                    onClick={() => setActiveTab("التسلسل الزمني للعائلة")}
                                    className="p-6 bg-brand-50/30 border border-brand-100 rounded-2xl hover:border-brand-300 hover:bg-brand-50 transition text-right group flex flex-col md:flex-row items-start gap-6"
                                  >
                                    <Clock className="w-16 h-16 text-brand-400 group-hover:text-brand-600 transition shrink-0" />
                                    <div>
                                      <h4 className="font-bold text-brand-900 text-xl mb-2">
                                        التسلسل الزمني للعائلة
                                      </h4>
                                      <p className="text-brand-600 font-bold mb-2">
                                        سجل الأحداث والتواريخ
                                      </p>
                                      <p className="text-sm text-brand-500 leading-relaxed max-w-2xl">
                                        هذه الإضافة تتيح للمستخدم توثيق أهم المحطات التاريخية (مثل سنوات القحط، بناء مسجد، المشاركة في معركة، أو تولي منصب).
                                      </p>
                                    </div>
                                  </button>
                                </div>
                              </div>


                            </>
                          )}
                        </div>
                      );
                    })()}

                  {activeTab === "بيانات أمين السجل" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-brand-900 text-lg p-6 bg-white border border-brand-100 rounded-2xl shadow-sm">
                        <div className="col-span-2 border-b border-brand-100 pb-2 mb-2 font-bold flex items-center gap-2">
                          <Lock className="w-4 h-4 text-brand-400" /> البيانات
                          الأساسية
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            الاسم الأول:
                          </span>{" "}
                          <strong>{order.data.firstName}</strong>
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            اسم الأب:
                          </span>{" "}
                          <strong>{order.data.fatherName}</strong>
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            اسم الجد:
                          </span>{" "}
                          <strong>{order.data.grandfatherName}</strong>
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            اللقب / العائلة:
                          </span>{" "}
                          <strong>{order.data.familyName}</strong>
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            القبيلة / العائلة:
                          </span>{" "}
                          <strong>{order.data.tribeName || "غير متوفر"}</strong>
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            الدولة:
                          </span>{" "}
                          <strong>{order.data.country}</strong>
                        </div>
                        <div>
                          <span className="block text-sm text-brand-500 mb-1">
                            الموطن الأصلي:
                          </span>{" "}
                          <strong>{order.data.homeland}</strong>
                        </div>
                      </div>

                      <div className="p-6 bg-brand-50 border border-brand-200 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-brand-900 border-b border-brand-200 pb-4 mb-4 flex items-center gap-2 text-lg">
                          <MapPin className="w-5 h-5 text-brand-600" /> بيانات
                          التواصل والعنوان البريدي
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">
                              الهاتف النقال
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 rounded-xl border border-brand-200 focus:ring-brand-500 focus:border-brand-500"
                              placeholder="رقم الهاتف متضمناً رمز الدولة"
                              value={order.data.mobileNumber || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                useAppStore.setState((s) => ({
                                  orders: s.orders.map((o) =>
                                    o.id === order.id
                                      ? {
                                          ...o,
                                          data: {
                                            ...o.data,
                                            mobileNumber: val,
                                          },
                                        }
                                      : o,
                                  ),
                                }));
                              }}
                              onBlur={(e) =>
                                updateSpecificData({
                                  mobileNumber: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-span-2 mt-4">
                            <label className="flex items-center text-brand-900 font-bold mb-4">
                              العنوان البريدي (الذي ترغب شحن الباقة اليه):{" "}
                              <InfoTooltip text="العنوان البريدي من اجل توصيل الباقة اليكم ." />
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">
                                  الدولة
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 rounded-xl border border-brand-200"
                                  value={
                                    order.data.shippingAddress?.country || ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    useAppStore.setState((s) => ({
                                      orders: s.orders.map((o) =>
                                        o.id === order.id
                                          ? {
                                              ...o,
                                              data: {
                                                ...o.data,
                                                shippingAddress: {
                                                  ...o.data.shippingAddress,
                                                  country: val,
                                                } as any,
                                              },
                                            }
                                          : o,
                                      ),
                                    }));
                                  }}
                                  onBlur={(e) =>
                                    updateSpecificData({
                                      shippingAddress: {
                                        ...(order.data.shippingAddress as any),
                                        country: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">
                                  المقاطعة / المحافظة
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 rounded-xl border border-brand-200"
                                  value={
                                    order.data.shippingAddress?.state || ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    useAppStore.setState((s) => ({
                                      orders: s.orders.map((o) =>
                                        o.id === order.id
                                          ? {
                                              ...o,
                                              data: {
                                                ...o.data,
                                                shippingAddress: {
                                                  ...o.data.shippingAddress,
                                                  state: val,
                                                } as any,
                                              },
                                            }
                                          : o,
                                      ),
                                    }));
                                  }}
                                  onBlur={(e) =>
                                    updateSpecificData({
                                      shippingAddress: {
                                        ...(order.data.shippingAddress as any),
                                        state: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">
                                  العنوان بالتفصيل
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 rounded-xl border border-brand-200"
                                  value={
                                    order.data.shippingAddress?.street || ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    useAppStore.setState((s) => ({
                                      orders: s.orders.map((o) =>
                                        o.id === order.id
                                          ? {
                                              ...o,
                                              data: {
                                                ...o.data,
                                                shippingAddress: {
                                                  ...o.data.shippingAddress,
                                                  street: val,
                                                } as any,
                                              },
                                            }
                                          : o,
                                      ),
                                    }));
                                  }}
                                  onBlur={(e) =>
                                    updateSpecificData({
                                      shippingAddress: {
                                        ...(order.data.shippingAddress as any),
                                        street: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-brand-600 mb-1">
                                  الرقم البريدي
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 rounded-xl border border-brand-200"
                                  value={order.data.shippingAddress?.zip || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    useAppStore.setState((s) => ({
                                      orders: s.orders.map((o) =>
                                        o.id === order.id
                                          ? {
                                              ...o,
                                              data: {
                                                ...o.data,
                                                shippingAddress: {
                                                  ...o.data.shippingAddress,
                                                  zip: val,
                                                } as any,
                                              },
                                            }
                                          : o,
                                      ),
                                    }));
                                  }}
                                  onBlur={(e) =>
                                    updateSpecificData({
                                      shippingAddress: {
                                        ...(order.data.shippingAddress as any),
                                        zip: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <p className="text-xs text-brand-400 mt-3">
                              يتم حفظ التعديلات تلقائياً عند النقر خارج المربع.
                            </p>
                          </div>
                        </div>
                      </div>


                    </div>
                  )}

                  {activeTab === "نقطة العرض الأساسية" && (
                    <div className="p-8 bg-brand-50 rounded-2xl border border-brand-200 text-center">
                      <p className="text-brand-600 mb-4 font-light">
                        بناءً على طلبكم، نقطة الانطلاق المعتمدة لبدء التوثيق
                        لعمود النسب هي:
                      </p>
                      <div className="flex justify-center items-center gap-4 text-3xl font-serif text-brand-900 font-bold border-y-2 border-brand-200 py-6 max-w-lg mx-auto">
                        <UserPlus className="w-10 h-10 text-brand-600" />
                        <span>
                          {order.data.startingPointType === "أنا أمين السجل"
                            ? `أمين السجل: ${order.data.firstName || ""} ${order.data.familyName || ""}`.trim()
                            : order.data.startingPointType === "اسم العائلة"
                              ? `عائلة: ${order.data.familyName}`
                              : order.data.startingPointType === "احد الأسلاف"
                                ? `الجد: ${order.data.startingPointName}`
                                : `أمين السجل: ${order.data.firstName || ""} ${order.data.familyName || ""}`.trim()}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "قالب التصميم المختار" && (
                    <div className="p-8 bg-white border-2 border-brand-100 rounded-2xl text-center">
                      <div className="text-4xl font-serif text-brand-900 mb-4">
                        {order.data.designTemplate}
                      </div>
                      <p className="text-brand-600">
                        سيتم تصميم نسخة أنيقة من سجلك بناءً على النموذج{" "}
                        {order.data.designTemplate}.
                      </p>
                    </div>
                  )}

                  {["كلمة أمين السجل", "نبذة عن العائلة", "أماكن ارتبطت بالعائلة", "أعلام الأسرة وألقابها", "شخصيات ورموز العائلة", "المهن والأعمال والإرث المهني", "ذاكرة العائلة والإرث الاجتماعي"].includes(activeTab) && (() => {
                    const key = activeTab === "كلمة أمين السجل" ? "managerWord" :
                              activeTab === "نبذة عن العائلة" ? "historicalNotes" :
                              activeTab === "أماكن ارتبطت بالعائلة" ? "placesAssociated" :
                              activeTab === "أعلام الأسرة وألقابها" ? "familyNames" :
                              activeTab === "شخصيات ورموز العائلة" ? "familyPersonalities" :
                              activeTab === "المهن والأعمال والإرث المهني" ? "professions" :
                              "familyMemory";
                    const status = order.data.sectionStatuses?.[key] || "draft";
                    return (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm relative">
                        {status === "closed" && (
                          <div className="absolute left-6 top-6 flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200" dir="rtl">
                            <Check className="w-3 h-3" /> تم الحفظ والإغلاق (مرسل للإدارة)
                          </div>
                        )}
                        <p className="text-brand-900 font-bold mb-4 flex items-center gap-2 text-xl">
                          <BookOpen className="w-6 h-6 text-brand-600" />
                          {activeTab}
                        </p>
                        
                        {key === "managerWord" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">هذه المساحة مخصصة لك لتكتب كلمة افتتاحية تمثل رؤيتك لهذا العمل، وتعبر عن سبب اهتمامك بتوثيق تاريخ العائلة وحفظه للأبناء والأحفاد.</p>
                            <p className="mb-1 font-semibold">يمكنك التحدث عن:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>سبب إنشاء السجل.</li>
                              <li>أهمية هذا العمل بالنسبة للعائلة.</li>
                              <li>ما تتمنى أن يحققه هذا السجل للأجيال القادمة.</li>
                              <li>رسالة أو إهداء ترغب في تضمينه.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>ما الذي دفعك للبدء في هذا المشروع؟</li>
                              <li>ماذا يعني لك حفظ تاريخ العائلة؟</li>
                              <li>ماذا تتمنى أن يستفيد الأبناء والأحفاد من هذا السجل؟</li>
                              <li>هل ترغب في إهداء هذا العمل لشخص أو جيل معين؟</li>
                            </ul>
                          </div>
                        )}
                        {key === "historicalNotes" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">قدّم تعريفاً عاماً بالعائلة كما تعرفها اليوم، وساعد في رسم صورة أولية عن تاريخها وامتدادها وخصائصها العامة.</p>
                            <p className="mb-1 font-semibold">يمكنك التحدث عن:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>الموطن المعروف للعائلة.</li>
                              <li>مناطق الاستقرار أو الانتشار.</li>
                              <li>المحطات التاريخية المهمة.</li>
                              <li>السمات أو الأدوار التي اشتهرت بها العائلة.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>أين استقرت العائلة عبر الأجيال؟</li>
                              <li>ما أبرز ما تُعرف به العائلة؟</li>
                              <li>هل ارتبطت العائلة بأدوار أو أنشطة معينة؟</li>
                              <li>هل توجد أحداث مهمة يتناقلها أفراد الأسرة؟</li>
                            </ul>
                          </div>
                        )}
                        {key === "placesAssociated" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">وثّق الأماكن التي ارتبطت بتاريخ العائلة أو شكلت جزءاً من ذاكرتها الجماعية عبر الأجيال.</p>
                            <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>المدن أو القرى أو الأحياء.</li>
                              <li>المنازل القديمة.</li>
                              <li>المزارع أو الأوقاف.</li>
                              <li>المجالس أو المواقع التاريخية.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>ما أهم الأماكن التي ارتبطت بتاريخ العائلة؟</li>
                              <li>هل يوجد منزل أو موقع قديم ما زال حاضراً في ذاكرة الأسرة؟</li>
                              <li>هل انتقلت العائلة بين مناطق مختلفة عبر الزمن؟</li>
                            </ul>
                          </div>
                        )}
                        {key === "familyNames" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">يساعد هذا القسم على توثيق الأسماء والكنى والألقاب المتداولة داخل العائلة، بما يعكس جانباً من هويتها الثقافية والاجتماعية.</p>
                            <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>الأسماء المتكررة عبر الأجيال.</li>
                              <li>الكنى المشهورة والألقاب العائلية.</li>
                              <li>أسباب التسميات إن كانت معروفة.</li>
                              <li>الألقاب الخاصة ببعض الفروع.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>ما الأسماء الأكثر تكراراً في العائلة؟</li>
                              <li>هل توجد ألقاب أو كنى متوارثة؟</li>
                              <li>هل تعرف قصة أو سبب تسمية بعض الأسماء أو الألقاب؟</li>
                            </ul>
                          </div>
                        )}
                        {key === "familyPersonalities" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">وثّق الشخصيات التي تركت أثراً في تاريخ العائلة أو في حياة أفرادها، سواء كانت شخصيات عامة أو مؤثرة داخل الأسرة.</p>
                            <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>شخصيات علمية أو دينية.</li>
                              <li>شخصيات اجتماعية أو قيادية.</li>
                              <li>شخصيات تركت أثراً خاصاً في العائلة.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>من الشخصيات التي يتذكرها أفراد العائلة باستمرار؟</li>
                              <li>ما الأثر الذي تركته هذه الشخصية؟</li>
                              <li>ما القيم أو الإنجازات التي اشتهرت بها؟</li>
                            </ul>
                          </div>
                        )}
                        {key === "professions" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">ساعدنا في توثيق الأنشطة والأعمال والمهن التي ارتبطت بالعائلة عبر الأجيال، لما تمثله من جانب مهم في تاريخها الاجتماعي والاقتصادي.</p>
                            <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>التجارة والزراعة.</li>
                              <li>التعليم والقضاء.</li>
                              <li>الحرف التقليدية.</li>
                              <li>الأعمال المهنية أو الحرفية.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>ما أبرز المهن التي عُرفت بها العائلة؟</li>
                              <li>هل ارتبطت بعض الفروع بمهن محددة؟</li>
                              <li>هل توجد أعمال أو مؤسسات أنشأها أفراد العائلة؟</li>
                            </ul>
                          </div>
                        )}
                        {key === "familyMemory" && (
                          <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                            <p className="mb-2 font-bold">هذا القسم مخصص للذكريات والعادات والتقاليد والروايات الاجتماعية التي شكلت ذاكرة العائلة عبر الأجيال.</p>
                            <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                            <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                              <li>العادات المتوارثة وتقاليد المناسبات.</li>
                              <li>المجالس والتجمعات العائلية.</li>
                              <li>الحكم والأمثال المتداولة.</li>
                              <li>القصص والذكريات المشتركة.</li>
                              <li>المواقف التي ما زال أفراد العائلة يتذكرونها.</li>
                            </ul>
                            <p className="mb-1 font-semibold">أسئلة تساعدك على الكتابة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>ما أبرز العادات التي حافظت عليها العائلة؟</li>
                              <li>ما الذكريات التي يتحدث عنها كبار السن باستمرار؟</li>
                              <li>هل توجد عبارات أو حكم أو وصايا متوارثة؟</li>
                              <li>ما المناسبات التي كانت تمثل أهمية خاصة للعائلة؟</li>
                            </ul>
                          </div>
                        )}

                        <textarea
                          className={`w-full h-48 border-brand-200 rounded-xl p-4 focus:ring-brand-500 focus:border-brand-500 text-brand-900 leading-relaxed transition ${(status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة") ? "bg-gray-100 opacity-80 cursor-not-allowed" : "bg-brand-50"}`}
                          readOnly={status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}
                          value={(order.data as any)[key] || ""}
                          onChange={(e) => {
                            if (status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة") return;
                            const val = e.target.value;
                            useAppStore.setState((s) => ({
                              orders: s.orders.map((o) =>
                                o.id === order.id
                                  ? {
                                      ...o,
                                      data: { ...o.data, [key]: val },
                                    }
                                  : o,
                              ),
                            }));
                          }}
                          placeholder="ابدا الكتابة هنا..."
                        />
                        
                        {status !== "closed" && !isPostInitialDelivery && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "تم تسليم النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي", "تم التسليم"].includes(order?.actionPhase || "") ? (
                          <div className="flex gap-4 mt-6 pt-4 border-t border-brand-100">
                            <button
                              onClick={() => {
                                updateSpecificData({
                                  [key]: (order.data as any)[key],
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "draft" }
                                });
                                setSuccessModal({isOpen: true, title: "تم الحفظ كمسودة بنجاح!", subtitle: "لقد تم الحفظ بنجاح، يمكنك العودة لتعديل هذه البيانات في أي وقت."});
                              }}
                              className="flex-1 bg-white text-brand-700 font-bold py-3 px-4 rounded-xl border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition flex items-center justify-center gap-2"
                            >
                              <Save className="w-5 h-5" /> حفظ كمسودة
                            </button>
                            <button
                              onClick={() => {
                                const val = (order.data as any)[key];
                                if (!val || typeof val !== "string" || val.trim() === "") {
                                  alert("يرجى إضافة محتوى قبل الحفظ والإغلاق.");
                                  return;
                                }
                                setConfirmState({
                                  isOpen: true,
                                  action: () => {
                                    updateSpecificData({
                                      [key]: val,
                                      sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "closed" }
                                    });
                                    
                                  }
                                });
                              }}
                              className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-5 h-5" /> حفظ وإغلاق 
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                  })()}

                  {activeTab === "نافذة الإدراج العائلي" && (() => {
                    const status = order.data.sectionStatuses?.familyTree || "draft";
                    return (
                    <div className="space-y-4">
                      
                      <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                        <p className="mb-2 font-bold">تمكنك هذه النافذة من تشجير مبسط لإضافة أفراد العائلة الذين ترغب في إظهارهم ضمن صفحات الإدراج العائلي المخصصة في السجل، وفق حدود الإدراج المعتمدة للخدمة.</p>
                        <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                          <li>الآب والأجداد.</li>
                          <li>الأبناء والبنات.</li>
                        </ul>
                        <p className="text-brand-600 mt-4"><strong>ملاحظة:</strong> لا يؤدي إدراج الأشخاص في هذه النافذة تلقائياً إلى اعتمادهم ضمن نتائج التوثيق أو عمود النسب، وإنما يهدف إلى إثراء السجل وإظهار الروابط العائلية ضمن حدود الإدراج المعتمدة.</p>
                      </div>

                      <div className="h-[75vh] min-h-[600px] border-2 border-brand-100 rounded-2xl overflow-hidden bg-white shadow-inner relative">
                        <TreeBuilder
                          initialNodes={order.data.treeData?.nodes || []}
                          initialEdges={order.data.treeData?.edges || []}
                          readOnly={status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}
                          onChange={(nodes, edges) => {
                            if (status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة") return;
                            updateSpecificData({ treeData: { nodes, edges } })
                          }}
                          familyName={order.data.familyName}
                        />
                      </div>

                      {status !== "closed" && !isPostInitialDelivery && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "تم تسليم النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي", "تم التسليم"].includes(order?.actionPhase || "") && (
                        <div className="flex gap-4 mt-6 pt-4 border-t border-brand-100">
                          <button
                            onClick={() => {
                              updateSpecificData({
                                sectionStatuses: { ...(order.data.sectionStatuses || {}), familyTree: "draft" }
                              });
                              setSuccessModal({isOpen: true, title: "تم الحفظ كمسودة بنجاح!", subtitle: "لقد تم الحفظ بنجاح، يمكنك العودة لتعديل هذه البيانات في أي وقت."});
                            }}
                            className="flex-1 bg-white text-brand-700 font-bold py-3 px-4 rounded-xl border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition flex items-center justify-center gap-2"
                          >
                            <Save className="w-5 h-5" /> حفظ كمسودة
                          </button>
                          <button
                            onClick={() => {
                              setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), familyTree: "closed" }
                                  });
                                  
                                }
                              });
                            }}
                            className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" /> حفظ وإغلاق 
                          </button>
                        </div>
                      )}
                    </div>
                  );
                  })()}

                  {activeTab === "خزانة السجل (أرشيف العائلة)" && (() => {
                    const status = order.data.sectionStatuses?.archive || "draft";
                    return (
                    <div className="space-y-6">
                      <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                        <p className="mb-2 font-bold">هذه المساحة مخصصة لحفظ المواد الأرشيفية التي ترغب بإيداعها ضمن ملف السجل، سواء كانت مرتبطة بأحد الأقسام السابقة أو مواد مستقلة ذات قيمة عائلية أو تاريخية.</p>
                        <p className="mb-1 font-semibold">يمكنك إضافة:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1 pr-2 grid grid-cols-2">
                          <li>الصور العائلية.</li>
                          <li>الوثائق.</li>
                          <li>الرسائل.</li>
                          <li>الشهادات.</li>
                          <li>صور المقتنيات التاريخية.</li>
                          <li>المواد الأرشيفية المختلفة.</li>
                        </ul>
                        <p className="mb-1 font-semibold">لكل مادة يمكن إضافة:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1 pr-2">
                          <li>عنوان.</li>
                          <li>وصف.</li>
                          <li>تاريخ تقريبي.</li>
                          <li>الأشخاص أو الأماكن المرتبطة بها.</li>
                          <li>ملاحظات إضافية.</li>
                        </ul>
                      </div>
                      {pendingUpload?.arrayName === "documents" ? (
                        <div className="bg-brand-50 p-6 md:p-8 rounded-2xl border border-brand-200">
                          <h4 className="font-bold text-brand-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-brand-500" />{" "}
                            تفاصيل المرفق:{" "}
                            <span className="text-brand-600 font-normal">
                              {pendingUpload.file.name}
                            </span>
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                عنوان المرفق (إختياري)
                              </label>
                              <input
                                type="text"
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={mediaMeta.title}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="مثال: وثيقة أو صورة عائلية"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                النوع (إختياري)
                              </label>
                              <input
                                type="text"
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={mediaMeta.kind}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    kind: e.target.value,
                                  })
                                }
                                placeholder="صورة، صك محكمة، شهادة..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                الوصف (إختياري)
                              </label>
                              <textarea
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                rows={3}
                                value={mediaMeta.description}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="أي تفاصيل تود توضيحها حول هذا المرفق..."
                              ></textarea>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                تاريخ تقريبي (إختياري)
                              </label>
                              <input
                                type="text"
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={mediaMeta.approximateDate}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    approximateDate: e.target.value,
                                  })
                                }
                                placeholder="مثال: ١٩٥٠ أو القرن العشرين"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                الأشخاص أو الأماكن المرتبطة (إختياري)
                              </label>
                              <input
                                type="text"
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={mediaMeta.associatedPersonsOrPlaces}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    associatedPersonsOrPlaces: e.target.value,
                                  })
                                }
                                placeholder="مثال: الجد المؤسس أو مدينة الطائف"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                الغرض من الإدراج
                              </label>
                              <select
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                                value={mediaMeta.purpose}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    purpose: e.target.value,
                                  })
                                }
                              >
                                <option value="إضافة لسجل تراث العائلة">
                                  إضافة لسجل تراث العائلة الرئيسي
                                </option>
                                <option value="مشاركة للغرض البحثي فقط">
                                  مشاركة مع فريق البحث للغرض البحثي فقط
                                </option>
                                <option value="غلاف للسجل">
                                  استخدام كغلاف لسجل تراث العائلة
                                </option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-brand-700 mb-1">
                                ملاحظات إضافية (إختياري)
                              </label>
                              <textarea
                                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                rows={2}
                                value={mediaMeta.additionalNotes}
                                onChange={(e) =>
                                  setMediaMeta({
                                    ...mediaMeta,
                                    additionalNotes: e.target.value,
                                  })
                                }
                                placeholder="أي ملاحظات أخرى تود إضافتها..."
                              ></textarea>
                            </div>
                            
                            <div className="flex items-start gap-3 mt-4 bg-brand-50 p-4 rounded-xl border border-brand-100">
                                <input
                                  type="checkbox"
                                  id="upload-terms-doc"
                                  className="mt-1 w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                                  checked={agreeToUploadTerms}
                                  onChange={(e) => setAgreeToUploadTerms(e.target.checked)}
                                />
                                <label htmlFor="upload-terms-doc" className="text-sm text-brand-800 font-medium leading-relaxed">
                                  أقر بأنني أمتلك حقوق هذا المرفق وأنه صحيح ولا ينتهك أي حقوق نشر أو خصوصية طرف ثالث، وأتحمل المسؤولية القانونية الكاملة عن رفعه أو مشاركته في هذا السجل كما هو موضح بشروط الاستخدام.
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
                              <button
                                disabled={isUploading || !agreeToUploadTerms}
                                onClick={confirmUpload}
                                className="flex-1 bg-brand-600 text-white rounded-xl py-3 font-bold hover:bg-brand-700 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUploading ? (
                                  <>
                                    <UploadCloud className="w-5 h-5 animate-pulse" />{" "}
                                    جاري الرفع...
                                  </>
                                ) : (
                                  "حفظ ورفع المرفق"
                                )}
                              </button>
                              <button
                                disabled={isUploading || order?.actionPhase === "تمت المسودة"}
                                onClick={() => setPendingUpload(null)}
                                className="flex-1 bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 rounded-xl py-3 font-bold transition"
                              >
                                إلغاء
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            !isUploading && !isPostInitialDelivery && fileInputRef.current?.click()
                          }
                          className={`border-2 border-dashed border-brand-300 rounded-2xl p-10 text-center transition ${isUploading || isPostInitialDelivery || status === "closed" ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-50 cursor-pointer"}`}
                        >
                          <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                uploadFileAndUpdate(
                                  e.target.files[0],
                                  "documents",
                                );
                                e.target.value = "";
                              }
                            }}
                            accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg,image/webp"
                            disabled={isUploading || isPostInitialDelivery || status === "closed" || order?.actionPhase === "تمت المسودة"}
                          />
                          <UploadCloud className="w-12 h-12 text-brand-400 mx-auto mb-4" />
                          <p className="text-brand-800 font-bold mb-2">
                            {isPostInitialDelivery ? "المرفقات مغلقة لانتهاء مرحلة التوثيق والإعتماد" : "انقر هنا لرفع وثيقة تاريخية أو صورة جديدة"}
                          </p>
                          <p className="text-sm text-brand-600">
                            (الرفع لمرفق واحد في كل مرة)
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.data.documents?.map((docItem, i) => {
                          if (!docItem) return null;
                          const isStr = typeof docItem === "string";
                          const url = isStr ? docItem : docItem.url;
                          const title = isStr
                            ? url.split("%2F").pop()?.split("?")[0] || "مرفق"
                            : docItem.title ||
                              url.split("%2F").pop()?.split("?")[0] ||
                              "مرفق";
                          return (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-brand-200 hover:border-brand-400 hover:shadow-md transition group relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-1 h-full bg-brand-400 group-hover:bg-brand-500 transition-colors"></div>
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                                <div>
                                  <h4
                                    className="font-bold text-brand-900 line-clamp-1"
                                    dir="auto"
                                  >
                                    {title}
                                  </h4>
                                  {!isStr && (
                                    <p className="text-xs text-brand-600 mt-1 font-mono">
                                      {docItem.purpose}{" "}
                                      {docItem.kind ? ` • ${docItem.kind}` : ""}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {!isStr && docItem.description && (
                                <p className="text-xs text-brand-500 mt-2 line-clamp-2 pr-8">
                                  {docItem.description}
                                </p>
                              )}
                            </a>
                          );
                        })}
                      </div>

                      {order.data.sectionStatuses?.archive !== "closed" && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "تم تسليم النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي", "تم التسليم"].includes(order?.actionPhase || "") && (
                        <div className="flex gap-4 mt-6 pt-4 border-t border-brand-100">
                          <button
                            onClick={() => {
                              updateSpecificData({
                                sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "draft" }
                              });
                              setSuccessModal({isOpen: true, title: "تم الحفظ كمسودة بنجاح!", subtitle: "لقد تم الحفظ بنجاح، يمكنك العودة لتعديل هذه البيانات في أي وقت."});
                            }}
                            className="flex-1 bg-white text-brand-700 font-bold py-3 px-4 rounded-xl border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition flex items-center justify-center gap-2"
                          >
                            <Save className="w-5 h-5" /> حفظ كمسودة
                          </button>
                          <button
                            onClick={() => {
                              const docs = order.data?.documents || [];
                              const photos = order.data?.photos || [];
                              if (docs.length === 0 && photos.length === 0) {
                                alert("يرجى رفع مرفقات قبل حفظ وإغلاق الخزانة.");
                                return;
                              }
                              setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "closed" }
                                  });
                                  
                                }
                              });
                            }}
                            className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" /> حفظ وإغلاق 
                          </button>
                        </div>
                      )}

                    </div>
                  );
                  })()}



                  {activeTab === "التسلسل الزمني للعائلة" && (() => {
                    const status = order.data.sectionStatuses?.timeline || "draft";
                    return (
                    <div className="space-y-4">
                      <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-800 leading-relaxed text-sm">
                        <p className="mb-2 font-bold">تساعدك هذه الصفحة على توثيق المحطات والأحداث التي شكلت تاريخ عائلتك عبر الزمن. لا يشترط معرفة التواريخ بدقة، ويمكن تسجيل الأحداث التقريبية أو الروايات المتوارثة كما تعرفها.</p>
                        <p className="mb-2 font-semibold">قد تكون هذه الأحداث مرتبطة بالهجرات أو الاستقرار أو الشخصيات المؤثرة أو المنازل القديمة أو الأنشطة الاقتصادية أو غيرها من المحطات التي أسهمت في تشكيل مسيرة العائلة.</p>
                        <p className="mb-1 font-semibold">أمثلة للأحداث التي يمكن إضافتها:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1 pr-2 grid grid-cols-2">
                          <li>انتقال العائلة إلى منطقة جديدة.</li>
                          <li>استقرار أحد الفروع في مدينة أو بلد آخر.</li>
                          <li>إنشاء وقف أو مزرعة أو تجارة معروفة.</li>
                          <li>بناء منزل تاريخي.</li>
                          <li>ظهور شخصية بارزة.</li>
                          <li>حدث عائلي مهم.</li>
                          <li>هجرة أو عودة.</li>
                          <li>تأسيس مؤسسة أو نشاط اقتصادي.</li>
                          <li>أي محطة ترى أنها مؤثرة في تاريخ العائلة.</li>
                        </ul>
                        <p className="mb-1 font-semibold">أسئلة تساعدك على التوثيق:</p>
                        <ul className="list-disc list-inside space-y-1 pr-2">
                          <li>ما أقدم حدث تتذكره أو تعرفه عن العائلة؟</li>
                          <li>هل مرت العائلة بمرحلة انتقال أو هجرة؟</li>
                          <li>متى ظهرت أبرز الفروع المعروفة؟</li>
                          <li>هل توجد أحداث يتكرر ذكرها بين كبار السن؟</li>
                          <li>هل ارتبط تاريخ العائلة بحدث تاريخي أو اجتماعي معروف؟</li>
                        </ul>
                      </div>
                      <TimelineBuilder 
                        events={order.data.timelineEvents || []}
                        readOnly={status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}
                        onChange={(events) => {
                          if (status === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة") return;
                          updateSpecificData({ timelineEvents: events })
                        }}
                      />

                      {status !== "closed" && !isPostInitialDelivery && !["تمت المسودة", "تم التصميم الإلكتروني", "تم إصدار النسخة الأولية", "تم تسليم النسخة الأولية", "جاري التصويب", "تم التصويب", "جاهز للتسليم النهائي", "تم التسليم"].includes(order?.actionPhase || "") && (
                        <div className="flex gap-4 mt-6 pt-4 border-t border-brand-100">
                          <button
                            onClick={() => {
                              updateSpecificData({
                                sectionStatuses: { ...(order.data.sectionStatuses || {}), timeline: "draft" }
                              });
                              setSuccessModal({isOpen: true, title: "تم الحفظ كمسودة بنجاح!", subtitle: "لقد تم الحفظ بنجاح، يمكنك العودة لتعديل هذه البيانات في أي وقت."});
                            }}
                            className="flex-1 bg-white text-brand-700 font-bold py-3 px-4 rounded-xl border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition flex items-center justify-center gap-2"
                          >
                            <Save className="w-5 h-5" /> حفظ كمسودة
                          </button>
                          <button
                            onClick={() => {
                              setConfirmState({
                                isOpen: true,
                                action: () => {
                                  updateSpecificData({
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), timeline: "closed" }
                                  });
                                  
                                }
                              });
                            }}
                            className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" /> حفظ وإغلاق 
                          </button>
                        </div>
                      )}
                    </div>
                    );
                  })()}

                  {activeTab === "استيضاحات فريق البحث" && (
                    <div className="bg-white border rounded-2xl flex flex-col h-[600px] border-brand-200 overflow-hidden relative">
                      <div className="bg-brand-50 border-b border-brand-200 p-4">
                        <h4 className="font-bold text-brand-900">
                          تواصل آمن ومباشر
                        </h4>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                        {!order.messages || order.messages.length === 0 ? (
                          <div className="text-center py-20 text-brand-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            لا توجد رسائل بعد.
                          </div>
                        ) : (
                          order.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] rounded-2xl p-4 ${msg.senderRole === "user" ? "bg-brand-600 text-white rounded-tl-sm" : "bg-brand-100 text-brand-900 rounded-tr-sm"}`}
                              >
                                <p className="whitespace-pre-wrap">
                                  {msg.text}
                                </p>
                                {msg.attachments &&
                                  msg.attachments.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {msg.attachments.map((att, i) => (
                                        <a
                                          key={i}
                                          href={att}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 text-[10px] bg-white text-brand-900 px-2 py-1 rounded"
                                        >
                                          مرفق <Paperclip className="w-3 h-3" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                <div className={`text-xs mt-2 opacity-75`}>
                                  {new Intl.DateTimeFormat("ar-SA", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(new Date(msg.createdAt))}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {replyAttachments.length > 0 && (
                        <div className="absolute bottom-[72px] left-4 right-4 bg-gray-100 p-2 rounded-lg flex gap-2 overflow-x-auto border border-gray-200">
                          {replyAttachments.map((url, i) => (
                            <div
                              key={i}
                              className="bg-white px-2 py-1 text-xs rounded border flex items-center gap-2"
                            >
                              مرفق أدخلته
                              <button
                                onClick={() =>
                                  setReplyAttachments(
                                    replyAttachments.filter((a) => a !== url),
                                  )
                                }
                                className="text-red-500 font-bold hover:text-red-700"
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isPostInitialDelivery ? (
                        <div className="p-4 bg-white border-t border-brand-200 flex gap-2 absolute bottom-0 left-0 right-0 z-10">
                          <input
                            type="file"
                            className="hidden"
                            ref={chatFileInputRef}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const storageRef = ref(
                                  storage,
                                  `chat/${Date.now()}_${file.name}`,
                                );
                                const uploadTask = uploadBytesResumable(
                                  storageRef,
                                  file,
                                );
                                uploadTask.on(
                                  "state_changed",
                                  null,
                                  null,
                                  async () => {
                                    const downloadURL = await getDownloadURL(
                                      uploadTask.snapshot.ref,
                                    );
                                    setReplyAttachments([
                                      ...replyAttachments,
                                      downloadURL,
                                    ]);
                                  },
                                );
                              }
                            }}
                          />
                          <button
                            onClick={() => chatFileInputRef.current?.click()}
                            className="p-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 border border-brand-200"
                            title="إرفاق ملف"
                          >
                            <Paperclip className="w-5 h-5" />
                          </button>
                          <input
                            type="text"
                            className="flex-1 border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 px-4"
                            placeholder="اكتب رسالتك لفريق البحث هنا..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSendReply()
                            }
                          />
                          <button
                            onClick={handleSendReply}
                            className="px-6 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-bold"
                          >
                            إرسال
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 bg-white border-t border-brand-200 flex justify-center items-center absolute bottom-0 left-0 right-0 z-10 block w-full text-center py-6">
                          <p className="text-brand-500 text-sm font-bold w-full text-center">
                            الردود مغلقة لانتهاء مرحلة التوثيق واعتماد النسخة الأولية للسجل.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "النسخة الرقمية للسجل" && (
                    <div className="text-center py-24 bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300"></div>
                      {!order.digitalCopyLink ? (
                        <>
                          <Sparkles className="w-16 h-16 text-brand-400 mx-auto mb-6 animate-pulse" />
                          <h3 className="text-2xl font-bold text-brand-900 mb-3 tracking-tight">
                            قريباً سيكون سجل تراث عائلتك بين يديك!
                          </h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg">
                            سيظهر لك هنا رابط تحميل{" "}
                            <strong className="text-brand-900">
                              سجل تراث عائلتك الرقمي
                            </strong>{" "}
                            فور اعتماده وإصداره.
                          </p>
                        </>
                      ) : (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <BookOpen className="w-20 h-20 text-brand-600 mx-auto mb-6" />
                          <h3 className="text-3xl font-bold text-brand-900 mb-4 tracking-tight">
                            سجل تراث عائلتك جاهز للتصفح
                          </h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg mb-10">
                            لقد انتهينا من إعداد نسختك الرقمية بأعلى معايير
                            الجودة والإخراج.
                          </p>
                          <div className="flex flex-col items-center justify-center gap-6">
                            <div className="w-full">
                              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-brand-200 shadow-xl mb-8 relative bg-gray-50 flex items-center justify-center">
                                <iframe 
                                  src={order.digitalCopyLink} 
                                  className="absolute inset-0 w-full h-full border-0" 
                                  allowFullScreen 
                                  title="نسخة أولية للسجل"
                                ></iframe>
                              </div>
                              
                              {(order.issueStatus === "تم الإصدار" || order.status === "تم تسليم الإصدار الأول" || order.status === "تم الإغلاق") ? (
                                order.status === "تم الإغلاق" ? (
                                  <div className="w-full relative z-10 flex flex-col items-center justify-center -mt-6 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-100/50 via-brand-200/50 to-brand-100/50 blur-xl rounded-full"></div>
                                    <a
                                      href={order.digitalCopyDownloadLink || order.digitalCopyLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="relative bg-brand-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-brand-700 transition flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(30,58,138,0.3)] hover:shadow-[0_0_25px_rgba(30,58,138,0.5)] hover:-translate-y-1 w-full sm:w-auto overflow-hidden group"
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                      <Download className="w-7 h-7" /> تحميل نسختك الرقمية الفاخرة
                                    </a>
                                  </div>
                                ) : order.actionPhase === "تم التصويب" || order.status === "جاهز للتسليم النهائي" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "جاهز للتسليم" ? (
                                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl flex items-start gap-4 text-right shadow-sm w-full animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
                                    <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0 mt-1" />
                                    <div>
                                      <h4 className="font-bold text-xl mb-2 text-emerald-900">سجل عائلتكم في مرحلة الطباعة النهائية!</h4>
                                      <p className="text-emerald-800 leading-relaxed font-medium">يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.</p>
                                    </div>
                                  </div>
                                ) : order.issueStatus === "جاري التصويب" || order.actionPhase === "جاري التصويب" ? (
                                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl flex items-start gap-4 text-right w-full max-w-2xl mx-auto">
                                    <Edit3 className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                      <h4 className="font-bold text-lg mb-2">سجل عائلتكم في مرحلة جاري التصويب!</h4>
                                      <p>نعمل حاليًا على مراجعة طلبات التصويب الخاصة بسجلكم، ستتغير حالة السجل آلياً عند صدور النسخة النهائية. نشكر لكم حسن انتظاركم.</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                                    <button
                                      onClick={() => {
                                        useAppStore.getState().addMessageToOrder(order.id, {
                                          id: Math.random().toString(36).substr(2, 9),
                                          senderId: currentUser.id,
                                          senderRole: "user",
                                          text: "تم إعتماد النسخة الحالية للطباعة بدون ملاحظات.",
                                          createdAt: new Date().toISOString(),
                                        }, "جاهز للتسليم النهائي", { actionPhase: "تم التصويب" });
                                        useAppStore.getState().logTimelineEvent(order.id, "قام العميل بإعتماد النسخة للطباعة والتسليم النهائي.");
                                      }}
                                      className="flex-1 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    >
                                      <CheckCircle className="w-6 h-6" /> إعتماد النسخة الحالية للطباعة
                                    </button>
                                    <button
                                      onClick={() => setActiveTab("التصويبات")}
                                      className="flex-1 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    >
                                      <Edit3 className="w-6 h-6" /> طلب تصويب
                                    </button>
                                  </div>
                                )
                              ) : null}
                            </div>
                            
                            {order.status === "تم الإغلاق" && (
                              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-sm md:text-base font-semibold max-w-lg mt-2 flex items-start gap-4 text-right">
                                <Package className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                                <p className="leading-relaxed">
                                  يسعدنا إبلاغك بأنه تم إرسال الشحنة وهي في طريقها
                                  إليك! <br />
                                  <span className="font-bold underline decoration-green-300 decoration-2">
                                    تتضمن الشحنة:
                                  </span>{" "}
                                  10 نسخ مطبوعة فاخرة، وبوستر مشجرة العائلة.
                                </p>
                                {order.shippingDetails?.trackingNumber && (
                                  <div className="mt-4 pt-4 border-t border-green-200 w-full">
                                    <div className="flex flex-col gap-2">
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">تاريخ الشحن:</span>
                                        <span className="text-green-900">{order.shippingDetails?.shippingDate || "غير محدد"}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">شركة الشحن:</span>
                                        <span className="text-green-900">{order.shippingDetails?.carrierName || "غير محدد"}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">رقم التتبع:</span>
                                        <span className="text-green-900 font-mono tracking-wider bg-white px-2 py-1 rounded border border-green-100">{order.shippingDetails?.trackingNumber || "غير محدد"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "بوستر عمود النسب" && (
                    <div className="text-center py-24 bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300"></div>
                      {!order.posterLink ? (
                        <>
                          <Star className="w-16 h-16 text-brand-400 mx-auto mb-6 animate-pulse" />
                          <h3 className="text-2xl font-bold text-brand-900 mb-3 tracking-tight">
                            لوحة فنية توثق جذور عائلتك!
                          </h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg">
                            سيظهر لك هنا رابط تحميل{" "}
                            <strong className="text-brand-900">
                              بوستر مشجر عمود نسبكم
                            </strong>{" "}
                            بصيغة رقمية أصلية عند الإصدار.
                          </p>
                        </>
                      ) : (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <Compass className="w-20 h-20 text-brand-600 mx-auto mb-6" />
                          <h3 className="text-3xl font-bold text-brand-900 mb-4 tracking-tight">
                            بوستر مشجرة العائلة جاهز!
                          </h3>
                          <p className="text-brand-700 max-w-md mx-auto text-lg mb-10">
                            تحفة فنية فريدة صُممت لتوثيق عمود نسبكم عبر الأجيال.
                          </p>
                          <div className="flex flex-col items-center justify-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                              <a
                                href={order.posterLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
                              >
                                <Download className="w-6 h-6" /> تحميل البوستر
                                عالي الدقة
                              </a>
                            </div>
                            {order.status === "تم الإغلاق" && (
                              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-sm md:text-base font-semibold max-w-lg mt-2 flex items-start gap-4 text-right">
                                <Package className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                                <p className="leading-relaxed">
                                  يسعدنا إبلاغك بأنه تم إرسال الشحنة وهي في طريقها
                                  إليك! <br />
                                  <span className="font-bold underline decoration-green-300 decoration-2">
                                    تتضمن الشحنة:
                                  </span>{" "}
                                  10 نسخ مطبوعة فاخرة، وبوستر مشجرة العائلة.
                                </p>
                                {order.shippingDetails?.trackingNumber && (
                                  <div className="mt-4 pt-4 border-t border-green-200 w-full">
                                    <div className="flex flex-col gap-2">
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">تاريخ الشحن:</span>
                                        <span className="text-green-900">{order.shippingDetails?.shippingDate || "غير محدد"}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">شركة الشحن:</span>
                                        <span className="text-green-900">{order.shippingDetails?.carrierName || "غير محدد"}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-bold">رقم التتبع:</span>
                                        <span className="text-green-900 font-mono tracking-wider bg-white px-2 py-1 rounded border border-green-100">{order.shippingDetails?.trackingNumber || "غير محدد"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "التصويبات" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 overflow-hidden">
                      {order?.issueStatus === "تم الإغلاق" || order?.actionPhase === "تم التسليم" || order?.actionPhase === "تم إصدار النسخة النهائية" ? (
                        <div className="text-center py-10 px-4">
                           {!["تم التسليم", "تم إصدار النسخة النهائية"].includes(order?.actionPhase || "") && (
                             <>
                               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                               <h3 className="text-xl font-bold text-brand-900 mb-2">
                                 سجل عائلتكم في مرحلة الطباعة النهائية!
                               </h3>
                               <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed mb-8">
                                 يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                               </p>
                             </>
                           )}

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order?.messages?.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                   <div key={msg.id} className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                                     <div className="flex justify-between items-start mb-2">
                                       <span className="text-sm font-bold text-brand-700 bg-white px-3 py-1 rounded-md border border-brand-200">
                                         تم الإرسال
                                       </span>
                                       <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                         {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                       </span>
                                     </div>
                                     <p className="text-brand-800 whitespace-pre-line text-sm mt-3 text-right">
                                       {msg.text}
                                     </p>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      ) : order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) ? (
                        <div className="px-6 md:px-12 py-8">
                           <div className="text-center mb-8">
                             <Sparkles className="w-16 h-16 text-brand-500 mb-4 mx-auto" />
                             <h3 className="text-2xl font-bold text-brand-900 mb-2 font-serif">
                               سجل تراث عائلتكم قيد التصويب
                             </h3>
                             <p className="text-brand-700 text-lg max-w-2xl mx-auto leading-relaxed">
                               نعمل حاليًا على مراجعة طلب التصويب لسجلكم ، ستتغير حالة السجل آلياً عند صدور النسخة النهائية من سجل تراث عائلتكم .
                             </p>
                           </div>

                           <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                             <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                               <Clock className="w-6 h-6 text-brand-600" />
                               طلبات التصويب السابقة
                             </h3>
                             <div className="space-y-4">
                               {order?.messages?.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                 <div key={msg.id} className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                                   <div className="flex justify-between items-start mb-2">
                                     <span className="text-sm font-bold text-brand-700 bg-white px-3 py-1 rounded-md border border-brand-200">
                                       تم الإرسال
                                     </span>
                                     <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                       {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                     </span>
                                   </div>
                                   <p className="text-brand-800 whitespace-pre-line text-sm mt-3 text-right">
                                     {msg.text}
                                   </p>
                                 </div>
                               ))}
                             </div>
                           </div>
                        </div>
                      ) : order?.actionPhase === "جاري التصويب" || order?.issueStatus === "جاري التصويب" || order?.actionPhase === "تم التصويب" || order?.actionPhase === "جاهز للتسليم النهائي" ? (
                        <div className="text-center py-10 px-4">
                           {order?.actionPhase === "تم التصويب" || order?.actionPhase === "جاهز للتسليم النهائي" ? (
                             <>
                               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                               <h3 className="text-xl font-bold text-brand-900 mb-2">
                                 سجل عائلتكم في مرحلة الطباعة النهائية!
                               </h3>
                               <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed mb-8">
                                 يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                               </p>
                             </>
                           ) : (
                             <>
                               <div className="w-20 h-20 bg-amber-100 text-amber-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-amber-50 shadow-inner mx-auto">
                                  <Edit3 className="w-10 h-10" />
                               </div>
                               <h3 className="text-2xl font-bold text-brand-900 mb-2">
                                 سجل تراث عائلتكم قيد التصويب
                               </h3>
                               <p className="text-brand-600 font-medium max-w-lg mx-auto leading-relaxed mb-8">
                                 نعمل حاليًا على مراجعة طلب التصويب لسجلكم، ستتغير حالة السجل آلياً عند صدور النسخة النهائية.
                               </p>
                             </>
                           )}

                           {order?.messages?.some(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order?.messages?.filter(m => m.text?.includes("طلب تصويب - القسم") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                   <div key={msg.id} className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                                     <div className="flex justify-between items-start mb-2">
                                       <span className="text-sm font-bold text-brand-700 bg-white px-3 py-1 rounded-md border border-brand-200">
                                         تم الإرسال
                                       </span>
                                       <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                         {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                       </span>
                                     </div>
                                     <p className="text-brand-800 whitespace-pre-line text-sm mt-3 text-right">
                                       {msg.text}
                                     </p>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      ) : (order?.status === "تأكيد اعتماد النسخة" && order?.actionPhase !== "جاري التصويب" && order?.issueStatus !== "جاري التصويب" && order?.actionPhase !== "تم التصويب" && order?.issueStatus !== "تم التصويب") ? (
                        <div className="text-center py-10 px-4">
                           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-brand-900 mb-2">
                             سجل عائلتكم في مرحلة الطباعة النهائية!
                           </h3>
                           <p className="text-brand-600 font-light max-w-lg mx-auto leading-relaxed">
                             يسعدنا تأكيد اعتمادكم للنسخة النهائية. يتم الآن العمل بكل اهتمام على طباعة وإخراج النسخ الفاخرة من سجل تراث أسرتكم لتكون بين أيديكم قريباً، ولتُخلد تاريخكم ومجدكم بأبهى حُلة تتوارثها الأجيال.
                           </p>
                        </div>
                      ) : (order?.actionPhase === "جاري التصويب" || order?.issueStatus === "جاري التصويب") ? (
                         <div className="text-center py-10 px-4">
                           {order?.messages?.some(m => m.text?.includes("طلب تصويب") || m.text?.includes("تم إرسال طلب تصويبات متعددة")) && (
                             <div className="mt-8 text-right bg-white p-6 md:p-8 rounded-2xl border border-brand-200 shadow-sm max-w-4xl mx-auto">
                               <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-center gap-2">
                                 <Clock className="w-6 h-6 text-brand-600" />
                                 طلبات التصويب السابقة
                               </h3>
                               <div className="space-y-4">
                                 {order?.messages?.filter(m => m.text?.includes("طلب تصويب") || m.text?.includes("تم إرسال طلب تصويبات متعددة")).map((msg) => (
                                   <div key={msg.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-200/50 pb-3">
                                       <span className="font-bold text-brand-900 text-sm">
                                         تم الإرسال
                                       </span>
                                       <span className="text-xs text-brand-500 font-mono" dir="ltr">
                                         {new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                       </span>
                                     </div>
                                     <p className="text-brand-800 whitespace-pre-line text-sm mt-3 text-right">
                                       {msg.text}
                                     </p>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                      ) : !["مكتمل", "طلب مكتمل", "تم تسليم الإصدار الأول", "تم الإصدار", "جاهز للتسليم النهائي", "جاهز للتسليم للعميل"].includes(order?.status || "") &&
                        !["جاري التصويب", "تم التصويب", "تم إصدار النسخة الأولية"].includes(order?.actionPhase || "") &&
                        !["جاري التصويب", "تم التصويب"].includes(order?.issueStatus || "") ? (
                        <div className="text-center py-10 px-4">
                          <CheckCircle className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-brand-900 mb-2">
                            سيظهر لك هنا نموذج التصويبات
                          </h3>
                          <p className="text-brand-600 font-light max-w-sm mx-auto">
                            لتتمكن من التبليغ عن الأخطاء ليتم بناءاً عليها من
                            إصلاح وتحديث الاخطاء عند وجودها، وذلك بعد إصدار
                            السجل.
                          </p>
                        </div>
                      ) : (
                        <div className="px-6 md:px-12 py-8">

                          <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-brand-600" />{" "}
                            نموذج طلب تصويب
                          </h3>
                          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 mb-8">
                            <p className="text-brand-800 font-medium mb-4">
                              نأمل منكم في حالة وجود أي ملاحظات أو أخطاء
                              مطبعية أو علمية تعبئة النموذج أدناه بدقة
                              ليتسنى لفريق البحث إدراجها وتحديث السجل.
                            </p>

                            <div className="space-y-4">
                              <div className="space-y-6">
                                {corrections.map((correction, index) => (
                                  <div key={index} className="bg-white p-6 rounded-xl border border-brand-200 relative shadow-sm">
                                    {corrections.length > 1 && (
                                      <button 
                                        onClick={() => setCorrections(c => c.filter((_, i) => i !== index))}
                                        className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    )}
                                    <h4 className="font-bold text-brand-900 mb-4 border-b border-gray-100 pb-2">التصويب رقم {index + 1}</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-1">القسم</label>
                                        <input
                                          type="text"
                                          className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                          placeholder="اكتب اسم القسم هنا..."
                                          value={correction.section}
                                          onChange={(e) => {
                                            const newC = [...corrections];
                                            newC[index].section = e.target.value;
                                            setCorrections(newC);
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-1">رقم الصفحة</label>
                                        <input
                                          type="text"
                                          className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                          placeholder="مثال: 45"
                                          value={correction.page}
                                          onChange={(e) => {
                                            const newC = [...corrections];
                                            newC[index].page = e.target.value;
                                            setCorrections(newC);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <label className="block text-sm font-bold text-brand-700 mb-1">الملاحظة المطلوب تعديلها وتفاصيلها</label>
                                      <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                        placeholder="اكتب الملاحظة أو الخطأ كما هو موجود في السجل"
                                        value={correction.error}
                                        onChange={(e) => {
                                          const newC = [...corrections];
                                          newC[index].error = e.target.value;
                                          setCorrections(newC);
                                        }}
                                      ></textarea>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-bold text-brand-700 mb-1">التصويب المقترح ومصدره</label>
                                      <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                                        placeholder="اكتب التصويب الصحيح مع ذكر المصدر إن وجد"
                                        value={correction.text}
                                        onChange={(e) => {
                                          const newC = [...corrections];
                                          newC[index].text = e.target.value;
                                          setCorrections(newC);
                                        }}
                                      ></textarea>
                                    </div>
                                  </div>
                                ))}
                                
                                <button
                                  onClick={() => setCorrections(c => [...c, { section: "", page: "", text: "", error: "" }])}
                                  className="w-full py-4 border-2 border-dashed border-brand-300 text-brand-600 bg-brand-50/50 rounded-xl font-bold hover:bg-brand-50 hover:border-brand-400 transition flex justify-center items-center gap-2"
                                >
                                  الضغط هنا لإضافة طلب تصويب أخر <span className="text-xl leading-none px-2">+</span> 
                                </button>
                              </div>

                              <div className="flex items-start gap-3 mt-4 bg-white p-4 rounded-xl border border-brand-100">
                                <input
                                  type="checkbox"
                                  id="terms"
                                  className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                                  checked={agreeToCorrectionTerms}
                                  onChange={(e) =>
                                    setAgreeToCorrectionTerms(
                                      e.target.checked,
                                    )
                                  }
                                />
                                <label
                                  htmlFor="terms"
                                  className="text-brand-700 text-sm leading-relaxed cursor-pointer select-none"
                                >
                                  أقر بأني اطلعت على{" "}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowCorrectionTerms(true);
                                    }}
                                    className="text-brand-600 font-bold underline hover:text-brand-800"
                                  >
                                    شروط وأحكام التصويبات
                                  </button>{" "}
                                  وأوافق عليها، وأتحمل مسؤولية صحة المعلومات
                                  المقدمة.
                                </label>
                              </div>

                              <div className="pt-4 border-t border-brand-100">
                                <button
                                  disabled={
                                    !corrections.every(c => c.section.trim() && c.page.trim() && c.text.trim() && c.error.trim()) ||
                                    !agreeToCorrectionTerms
                                  }
                                  onClick={handleSendCorrection}
                                  className="w-full md:w-auto px-10 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                  <Send className="w-5 h-5" /> إرسال طلب
                                  التصويب
                                </button>
                              </div>
                            </div>
                          </div>
                      </div>
                      )}

                      {showCorrectionTerms && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-right p-6 relative">
                            <h3 className="text-xl font-bold text-brand-900 mb-4">
                              شروط وأحكام التصويبات
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-brand-700 text-sm mb-6 pb-4 border-b border-gray-100">
                              <li>
                                يحق للعميل تقديم طلب تصويب واحد مجاني خلال
                                30 يوماً من استلام السجل.
                              </li>
                              <li>
                                يجب الإشارة إلى المصدر المعتمد للتصويب إذا
                                كان تعديلاً جوهرياً في النسب.
                              </li>
                              <li>
                                عمليات التصحيح الإملائي والتنسيقي تتم
                                مراجعتها وتعديلها مباشرة.
                              </li>
                              <li>
                                التحديثات الجذرية التي تتطلب إعادة بحث قد
                                يترتب عليها رسوم إضافية.
                              </li>
                            </ul>
                            <div className="flex justify-end gap-3 mt-6">
                              <button
                                onClick={() => setShowCorrectionTerms(false)}
                                className="px-6 py-2 bg-brand-50 text-brand-600 rounded-xl font-bold hover:bg-brand-100 transition"
                              >
                                إغلاق
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "فتح الأبواب المغلقة" && (
                    <div className="py-12 px-4 sm:px-8 bg-white shadow-inner rounded-3xl border border-brand-200">
                      <div className="text-center mb-10">
                        <Telescope className="w-20 h-20 text-brand-600 mx-auto mb-6 opacity-90" />
                        {!order.researchRecommendations ? (
                          <h3 className="text-2xl md:text-3xl font-bold text-brand-900 mb-4 leading-tight">
                            هنا ستظهر توصيات واقتراحات فريق البحث
                            <br />
                            بعد صدور "سجل تراث العائلة"
                          </h3>
                        ) : (
                          <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-8 mb-8 shadow-sm">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-900 mb-4 leading-tight flex justify-center items-center gap-3">
                              <Star className="w-8 h-8 text-brand-500 fill-brand-500" />{" "}
                              توصيات واقتراحات فريق البحث
                            </h3>
                            <div className="text-brand-800 text-lg leading-relaxed text-right whitespace-pre-line bg-white p-6 rounded-xl border border-brand-100 shadow-inner">
                              {order.researchRecommendations}
                            </div>
                          </div>
                        )}
                        <p className="text-brand-500 font-bold bg-brand-50 inline-block px-4 py-2 rounded-full border border-brand-100">
                          تعتبر خدمة فتح الأبواب المغلقة خدمة مستقلة - تنطبق
                          الشروط والأحكام
                        </p>
                      </div>

                      <div className="space-y-8 text-brand-800 leading-relaxed bg-brand-50 p-6 sm:p-10 rounded-2xl border border-brand-100 text-lg">
                        <p className="font-medium">
                          يعتبر "سجل تراث العائلة" - السجل الأساسي - عند صدوره
                          هو العمل الجوهري الذي تكون من خلالة رحلة توثيق عمود
                          النسب ، وعند صدوره قد يقترح فريق البحث بعض التوصيات في
                          بعض الحالات التي لاتتوفر فيها مصادر كافية أو يحتاج
                          البحث الى بحث متقدم من نوع آخر ، وهنا تأتي خدمة "فتح
                          الأبواب المغلقة" لتفتح ابواباً آخرى من البحث عند رغبة
                          (أمين السجل/العميل) في ذلك .
                        </p>

                        <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm">
                          <h4 className="font-bold text-brand-900 text-xl mb-3 flex items-center gap-3">
                            <Compass className="w-7 h-7 text-brand-600" /> خدمة
                            فتح الأبواب المغلقة :
                          </h4>
                          <p>
                            خدمة اختيارية تُقدَّم بعد تثبيت الأصل، وتهدف إلى
                            تعميق التوثيق عبر أدوات بحث متقدمة، تُفعّل جزئيًا أو
                            كليًا حسب مقتضيات البحث العلمي .
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm">
                          <h4 className="font-bold text-brand-900 text-xl mb-3 flex items-center gap-3">
                            <MapPin className="w-7 h-7 text-brand-600" /> كيف
                            تعمل خدمة فتح الأبواب المغلقة
                          </h4>
                          <p className="mb-4">
                            تشمل خدمة "فتح الأبواب المغلقة" على انواع من البحوث
                            المتخصصة والمعمقة ، من أجل فتح بعض الأبواب المغلقة
                            والتي ابرزها الأصدار الأساسي للسجل ، وقد تكون على
                            سبيل المثال أحد هذه الأنواع من الأعمال البحثية:
                          </p>
                          <ul className="space-y-3 mt-4 text-brand-900">
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                              البحث في الوثائق والسجلات الرسمية.
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                              البحث في الأراشيف الحكومية التاريخية.
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                              تفسير نتائج الحمض النووي وربطها بالسياق النسبي
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "الملف الشخصي" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 p-8">
                      <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                        <User className="w-8 h-8 text-brand-600" /> الملف الشخصي
                      </h3>

                      <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-brand-50 rounded-2xl border border-brand-100">
                        <div className="relative group shrink-0">
                          {currentUser.photoUrl ? (
                            <img
                              src={currentUser.photoUrl}
                              alt="Profile"
                              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-brand-100 shadow-md flex items-center justify-center text-brand-600 font-bold text-4xl uppercase">
                              {currentUser.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              profilePhotoInputRef.current?.click()
                            }
                            className="absolute bottom-0 left-0 bg-brand-600 text-white p-2 rounded-full shadow-lg hover:bg-brand-500 transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <input
                            type="file"
                            className="hidden"
                            ref={profilePhotoInputRef}
                            onChange={handleProfilePhotoUpload}
                            accept="image/*"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-right flex flex-col justify-center py-2 space-y-3">
                          <div>
                            <h4 className="font-bold text-brand-900 text-lg">
                              الصورة الشخصية
                            </h4>
                            <p className="text-sm text-brand-600 mt-1 mb-4">
                              يُفضل رفع صورة شخصية واضحة (اختياري)
                            </p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row gap-4 mb-2 border-t border-brand-100/50 pt-4">
                            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-100 flex-1 flex flex-col gap-1">
                              <span className="text-xs font-bold text-brand-400">البريد الإلكتروني</span>
                              <span className="text-sm font-mono text-brand-800 break-all">{currentUser.email}</span>
                            </div>
                            
                            {order ? (
                              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-100 flex-1 flex flex-col gap-1">
                                <span className="text-xs font-bold text-brand-400">رقم الطلب</span>
                                <span className="text-sm font-mono text-brand-800 break-all">#{order.orderNumber || order.id.toUpperCase()}</span>
                              </div>
                            ) : (
                               <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-100 flex-1 flex flex-col justify-center gap-1 opacity-50">
                                <span className="text-xs font-bold text-brand-400">رقم الطلب</span>
                                <span className="text-sm font-mono text-brand-800">قيد الإنشاء</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const newName = formData.get("name") as string;
                          const newPhone = formData.get("phone") as string;
                          const newCountry = formData.get("country") as string;
                          const newState = formData.get("state") as string;
                          const newStreet = formData.get("street") as string;
                          const newZip = formData.get("zip") as string;

                          try {
                            // Update user doc
                            await updateDoc(doc(db, "users", currentUser.id), {
                              name: newName,
                              phone: newPhone,
                              shippingAddress: {
                                country: newCountry,
                                state: newState,
                                street: newStreet,
                                zip: newZip,
                              },
                            });
                            useAppStore.setState({
                              currentUser: { ...currentUser, name: newName },
                            });
                            alert("تم حفظ البيانات بنجاح.");
                          } catch (err) {
                            console.error(err);
                            alert("حدث خطأ أثناء الحفظ.");
                          }
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-50 p-6 rounded-2xl border border-brand-100">
                          <div>
                            <label className="block text-sm font-bold text-brand-700 mb-2">
                              الاسم
                            </label>
                            <input
                              required
                              name="name"
                              type="text"
                              className="w-full border-brand-200 rounded-xl bg-white"
                              defaultValue={currentUser.name || "العميل الكريم"}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-brand-700 mb-2">
                              رقم الهاتف
                            </label>
                            <input
                              name="phone"
                              type="text"
                              className="w-full border-brand-200 rounded-xl bg-white"
                              defaultValue={order?.data.mobileNumber || ""}
                              placeholder="رقم الهاتف"
                            />
                          </div>
                          <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <h4 className="col-span-2 text-sm font-bold text-brand-700 mt-2">
                              عنوان الشحن الدائم
                            </h4>
                            <div>
                              <label className="block text-xs text-brand-600 mb-1">
                                الدولة
                              </label>
                              <input
                                name="country"
                                type="text"
                                className="w-full border-brand-200 rounded-xl bg-white"
                                defaultValue={
                                  order?.data.shippingAddress?.country || ""
                                }
                                placeholder="الدولة"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-brand-600 mb-1">
                                المنطقة/المدينة
                              </label>
                              <input
                                name="state"
                                type="text"
                                className="w-full border-brand-200 rounded-xl bg-white"
                                defaultValue={
                                  order?.data.shippingAddress?.state || ""
                                }
                                placeholder="المدينة"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-brand-600 mb-1">
                                الشارع والوصف
                              </label>
                              <input
                                name="street"
                                type="text"
                                className="w-full border-brand-200 rounded-xl bg-white"
                                defaultValue={
                                  order?.data.shippingAddress?.street || ""
                                }
                                placeholder="اسم الشارع أو وصف دقيق"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-brand-600 mb-1">
                                الرمز البريدي
                              </label>
                              <input
                                name="zip"
                                type="text"
                                className="w-full border-brand-200 rounded-xl bg-white"
                                defaultValue={
                                  order?.data.shippingAddress?.zip || ""
                                }
                                placeholder="الرمز البريدي"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-sm transition"
                          >
                            حفظ التغييرات
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === "إعدادات" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 p-8">
                      <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-brand-600" />{" "}
                        الإعدادات
                      </h3>

                      <div className="space-y-8">
                        {/* Security Setting */}
                        <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                          <h4 className="font-bold text-brand-800 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-brand-600" /> الأمان
                            وتسجيل الدخول
                          </h4>
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-brand-700">
                                تغيير كلمة المرور
                              </p>
                              <p className="text-xs text-brand-500 mt-1">
                                يُنصح بتحديث كلمة المرور بشكل دوري للحفاظ على
                                أمان حسابك.
                              </p>
                            </div>
                            <button
                              onClick={() => setShowChangePasswordModal(true)}
                              className="px-6 py-2 border border-brand-300 text-brand-700 rounded-xl hover:bg-brand-100 transition text-sm font-medium whitespace-nowrap"
                            >
                              تغيير كلمة المرور
                            </button>
                          </div>
                        </div>

                        {/* Notifications Setting */}
                        <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                          <h4 className="font-bold text-brand-800 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-brand-600" />{" "}
                            الإشعارات والتنبيهות
                          </h4>
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                              />
                              <div>
                                <p className="text-sm font-semibold text-brand-700">
                                  تنبيهات حالة الطلب
                                </p>
                                <p className="text-xs text-brand-500">
                                  إرسال بريد إلكتروني عند تغير حالة طلبك (مثل:
                                  قيد البحث، مكتمل).
                                </p>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="w-5 h-5 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                              />
                              <div>
                                <p className="text-sm font-semibold text-brand-700">
                                  رسائل فريق العمل
                                </p>
                                <p className="text-xs text-brand-500">
                                  إشعار بالبريد الإلكتروني عند ورود استفسارات من
                                  فريق البحث.
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Privacy & Account Deletion */}
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mt-6">
                          <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" /> إدارة البيانات والخصوصية
                          </h4>
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-red-700">
                                طلب حذف الحساب وجميع البيانات المرتبطة
                              </p>
                              <p className="text-xs text-red-500 mt-1 max-w-xl">
                                بموجب سياسة الخصوصية وقوانين حماية البيانات، يحق لك طلب مسح جميع بياناتك الواردة لدينا. لن نتمكن من استرجاع البيانات بعد تنفيذ الحذف.
                              </p>
                            </div>
                            <button
                              onClick={async () => {
                                const ans = window.prompt("انتبة! سيتم تقديم طلب لحذف حسابك ومحو بياناتك بشكل نهائي من خلال فريقنا. إذا كنت متأكداً يرجى كتابة 'تأكيد' أدناه:");
                                if (ans === 'تأكيد') {
                                  alert('تم تسجيل طلبك لحذف الحساب بنجاح. سيقوم فريقنا بمراجعته وتنفيذه خلال 14 يوم عمل كحد أقصى وفق السياسات.');
                                  try {
                                    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                                    const generatedId = `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
                                    await addDoc(collection(db, 'support_tickets'), {
                                      userId: currentUser.id,
                                      name: currentUser.name || "العميل الكريم",
                                      email: currentUser.email,
                                      subject: 'حذف الحساب',
                                      message: 'طلب رسمي مقدم من المستخدم لحذف بياناته.',
                                      status: 'جديدة',
                                      categoryTitle: 'الخصوصية والوثائق',
                                      privacyType: 'طلب حذف بيانات',
                                      ticketNumber: generatedId,
                                      createdAt: serverTimestamp()
                                    });
                                  } catch (e) {
                                    console.error("Could not send deletion request", e);
                                  }
                                } else if(ans !== null) {
                                  alert('لم يتم تأكيد الطلب.');
                                }
                              }}
                              className="px-6 py-2 border border-red-300 bg-white text-red-600 rounded-xl hover:bg-red-100 transition text-sm font-bold whitespace-nowrap shadow-sm"
                            >
                              تقديم طلب حذف الحساب
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "عقد تسجيل الخدمة" && (
                    <div className="py-12 bg-white rounded-3xl shadow-sm border border-brand-200 p-8">
                      <h3 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-brand-600" /> عقد
                        تسجيل الخدمة
                      </h3>
                      {!order ? (
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
                          <AlertCircle className="w-10 h-10 text-orange-500" />
                          <div>
                            <h4 className="font-bold text-orange-800 text-lg">
                              لم تقم بالتوقيع على العقد بعد
                            </h4>
                            <p className="text-sm text-orange-700">
                              لم يتم العثور على سجل مرتبط بحسابك.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-4 shadow-sm">
                          <CheckCircle className="w-10 h-10 text-green-500" />
                          <div>
                            <h4 className="font-bold text-green-800 text-lg">
                              تم توقيع العقد بنجاح
                            </h4>
                            <p
                              className="text-sm text-green-700 font-mono mt-1"
                              dir="ltr"
                            >
                              {new Intl.DateTimeFormat("ar-SA", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(order.createdAt))}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      
      {successModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-fade-in relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
            <div className="bg-brand-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-brand-900 mb-3">{successModal.title}</h3>
            <p className="text-brand-600 font-light mb-8 leading-relaxed">
              {successModal.subtitle}
            </p>
            <button
              onClick={() => setSuccessModal({isOpen: false, title: "", subtitle: ""})}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all duration-300"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="mt-20 border-t border-brand-200 bg-brand-50 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-700">
          <p className="font-serif text-xl sm:text-2xl text-brand-900 mb-6 font-bold">
            ما لا يُوثق اليوم… قد يصبح مجرد رواية غامضة غدًا.
          </p>
          <div className="space-y-2 text-sm sm:text-base">
            <p className="font-bold text-brand-900">GeneaLab LLC</p>
            <p>تعمل المنصة من خلال شركة جينيا لاب - الولايات المتحدة الأمريكية.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-brand-200 text-sm flex flex-col items-center gap-4">
            <p className="opacity-75">© 2026 GeneaLab LLC — جميع الحقوق محفوظة.</p>
            <Link to="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-bold transition p-2 bg-brand-100 rounded-lg shadow-sm">
              <Home className="w-4 h-4" /> الذهاب الى الصفحة الرئيسية لمنصة سجل تراث العائلة
            </Link>
          </div>
        </div>
      </footer>

      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-brand-900 mb-3">
              هل أنت متأكد من حفظ وإغلاق هذا القسم؟
            </h3>
            <p className="text-sm text-brand-600 mb-8 leading-relaxed">
              بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (confirmState.action) confirmState.action();
                  setConfirmState({isOpen: false, action: null});
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md"
              >
                حفظ وإغلاق
              </button>
              <button
                onClick={() => setConfirmState({isOpen: false, action: null})}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300 relative border border-brand-200">
            <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              تغيير كلمة المرور
            </h3>
            
            {passwordChangeError && (
              <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{passwordChangeError}</span>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-brand-900 mb-2">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 bg-brand-50 p-3"
                  placeholder="8 أحرف كحد أدنى"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleChangePasswordSubmit}
                disabled={passwordChangeLoading}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordChangeLoading ? "جاري التغيير..." : "حفظ كلمة المرور"}
              </button>
              <button
                disabled={passwordChangeLoading}
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setNewPasswordValue("");
                  setPasswordChangeError("");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
