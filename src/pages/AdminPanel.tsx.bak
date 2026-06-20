import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  limit,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import React, { useState, useEffect, useMemo } from "react";
import {
  useAppStore,
  Order,
  UserInfo,
  PaymentStatus,
  IssueStatus,
  ActionPhase,
} from "@/lib/store";
import { Navigate, Link } from "react-router";
import {
  Users,
  User,
  FileText,
  CheckCircle,
  Search,
  Edit3,
  Eye,
  MessageSquare,
  X,
  Home,
  Link as LinkIcon,
  Send,
  AlertCircle,
  Book,
  Check,
  Plus,
  Trash2,
  HeartHandshake,
  Package,
  Shield,
  Calculator,
  Quote,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Download,
  Upload,
  Palette,
  MapPin,
  Bell,
  Printer,
  MessageCircle
} from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";
import { ChatbotManagement } from "@/components/ChatbotManagement";
import { ComplianceDashboard } from "../components/admin/ComplianceDashboard";
import { sendDeliveryEmail } from "@/lib/emailService";
import { KnowledgeArticle } from "./KnowledgeCenter";

export function AdminPanel() {
  const {
    currentUser,
    orders,
    updateOrderStatus,
    addMessageToOrder,
    fulfillOrder,
    markMessagesAsRead,
    logout,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>("lobby");
  const [orderTab, setOrderTab] = useState<"orders" | "archive">("orders");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});
  const [isUploading, setIsUploading] = useState(false);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(
    null,
  );
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState<Partial<KnowledgeArticle>>({
    title: "",
    type: "مقال",
    section: "الروايات والذاكرة",
    filter: "عام",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedAuditOrder, setSelectedAuditOrder] = useState<Order | null>(
    null,
  );
  const [messagingOrder, setMessagingOrder] = useState<Order | null>(null);
  const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null);
  const [deliveryTab, setDeliveryTab] = useState<"draft" | "final">("draft");
  const [replyText, setReplyText] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");
  const [digitalCopyLink, setDigitalCopyLink] = useState("");
  const [digitalCopyDownloadLink, setDigitalCopyDownloadLink] = useState("");
  const [posterLink, setPosterLink] = useState("");
  const [researchRecommendations, setResearchRecommendations] = useState("");
  const [researchDeliveryOrder, setResearchDeliveryOrder] = useState<Order | null>(null);
  const [researchDeliveryTab, setResearchDeliveryTab] = useState<"draft" | "correction">("draft");
  const [researchDocumentLink, setResearchDocumentLink] = useState("");

  const [designSubmitOrder, setDesignSubmitOrder] = useState<Order | null>(null);
  const [designRecordLink, setDesignRecordLink] = useState("");
  const [designDownloadLink, setDesignDownloadLink] = useState("");
  const [designTreeLink, setDesignTreeLink] = useState("");
  const [designCopiesShipped, setDesignCopiesShipped] = useState(false);
  const [shippingDate, setShippingDate] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const [initialDesignSubmitOrder, setInitialDesignSubmitOrder] = useState<Order | null>(null);
  const [initialDesignLink, setInitialDesignLink] = useState("");
  const [shippingContactOrder, setShippingContactOrder] = useState<Order | null>(null);
  const [printReadyLink, setPrintReadyLink] = useState("");
  const [paymentRequestOrder, setPaymentRequestOrder] = useState<Order | null>(null);

  const [isFulfilling, setIsFulfilling] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDesignModal, setShowDesignModal] = useState<string | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [assignSuccessModal, setAssignSuccessModal] = useState({ show: false, message: "" });
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("readNotifIds");
        if (stored) return new Set(JSON.parse(stored));
      } catch (e) {}
    }
    return new Set();
  });

  const notifications = useMemo(() => {
    if (!currentUser || currentUser.role === "user") return [];
    const events: any[] = [];
    const role = currentUser.role;

    for (const order of orders) {
      if (order.isDeleted) continue;

      let isRelevant = false;
      if (role === "maestro" || role === "admin" || role === "customer_service" || role === "accounting" || role === "editor" || role === "marketing") {
        isRelevant = true;
      } else if (role === "research") {
        isRelevant = true;
      } else if (role === "shipping") {
        if (order.actionPhase === "جاهز للتسليم النهائي" || order.actionPhase === "جاهز للتسليم" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "تم التسليم") {
           isRelevant = true;
        }
      }

      if (isRelevant) {
        for (const event of order.timeline || []) {
          let includeEvent = true;
          if (role === "research") {
             if ((event.message || "").includes("طباعة") || (event.message || "").includes("دفع") || (event.message || "").includes("شحن") || (event.message || "").includes("شريط")) includeEvent = false;
          } else if (role === "shipping") {
             if ((event.message || "").includes("دفع") || (event.message || "").includes("باحث") || (event.message || "").includes("بحث")) includeEvent = false;
          }

          // Don't notify the user about their own actions
          if (event.userId === currentUser.id) includeEvent = false;

          if (includeEvent) {
             const tId = event.id || Math.random().toString();
             events.push({
               id: tId + "_" + order.id,
               title: event.message || event.event || "تحديث",
               message: `تحديث في طلب العائلة: ${order.data?.firstName || ''} ${order.data?.familyName || ''} - #${order.orderNumber || order.id.substring(0, 6)}`,
               timestamp: new Date(event.timestamp || Date.now()).getTime(),
               orderId: order.id,
               type: "order_update"
            });
          }
        }
      }
    }

    return events.sort((a,b) => b.timestamp - a.timestamp).slice(0, 50);
  }, [orders, currentUser]);

  const unreadNotificationsCount = notifications.filter(
    (n) => !readNotifIds.has(n.id)
  ).length;

  const handleMarkNotificationsAsRead = async () => {
    const newIds = new Set(readNotifIds);
    notifications.forEach(n => newIds.add(n.id));
    setReadNotifIds(newIds);
    localStorage.setItem("readNotifIds", JSON.stringify(Array.from(newIds).slice(-100)));
  };

  const [usersList, setUsersList] = useState<UserInfo[]>([]);
  const [userTab, setUserTab] = useState<"team" | "users">("team");
  const [userSearch, setUserSearch] = useState("");
  const [userCountryFilter, setUserCountryFilter] = useState("");
  const [userSortBy, setUserSortBy] = useState<
    "newest" | "recent_login" | "alpha"
  >("newest");
  const [editingUserProfile, setEditingUserProfile] = useState<UserInfo | null>(
    null,
  );
  const [userProfileForm, setUserProfileForm] = useState<{
    mobile: string;
    country: string;
    passportUrl: string;
  }>({ mobile: "", country: "", passportUrl: "" });

  useEffect(() => {
    if (activeTab === "articles") {
      const q = collection(db, "knowledge_articles");
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: KnowledgeArticle[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as KnowledgeArticle);
        });

        // Sort locally
        data.sort((a: any, b: any) => {
          const getMs = (dateVal: any) => {
            if (!dateVal) return 0;
            if (dateVal.toDate) return dateVal.toDate().getTime();
            return new Date(dateVal).getTime();
          };
          return getMs(b.createdAt) - getMs(a.createdAt);
        });

        setArticles(data);
      });
      return () => unsubscribe();
    }

    if (
      activeTab === "users" ||
      activeTab === "customer_service" ||
      activeTab === "orders" ||
      activeTab === "research_management"
    ) {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const data: UserInfo[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as UserInfo);
        });
        setUsersList(data);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء تغيير الصلاحية");
    }
  };

  const handleSaveArticle = async () => {
    try {
      // Remove undefined values to prevent Firestore errors
      const articleDataToSave = Object.fromEntries(
        Object.entries(articleForm).filter(([_, v]) => v !== undefined),
      );

      if (editingArticle) {
        await updateDoc(
          doc(db, "knowledge_articles", editingArticle.id),
          articleDataToSave,
        );
      } else {
        await addDoc(collection(db, "knowledge_articles"), {
          ...articleDataToSave,
          createdAt: new Date().toISOString(), // using ISO string for easier usage and consistent fallback
        });
      }
      setIsArticleModalOpen(false);
      setEditingArticle(null);
      setArticleForm({
        title: "",
        type: "مقال",
        section: "الروايات والذاكرة",
        filter: "عام",
      });
    } catch (e: any) {
      console.error(e);
      let errorMessage = "حدث خطأ أثناء حفظ المقال.";
      if (
        e.message?.includes("Missing or insufficient permissions") ||
        e.code === "permission-denied"
      ) {
        errorMessage =
          "ليس لديك صلاحية لإضافة مقال. يرجى التأكد من تحديث قواعد بيانات Firebase Security Rules للسماح بالكتابة في مجموعة knowledge_articles";
      } else {
        errorMessage = `حدث خطأ: ${e.message || "خطأ غير معروف"}`;
      }
      alert(errorMessage);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار صورة صالحة.");
      return;
    }

    try {
      setIsUploading(true);
      const fileRef = ref(
        storage,
        `knowledge_articles/${Date.now()}_${file.name}`,
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setArticleForm({ ...articleForm, coverImageUrl: url });
    } catch (e: any) {
      console.error(e);
      alert("حدث خطأ أثناء رفع الصورة: " + (e.message || ""));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      try {
        await deleteDoc(doc(db, "knowledge_articles", id));
      } catch (e) {
        console.error(e);
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleRestoreOrder = async (order: Order) => {
    try {
      await updateDoc(doc(db, "orders", order.id), { isDeleted: false });
      useAppStore.setState((s) => ({
        orders: s.orders.map((o) =>
          o.id === order.id ? { ...o, isDeleted: false } : o,
        ),
      }));
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الاستعادة");
    }
  };

  const isStaff =
    currentUser &&
    [
      "admin",
      "maestro",
      "research",
      "design",
      "marketing",
      "accounting",
      "compliance",
      "shipping",
      "customer_service",
      "editor",
    ].includes(currentUser.role);
  if (!currentUser) {
    return <Navigate to="/Team" />;
  }
  if (!isStaff) {
    return <Navigate to="/dashboard" />;
  }

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !messagingOrder || !currentUser) return;

    addMessageToOrder(
      messagingOrder.id,
      {
        id: Math.random().toString(36).substr(2, 9),
        senderId: currentUser.id,
        senderRole: "admin",
        text: replyText,
        createdAt: new Date().toISOString(),
      },
      "طلب إيضاح",
    );

    // Array destruction to get the value for sure
    const userDocRef = doc(db, "users", messagingOrder.userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserInfo;
      if (userData.email) {
        const { sendClarificationRequestEmail } =
          await import("@/lib/emailService");
        await sendClarificationRequestEmail(
          userData.email,
          userData.name || "العميل الكريم",
          messagingOrder.id,
          replyText,
        );
      }
    }

    setReplyText("");
    setMessagingOrder(null);
  };

  const handleResearchDelivery = async () => {
    if (!researchDocumentLink.trim() || !researchDeliveryOrder) return;
    setIsFulfilling(true);
    try {
      if (researchDeliveryTab === "draft") {
        await useAppStore.getState().fulfillOrder(researchDeliveryOrder.id, {
          actionPhase: "تمت المسودة",
          researchDraftLink: researchDocumentLink
        });
        await useAppStore.getState().logTimelineEvent(
          researchDeliveryOrder.id,
          "تم تسليم النسخة الأولية لإدارة التصميم"
        );
        import("@/lib/emailService").then(({ sendDesignDraftReadyEmail, sendDocumentationPhaseEmail, sendCustomerDesignPhaseEmail }) => {
          sendDesignDraftReadyEmail(researchDeliveryOrder.data.familyName, researchDeliveryOrder.id).catch(console.error);
          sendDocumentationPhaseEmail(researchDeliveryOrder.data.familyName, researchDeliveryOrder.id).catch(console.error);
          const uDoc = import("firebase/firestore").then(({getDoc, doc}) => {
            import("@/lib/firebase").then(({db}) => {
              getDoc(doc(db, "users", researchDeliveryOrder.userId)).then((userDoc) => {
                if(userDoc.exists()) {
                  const userData = userDoc.data();
                  sendCustomerDesignPhaseEmail(userData.email, userData.name || "العميل الكريم", researchDeliveryOrder.orderNumber || researchDeliveryOrder.id).catch(console.error);
                }
              });
            });
          });
        });
      } else {
        await useAppStore.getState().fulfillOrder(researchDeliveryOrder.id, {
          actionPhase: "تم التصويب",
          postCorrectionLink: researchDocumentLink
        });
        await useAppStore.getState().logTimelineEvent(
          researchDeliveryOrder.id,
          "تم تسليم السجل بعد التصويب لإدارة التصميم"
        );
        import("@/lib/emailService").then(({ sendCustomerCorrectionsAppliedEmail }) => {
          const uDoc = import("firebase/firestore").then(({getDoc, doc}) => {
            import("@/lib/firebase").then(({db}) => {
              getDoc(doc(db, "users", researchDeliveryOrder.userId)).then((userDoc) => {
                if(userDoc.exists()) {
                  const userData = userDoc.data();
                  sendCustomerCorrectionsAppliedEmail(userData.email, userData.name || "العميل الكريم", researchDeliveryOrder.orderNumber || researchDeliveryOrder.id).catch(console.error);
                }
              });
            });
          });
        });
      }
      setResearchDeliveryOrder(null);
      setResearchDocumentLink("");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التسليم");
    } finally {
      setIsFulfilling(false);
    }
  };

  const handleInitialDesignSubmit = async () => {
    if (!initialDesignSubmitOrder || !initialDesignLink.trim()) return;
    setIsFulfilling(true);
    try {
      await useAppStore.getState().fulfillOrder(initialDesignSubmitOrder.id, {
        actionPhase: "تم التصميم الإلكتروني",
        initialDesignLink: initialDesignLink
      });
      await useAppStore.getState().logTimelineEvent(
        initialDesignSubmitOrder.id,
        "تم تسليم تصميم السجل الأولي"
      );
      setInitialDesignSubmitOrder(null);
      setInitialDesignLink("");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التسليم");
    } finally {
      setIsFulfilling(false);
    }
  };

  const handleDesignSubmit = async () => {
    if (!designSubmitOrder) return;
    setIsFulfilling(true);
    try {
      await useAppStore.getState().fulfillOrder(designSubmitOrder.id, {
        actionPhase: "جاهز للتسليم النهائي",
        shippingDetails: {
          shippingDate,
          carrierName,
          trackingNumber
        },
        designLinks: {
          recordLink: designRecordLink,
          downloadLink: designDownloadLink,
          treeLink: designTreeLink,
          copiesShipped: !!trackingNumber,
          shippingDate,
          carrierName,
          trackingNumber
        }
      });
      await useAppStore.getState().logTimelineEvent(
        designSubmitOrder.id,
        "تم تجهيز السجل للطباعة والتسليم النهائي للمدير"
      );
      setDesignSubmitOrder(null);
      setDesignRecordLink("");
      setDesignDownloadLink("");
      setDesignTreeLink("");
      setDesignCopiesShipped(false);
      setShippingDate("");
      setCarrierName("");
      setTrackingNumber("");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التسليم");
    } finally {
      setIsFulfilling(false);
    }
  };

  const handleFulfillOrder = async () => {
    if (!deliveryLink.trim() || !deliveryOrder) return;
    setIsFulfilling(true);
    try {
      const phaseUpdates: any = {};
      if (deliveryTab === "draft") {
        phaseUpdates.actionPhase = "تم تسليم النسخة الأولية";
        phaseUpdates.issueStatus = "تم الإصدار";
        phaseUpdates.status = "تم تسليم الإصدار الأول";
      } else if (deliveryTab === "final") {
        phaseUpdates.actionPhase = "تم التسليم";
        phaseUpdates.issueStatus = "تم الإغلاق";
        phaseUpdates.status = "تم الإغلاق";
      }

      await fulfillOrder(deliveryOrder.id, {
        deliveryLink,
        digitalCopyLink,
        digitalCopyDownloadLink,
        posterLink,
        researchRecommendations,
        ...(deliveryTab === "final" ? { shippingDetails: { shippingDate, carrierName, trackingNumber } } : {}),
        ...phaseUpdates,
      });

      await useAppStore.getState().logTimelineEvent(
        deliveryOrder.id,
        deliveryTab === "draft"
          ? "يتم الآن تسليم المسودة للعميل للمراجعة والإعتماد"
          : "تم التسليم النهائي للسجل وتم إغلاق الطلب"
      );

      const userDoc = await getDoc(doc(db, "users", deliveryOrder.userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserInfo;
        if (userData.email) {
          await sendDeliveryEmail(
            userData.email,
            userData.name || "العميل الكريم",
            deliveryOrder.id,
            deliveryLink,
          );
        }
      }

      setDeliveryOrder(null);
      setDeliveryLink("");
      setShippingDate("");
      setCarrierName("");
      setTrackingNumber("");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التسليم");
    } finally {
      setIsFulfilling(false);
    }
  };

  const availableTabs = [
    
    {
      id: "orders",
      label: "إدارة الطلبات",
      desc: "متابعة الطلبات الجارية وتحديث حالتها",
      roles: ["maestro", "admin"],
      icon: FileText,
      color: "bg-blue-50 border-blue-200 hover:shadow-blue-100",
      iconBg: "bg-blue-100 text-blue-600",
      textColor: "text-blue-900",
    },
    {
      id: "research_management",
      label: "إدارة البحوث",
      desc: "إدارة وتحديد مراحل البحث والتوثيق للطلبات",
      roles: ["maestro", "admin", "research"],
      icon: Search,
      color: "bg-teal-50 border-teal-200 hover:shadow-teal-100",
      iconBg: "bg-teal-100 text-teal-600",
      textColor: "text-teal-900",
    },
    {
      id: "articles",
      label: "إدارة تحرير المركز المعرفي",
      desc: "نشر وإدارة المقالات المعرفية والمواد المرئية",
      roles: ["maestro", "editor", "admin"],
      icon: Book,
      color: "bg-purple-50 border-purple-200 hover:shadow-purple-100",
      iconBg: "bg-purple-100 text-purple-600",
      textColor: "text-purple-900",
    },
    {
      id: "marketing",
      label: "إدارة التسويق",
      desc: "إدارة الحملات الترويجية ومتابعة المبيعات المتروكة",
      roles: ["maestro", "marketing", "admin"],
      icon: Send,
      color: "bg-pink-50 border-pink-200 hover:shadow-pink-100",
      iconBg: "bg-pink-100 text-pink-600",
      textColor: "text-pink-900",
    },
    {
      id: "customer_service",
      label: "إدارة خدمة العملاء",
      desc: "متابعة استفسارات العملاء والطلبات الخاصة بهم",
      roles: ["maestro", "customer_service", "admin"],
      icon: HeartHandshake,
      color: "bg-orange-50 border-orange-200 hover:shadow-orange-100",
      iconBg: "bg-orange-100 text-orange-600",
      textColor: "text-orange-900",
    },
    {
      id: "shipping",
      label: "إدارة التصميم والطباعة والتوصيل",
      desc: "متابعة عمليات التصميم الإلكتروني والطباعة والتوصيل",
      roles: ["maestro", "shipping", "admin"],
      icon: Package,
      color: "bg-cyan-50 border-cyan-200 hover:shadow-cyan-100",
      iconBg: "bg-cyan-100 text-cyan-600",
      textColor: "text-cyan-900",
    },
    {
      id: "accounting",
      label: "إدارة المحاسبة",
      desc: "مراجعة المدفوعات والتقارير المالية والتحصيلات",
      roles: ["maestro", "accounting", "admin"],
      icon: Calculator,
      color: "bg-emerald-50 border-emerald-200 hover:shadow-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-600",
      textColor: "text-emerald-900",
    },
    {
      id: "compliance",
      label: "إدارة الإمتثال",
      desc: "الرقابة وتدقيق سياسات الجودة والشكاوى",
      roles: ["maestro", "compliance", "admin"],
      icon: Shield,
      color: "bg-indigo-50 border-indigo-200 hover:shadow-indigo-100",
      iconBg: "bg-indigo-100 text-indigo-600",
      textColor: "text-indigo-900",
    },
    {
      id: "users",
      label: "إدارة المستخدمين",
      desc: "مراجعة فريق العمل وتعديل الصلاحيات",
      roles: ["maestro", "admin"],
      icon: Users,
      color: "bg-rose-50 border-rose-200 hover:shadow-rose-100",
      iconBg: "bg-rose-100 text-rose-600",
      textColor: "text-rose-900",
    },
  ];

  const allowedTabs = availableTabs.filter((tab) =>
    tab.roles.includes(currentUser?.role || ""),
  );

  const roleNames: Record<string, string> = {
    maestro: "المايسترو",
    admin: "المدير العام",
    research: "مدير البحوث",
    editor: "مدير تحرير المركز المعرفي",
    marketing: "مدير التسويق",
    customer_service: "مدير خدمة العملاء",
    shipping: "مدير إدارة التصميم والطباعة والتوصيل",
    accounting: "مدير المحاسبة",
    compliance: "مدير الإمتثال",
    user: "مستخدم",
  };

  const currentTab =
    activeTab === "lobby"
      ? "lobby"
      : allowedTabs.find((t) => t.id === activeTab)
        ? activeTab
        : "lobby";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {currentTab !== "lobby" && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-brand-200 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-brand-900 mb-2">
              {allowedTabs.find((t) => t.id === currentTab)?.label ||
                "لوحة التحكم"}
            </h1>
            <p className="text-brand-600 text-sm">
              أهلاً بك، {currentUser?.name}{" "}
              <span className="font-bold text-brand-800 bg-brand-100 px-2 py-0.5 rounded-full mr-2">
                {roleNames[currentUser?.role || ""] || currentUser?.role}
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative z-50">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadNotificationsCount > 0) {
                    handleMarkNotificationsAsRead();
                  }
                }}
                className="relative bg-white border border-brand-200 text-brand-700 p-2.5 rounded-full hover:bg-brand-50 transition shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm animate-pulse">
                    {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 bg-white border border-brand-200 shadow-2xl rounded-xl overflow-hidden z-50 transform origin-top-left flex flex-col max-h-[80vh]">
                  <div className="p-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
                    <h3 className="font-bold text-brand-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600" /> مركز التنبيهات المباشرة
                    </h3>
                    <button onClick={() => setShowNotifications(false)} className="text-brand-400 hover:text-brand-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-brand-500 text-sm">
                        <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-5 h-5 text-brand-400" />
                        </div>
                        لا توجد إشعارات حتى الآن.
                      </div>
                    ) : (
                      <div className="divide-y divide-brand-100">
                        {notifications.map((notif) => {
                          const isUnread = (!readNotifIds.has(notif.id));
                          return (
                            <div key={notif.id} className={`p-4 transition ${isUnread ? 'bg-red-50/30' : 'bg-white hover:bg-brand-50/30'}`}>
                              <p className="text-sm text-brand-900 font-bold mb-1">{notif.title}</p>
                              <p className="text-xs text-brand-700 font-medium leading-relaxed mb-2">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-brand-500 font-mono">
                                <span className="bg-brand-100 px-2 py-0.5 rounded-md text-brand-700 truncate max-w-[120px]">{notif.createdBy || "النظام"}</span>
                                <span dir="ltr">
                                  {new Intl.DateTimeFormat("ar-SA", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(new Date(notif.timestamp))}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveTab("lobby")}
              className="flex items-center gap-2 bg-[#C3262A] text-white border border-[#C3262A] px-4 py-2 rounded-md hover:bg-[#a61c20] transition shadow-sm font-medium"
            >
              <ChevronLeft className="w-5 h-5 -ml-1" />
              عودة
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 bg-white text-brand-600 border border-brand-200 px-4 py-2 rounded-md hover:bg-brand-50 transition shadow-sm font-medium"
            >
              <Home className="w-5 h-5" /> الرئيسية
            </Link>

            <div className="flex items-center gap-3 text-sm font-medium text-brand-700 bg-white px-4 py-2 rounded-full border border-brand-100 shadow-sm">
              <User className="w-4 h-4 text-brand-500" />
              <span>{currentUser?.name}</span>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/Team";
                }}
                className="text-red-500 hover:text-red-700 mr-2 text-xs font-bold border-r border-brand-100 pr-3"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {currentTab === "lobby" && (
        <div className="space-y-10">
          <div className="flex justify-end gap-3 mb-2">
            <div className="relative z-50">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadNotificationsCount > 0) {
                    handleMarkNotificationsAsRead();
                  }
                }}
                className="flex items-center gap-2 bg-white text-brand-600 border border-brand-200 p-2.5 rounded-full hover:bg-brand-50 transition shadow-sm font-medium relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm animate-pulse">
                    {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 bg-white border border-brand-200 shadow-2xl rounded-xl overflow-hidden z-50 transform origin-top-left flex flex-col max-h-[80vh]">
                  <div className="p-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
                    <h3 className="font-bold text-brand-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600" /> مركز التنبيهات المباشرة
                    </h3>
                    <button onClick={() => setShowNotifications(false)} className="text-brand-400 hover:text-brand-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-brand-500 text-sm">
                        <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-5 h-5 text-brand-400" />
                        </div>
                        لا توجد إشعارات حتى الآن.
                      </div>
                    ) : (
                      <div className="divide-y divide-brand-100">
                        {notifications.map((notif) => {
                          const isUnread = (!readNotifIds.has(notif.id));
                          return (
                            <div key={notif.id} className={`p-4 transition ${isUnread ? 'bg-red-50/30' : 'bg-white hover:bg-brand-50/30'}`}>
                              <p className="text-sm text-brand-900 font-bold mb-1">{notif.title}</p>
                              <p className="text-xs text-brand-700 font-medium leading-relaxed mb-2">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-brand-500 font-mono">
                                <span className="bg-brand-100 px-2 py-0.5 rounded-md text-brand-700 truncate max-w-[120px]">{notif.createdBy || "النظام"}</span>
                                <span dir="ltr">
                                  {new Intl.DateTimeFormat("ar-SA", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(new Date(notif.timestamp))}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 bg-white text-brand-600 border border-brand-200 px-4 py-2 rounded-md hover:bg-brand-50 transition shadow-sm font-medium"
            >
              <Home className="w-4 h-4" /> العودة للرئيسية
            </Link>
            <button
              onClick={() => {
                logout();
                window.location.href = "/Team";
              }}
              className="flex items-center gap-2 bg-white text-red-600 border border-brand-200 px-4 py-2 rounded-md hover:bg-red-50 transition shadow-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-brand-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C3262A]/5 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-right">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-900 mb-4">
                  مرحباً بك،{" "}
                  <span className="text-[#C3262A]">{currentUser?.name}</span>
                </h1>
                <p className="text-xl text-brand-700 font-serif mb-6 inline-flex items-center gap-2 justify-center md:justify-start">
                  أنت تتمتع بصلاحية:
                  <span className="font-bold bg-brand-100 text-brand-900 px-4 py-1.5 rounded-full text-lg shadow-sm border border-brand-200">
                    {roleNames[currentUser?.role || ""] || currentUser?.role}
                  </span>
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-brand-500 text-sm mt-4">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>آخر دخول: اليوم</span>
                </div>
              </div>

              <div className="bg-brand-50/80 p-6 rounded-2xl border border-brand-100 max-w-sm text-center italic shadow-inner">
                <Quote className="w-8 h-8 text-brand-300 mx-auto mb-3" />
                <p className="font-serif text-brand-800 leading-relaxed font-medium">
                  "العمل المُنظّم والجهد المخلص هما الركيزتان اللتان تبنيان
                  أثراً لا يُنسى للحاضر والمستقبل. بجهودكم نتجاوز التوقعات ونصنع
                  الفارق الدائم."
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-brand-900 mb-6 px-2">
              بوابات الإدارة المتاحة لصلاحياتك:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allowedTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col text-right h-full p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 ${tab.color.split(" ")[0]} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}
                    ></div>
                    <div
                      className={`w-14 h-14 ${tab.iconBg} rounded-xl flex items-center justify-center mb-6 shadow-sm border border-white/50 relative z-10`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3
                      className={`text-xl font-bold font-serif ${tab.textColor} mb-3 relative z-10`}
                    >
                      {tab.label}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed relative z-10">
                      {tab.desc}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-end text-brand-600 font-bold text-sm relative z-10 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                      الدخول للبوابة ←
                    </div>
                  </button>
                );
              })}
            </div>

            {allowedTabs.length === 0 && (
              <div className="text-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  لا توجد لديك صلاحيات لدخول أي من بوابات الإدارة.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === "orders" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-brand-600 font-medium">
                  إجمالي الطلبات
                </p>
                <p className="text-2xl font-bold font-mono text-brand-900">
                  {orders.length}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-brand-600 font-medium">
                  قيد البحث والمراجعة
                </p>
                <p className="text-2xl font-bold font-mono text-brand-900">
                  {orders.filter((o) => o.status === "قيد البحث").length}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-brand-600 font-medium">
                  المنجزة (مكتمل)
                </p>
                <p className="text-2xl font-bold font-mono text-brand-900">
                  {orders.filter((o) => o.status === "مكتمل").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-100 flex gap-4 bg-brand-50 items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderTab("orders")}
                  className={`font-bold text-lg pb-2 transition-colors ${orderTab === "orders" ? "border-b-2 border-brand-600 text-brand-900" : "text-brand-500 hover:text-brand-700"}`}
                >
                  الطلبات النشطة
                </button>
                <button
                  onClick={() => setOrderTab("archive")}
                  className={`font-bold text-lg pb-2 transition-colors ${orderTab === "archive" ? "border-b-2 border-brand-600 text-brand-900" : "text-brand-500 hover:text-brand-700"}`}
                >
                  أرشيف الطلبات
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] lg:text-xs">
                <thead className="bg-white text-brand-500 border-b border-brand-100">
                  <tr>
                    <th className="px-2 py-3 w-8 text-center font-medium"></th>
                    <th className="px-2 py-3 font-medium">رقم الطلب</th>
                    <th className="px-2 py-3 font-medium">تاريخ الطلب</th>
                    <th className="px-2 py-3 font-medium">الأولوية</th>
                    <th className="px-2 py-3 font-medium">البريد الإلكتروني</th>
                    <th className="px-2 py-3 font-medium">
                      اسم العميل والعائلة
                    </th>
                    <th className="px-2 py-3 font-medium">نوع السجل</th>
                    <th className="px-2 py-3 font-medium">حالة الدفع</th>
                    <th className="px-2 py-3 font-medium">حالة السجل</th>
                    <th className="px-2 py-3 font-medium">الإجراء الداخلي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {orders
                    .filter((o) =>
                      orderTab === "archive" ? o.isDeleted : !o.isDeleted,
                    )
                    .map((order) => {
                      const orderUser = usersList.find(
                        (u) => u.id === order.userId,
                      );
                      const teamMembers = usersList.filter(
                        (u) => u.role !== "user",
                      );
                      return (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-brand-50/30 transition">
                            <td className="px-2 py-3 text-center">
                              <button
                                onClick={() =>
                                  setExpandedRows((prev) =>
                                    prev.includes(order.id)
                                      ? prev.filter((id) => id !== order.id)
                                      : [...prev, order.id],
                                  )
                                }
                                className="p-1 text-brand-600 rounded bg-brand-50 hover:bg-brand-100 transition"
                                title="المعالجة والإجراءات"
                              >
                                {expandedRows.includes(order.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronLeft className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="px-2 py-3 font-mono font-bold text-brand-600 uppercase">
                              #
                              {order.orderNumber ||
                                order.id.toUpperCase().substring(0, 6)}
                            </td>
                            <td className="px-2 py-3 font-mono text-gray-500 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString(
                                "ar-SA",
                              )}
                            </td>
                            <td className="px-2 py-3">
                              <select
                                value={order.priority || "عادي"}
                                onChange={async (e) => {
                                  try {
                                    const newVal = e.target.value as "عادي" | "عاجل";
                                    await useAppStore.getState().fulfillOrder(order.id, {
                                      priority: newVal,
                                    });
                                    await useAppStore.getState().logTimelineEvent(
                                      order.id,
                                      `تم تغيير الأولوية إلى: ${newVal}`
                                    );
                                  } catch (err) {
                                    console.error("Failed to update priority", err);
                                  }
                                }}
                                className={`border rounded px-1 py-1 text-[10px] sm:text-[11px] focus:ring-brand-500 font-bold outline-none cursor-pointer ${order.priority === "عاجل" ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-gray-700 border-gray-200"}`}
                              >
                                <option value="عادي">عادي</option>
                                <option value="عاجل">عاجل</option>
                              </select>
                            </td>
                            <td className="px-2 py-3 font-mono text-xs text-brand-600">
                              {orderUser?.email || "غير متوفر"}
                            </td>
                            <td className="px-2 py-3 min-w-[120px]">
                              <p className="font-bold text-brand-900 leading-tight">
                                {order.data.firstName} بن{" "}
                                {order.data.fatherName}
                              </p>
                              <p className="text-[10px] text-brand-600 mt-0.5">
                                ({order.data.familyName}) -{" "}
                                {order.data.homeland}
                              </p>
                            </td>
                            <td className="px-2 py-3">
                              <span className="inline-block px-2 py-1 border border-brand-200 bg-white text-[10px] sm:text-[11px] text-brand-700 font-bold rounded min-w-[70px] text-center">
                                {order.recordType || "سجل أساسي"}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span className="inline-block px-2 py-1 border border-brand-200 bg-white text-[10px] sm:text-[11px] text-brand-800 font-medium rounded min-w-[70px] text-center">
                                {
                                  order.paymentStatus ||
                                  (order.plan === "invite"
                                    ? "كود دعوة"
                                    : "غير مدفوع")
                                }
                              </span>
                            </td>
                            <td className="px-2 py-3 bg-brand-50/20">
                              <span className="inline-block px-2 py-1 border border-brand-200 bg-gray-50 text-[10px] sm:text-[11px] text-brand-800 font-bold rounded min-w-[70px] text-center">
                                {order.issueStatus || "طلب غير مكتمل"}
                              </span>
                            </td>
                            <td className="px-2 py-3 bg-brand-50/20">
                              <span className="inline-block px-2 py-1 bg-brand-100 text-brand-700 text-[10px] sm:text-[11px] font-bold rounded">
                                {order.actionPhase || "مرحلة البحث"}
                              </span>
                            </td>
                          </tr>

                          {expandedRows.includes(order.id) && (
                            <tr className="bg-brand-50/80 border-b border-brand-100">
                              <td colSpan={10} className="px-4 py-3">
                                <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-brand-100 w-full justify-between">
                                  {order.issueStatus !== "طلب غير مكتمل" ? (
                                    <div className="flex items-center gap-2">
                                      <label className="text-xs text-brand-600 font-bold whitespace-nowrap">
                                        الباحث المسؤول:
                                      </label>
                                      <select
                                        className="border border-brand-200 rounded px-3 py-1.5 text-xs bg-white font-bold text-brand-800 outline-none cursor-pointer min-w-[150px]"
                                        value={order.assignedResearcher || ""}
                                        onChange={async (e) => {
                                          try {
                                            const newResearcherId = e.target.value;
                                            const researcherName =
                                              usersList.find(
                                                (u) => u.id === newResearcherId,
                                              )?.name || "باحث";
  
                                            const updateData = {
                                              assignedResearcher: newResearcherId,
                                              issueStatus: "جاري التنفيذ" as const,
                                              actionPhase: "مرحلة البحث" as const,
                                            };
                                            await updateDoc(
                                              doc(db, "orders", order.id),
                                              updateData,
                                            );
                                            useAppStore.setState((s) => ({
                                              orders: s.orders.map((o) =>
                                                o.id === order.id
                                                  ? { ...o, ...updateData }
                                                  : o,
                                              ),
                                            }));
                                            await useAppStore
                                              .getState()
                                              .logTimelineEvent(
                                                order.id,
                                                `تم تعيين الباحث: ${researcherName} وتغيير الحالة إلى جاري التنفيذ.`,
                                              );
                                            
                                            // Note: sendResearchAssignedEmail handles any potential async issues gracefully
                                            import("@/lib/emailService").then(({ sendResearchAssignedEmail }) => {
                                              sendResearchAssignedEmail(order.data?.familyName || "العائلة", order.id).catch(console.error);
                                            });
                                            setAssignSuccessModal({ show: true, message: "تم تعيين الباحث بنجاح" }); setTimeout(() => setAssignSuccessModal({ show: false, message: "" }), 3000);
                                          } catch (error) {
                                            console.error("Assignment error:", error);
                                            alert("حدث خطأ أثناء المحاولة، يرجى التأكد من الصلاحيات والاتصال بالإنترنت.");
                                          }
                                        }}
                                      >
                                        <option value="">
                                          -- لم يتم التعيين --
                                        </option>
                                        {usersList
                                          .filter((u) => u.role !== "user")
                                          .map((u) => (
                                            <option key={u.id} value={u.id}>
                                              {u.name || u.email}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <span className="text-xs text-gray-500 font-bold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">الطلب غير مكتمل ولا يمكن تعيين باحث حالياً.</span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 overflow-x-auto">
                                    <button
                                      onClick={() => setSelectedAuditOrder(order)}
                                      className="flex items-center gap-1.5 whitespace-nowrap text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm"
                                    >
                                      <Search className="w-3 h-3" /> مراجعة سجل حركات الطلب
                                    </button>
                                    {order.actionPhase === "تم التصميم الإلكتروني" && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setDeliveryTab("draft");
                                            setDeliveryOrder(order);
                                            setDigitalCopyLink(order.initialDesignLink || "");
                                            setDeliveryLink(order.initialDesignLink || "");
                                          }}
                                          className="flex items-center gap-1.5 whitespace-nowrap text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm"
                                        >
                                          <FileText className="w-3 h-3" /> تسليم النسخة الأولية
                                        </button>
                                      </>
                                    )}
                                    {order.actionPhase === "جاهز للتسليم النهائي" && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setDeliveryTab("final");
                                            setDeliveryOrder(order);
                                            setDigitalCopyLink(order.designLinks?.recordLink || "");
                                            setDigitalCopyDownloadLink(order.designLinks?.downloadLink || "");
                                            setDeliveryLink(order.designLinks?.recordLink || "");
                                            setPosterLink(order.designLinks?.treeLink || "");
                                            setShippingDate(order.designLinks?.shippingDate || "");
                                            setCarrierName(order.designLinks?.carrierName || "");
                                            setTrackingNumber(order.designLinks?.trackingNumber || "");
                                          }}
                                          className="flex items-center gap-1.5 whitespace-nowrap text-white bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 px-4 py-2 rounded-lg text-sm font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"
                                        >
                                          <CheckCircle className="w-4 h-4" /> التسليم النهائي للعميل
                                        </button>
                                      </>
                                    )}
                                    <button
                                      onClick={() =>
                                        orderTab === "archive"
                                          ? handleRestoreOrder(order)
                                          : setOrderToDelete(order)
                                      }
                                      className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-bold transition ${orderTab === "archive" ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"}`}
                                    >
                                      {orderTab === "archive" ? (
                                        <>
                                          <CheckCircle className="w-3 h-3" />{" "}
                                          استعادة
                                        </>
                                      ) : (
                                        <>
                                          <X className="w-3 h-3" /> مسح / أرشيف
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  {orders.filter((o) =>
                    orderTab === "archive" ? o.isDeleted : !o.isDeleted,
                  ).length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-12 text-center text-brand-500 font-bold bg-brand-50/20"
                      >
                        لا توجد طلبات في هذا القسم حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {currentTab === "research_management" &&
        (() => {
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                <h2 className="font-bold text-lg text-brand-900">
                  إدارة البحوث والتوثيق
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-white text-brand-500 border-b border-brand-100">
                    <tr>
                      <th className="px-4 py-4 font-medium">رقم الطلب</th>
                      <th className="px-4 py-4 font-medium">تاريخ الطلب</th>
                      <th className="px-4 py-4 font-medium">الأولوية</th>
                      <th className="px-4 py-4 font-medium">
                        اسم العميل والعائلة
                      </th>
                      <th className="px-4 py-4 font-medium">نوع السجل</th>
                      <th className="px-4 py-4 font-medium text-center text-xs">
                        المساهمة في الإثراء
                      </th>
                      <th className="px-4 py-4 font-medium">
                        مرحلة التنفيذ (الإجراء)
                      </th>
                      <th className="px-4 py-4 font-medium">
                        التفاصيل
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {orders
                      .filter((o) => !o.isDeleted && o.issueStatus !== "بإنتظار إتمام الدفع" && o.issueStatus !== "طلب غير مكتمل")
                      .map((order) => (
                        <React.Fragment key={`rm-${order.id}`}>
                          <tr className={order.actionPhase === "تم التسليم" ? "bg-gray-100/60 opacity-80 transition" : "hover:bg-brand-50/30 transition"}>
                            <td className="px-4 py-4 font-mono font-bold text-brand-600 uppercase">
                              #
                              {order.orderNumber ||
                                order.id.toUpperCase().substring(0, 6)}
                            </td>
                            <td className="px-4 py-4 font-mono text-gray-500 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString(
                                "ar-SA",
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${order.priority === "عاجل" ? "bg-red-50 text-red-700 border-red-200" : "bg-brand-50 text-brand-700 border-brand-200"} border`}
                              >
                                {order.priority || "عادي"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-bold text-brand-900 leading-tight">
                                {order.data.firstName} بن{" "}
                                {order.data.fatherName}
                              </p>
                              <p className="text-xs text-brand-600 mt-0.5">
                                ({order.data.familyName})
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100">
                                {order.recordType || "سجل أساسي"}
                              </span>
                            </td>
                            {(() => {
                              const orderCreatedDate = new Date(order.createdAt);
                              const targetDate = new Date(orderCreatedDate);
                              targetDate.setDate(targetDate.getDate() + 15);
                              const diffTime = targetDate.getTime() - new Date().getTime();
                              const remDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              const validDays = remDays > 0 ? remDays : 0;
                              
                              const closedCount = Object.values(order.data?.sectionStatuses || {}).filter(s => s === "closed").length;
                              const pct = Math.round((closedCount / 10) * 100);
                              
                              return (
                                <td className="px-4 py-4 text-center">
                                  <div className="w-24 bg-brand-100 rounded-full h-1.5 mb-1 dark:bg-brand-200 mx-auto">
                                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-bold text-brand-600 block">{pct}% - متبقي {validDays} يوم</span>
                                </td>
                              )
                            })()}
                            <td className="px-4 py-4">
                              {(() => {
                                const currentPhase = order.actionPhase || "مرحلة البحث";
                                const isResearchPhase = currentPhase === "مرحلة البحث" || currentPhase === "مرحلة التوثيق";
                                
                                if (!isResearchPhase) {
                                  return (
                                    <span className="px-3 py-1.5 rounded-md font-bold text-xs inline-block border bg-gray-100 text-gray-700 border-gray-300">
                                      {currentPhase}
                                    </span>
                                  );
                                }

                                return (
                                  <select
                                    value={currentPhase}
                                    onChange={async (e) => {
                                      const newPhase = e.target.value as ActionPhase;
                                      const updateData: any = {
                                        actionPhase: newPhase,
                                      };

                                      if (
                                        newPhase === "مرحلة التوثيق" &&
                                        order.totalAmount === 1980 &&
                                        (!order.paymentStatus ||
                                          order.paymentStatus === "مدفوع أول دفعة" ||
                                          order.paymentStatus === "كود دعوة")
                                      ) {
                                        updateData.paymentStatus = "مستحق الدفعة الثانية";
                                      }

                                      try {
                                        await useAppStore.getState().fulfillOrder(order.id, updateData);
                                        if (updateData.paymentStatus) {
                                          useAppStore.getState().logTimelineEvent(
                                            order.id,
                                            `استحقاق الدفعة الثانية للعميل لتنقله لمرحلة التوثيق.`
                                          );
                                        }
                                        useAppStore.getState().logTimelineEvent(
                                          order.id,
                                          `تم تغيير الإجراء إلى: ${newPhase}`
                                        );

                                        if (newPhase === "مرحلة التوثيق") {
                                          import("@/lib/emailService").then(({ sendCustomerDocumentationPhaseEmail }) => {
                                            const uDoc = import("firebase/firestore").then(({getDoc, doc}) => {
                                              import("@/lib/firebase").then(({db}) => {
                                                getDoc(doc(db, "users", order.userId)).then((userDoc) => {
                                                  if(userDoc.exists()) {
                                                    const userData = userDoc.data();
                                                    sendCustomerDocumentationPhaseEmail(userData.email, userData.name || "العميل الكريم", order.orderNumber || order.id).catch(console.error);
                                                  }
                                                });
                                              });
                                            });
                                          });
                                        }
                                      } catch (error) {
                                        console.error("Failed to update status", error);
                                      }
                                    }}
                                    className="border border-brand-300 rounded px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm font-bold w-full max-w-[150px]"
                                  >
                                    {currentPhase === "مرحلة البحث" && <option value="مرحلة البحث">مرحلة البحث</option>}
                                    <option value="مرحلة التوثيق">مرحلة التوثيق</option>
                                  </select>
                                );
                              })()}
                            </td>
                            <td className="px-4 py-4">
                              {order.actionPhase !== "تم التسليم" ? (
                                <div className="flex gap-2 flex-col">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 text-xs w-full justify-center"
                                    >
                                      <Eye className="w-4 h-4" /> عرض تفاصيل الطلب
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMessagingOrder(order);
                                        markMessagesAsRead(order.id, "admin");
                                      }}
                                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 text-xs w-full justify-center relative"
                                    >
                                      <MessageSquare className="w-4 h-4" /> طلب
                                      إيضاح
                                      {order.messages &&
                                        order.messages.filter(
                                          (m) => m.senderRole === "user" && !m.isRead,
                                        ).length > 0 && (
                                          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-ping"></span>
                                        )}
                                      {order.messages &&
                                        order.messages.filter(
                                          (m) => m.senderRole === "user" && !m.isRead,
                                        ).length > 0 && (
                                          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
                                        )}
                                    </button>
                                  </div>
                                  
                                  {order.actionPhase !== "تمت المسودة" && order.actionPhase !== "تم التصويب" && order.actionPhase !== "تم التصميم الإلكتروني" && order.actionPhase !== "جاهز للتسليم النهائي" && order.actionPhase !== "تم تجهيز السجل للطباعة" && order.actionPhase !== "جاهز للتسليم" && order.actionPhase !== "تم تسليم النسخة الأولية" && (
                                    <button
                                      onClick={() => {
                                        setResearchDeliveryOrder(order);
                                        setResearchDeliveryTab(order.actionPhase === "جاري التصويب" ? "correction" : "draft");
                                      }}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 text-xs w-full justify-center mt-2"
                                    >
                                      <Upload className="w-4 h-4" /> {order.actionPhase === "جاري التصويب" ? "تسليم السجل لإدارة التصميم" : "تسليم المسودة لإدارة التصميم"}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 font-bold text-xs py-2 bg-gray-50 rounded-lg border border-gray-200">
                                  تم تسليم السجل للعميل (مغلق)
                                </div>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    {orders.filter((o) => !o.isDeleted).length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-brand-500"
                        >
                          لا يوجد طلبات حالياً في إدارة البحوث
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

      {currentTab === "articles" && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-brand-900">
              إدارة المقالات والمركز المعرفي
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setArticleForm({
                    title: "",
                    type: "مقال",
                    section: "الروايات والذاكرة",
                    filter: "عام",
                  });
                  setIsArticleModalOpen(true);
                }}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 transition"
              >
                <Plus className="w-5 h-5" /> إضافة موضوع
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-white text-brand-500 border-b border-brand-100">
                <tr>
                  <th className="px-6 py-4 font-medium w-1/3">العنوان</th>
                  <th className="px-6 py-4 font-medium">النوع</th>
                  <th className="px-6 py-4 font-medium">القسم/التصفية</th>
                  <th className="px-6 py-4 font-medium">تاريخ النشر</th>
                  <th className="px-6 py-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-brand-50/50 transition"
                  >
                    <td className="px-6 py-4 font-bold text-brand-900">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 text-brand-600 font-medium">
                      <span
                        className={`px-2 py-1 rounded text-xs ${article.type === "فيديو" ? "bg-red-100 text-red-700" : "bg-brand-100 text-brand-700"}`}
                      >
                        {article.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-600 text-xs">
                      {article.section} <br />{" "}
                      <span className="text-gray-400">{article.filter}</span>
                    </td>
                    <td className="px-6 py-4 text-brand-600">
                      {article.publishDate || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingArticle(article);
                          setArticleForm({ ...article });
                          setIsArticleModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1 text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-md transition font-medium text-xs"
                      >
                        <Edit3 className="w-3 h-3" /> تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition font-medium text-xs"
                      >
                        <Trash2 className="w-3 h-3" /> حذف
                      </button>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-brand-500"
                    >
                      لا يوجد مواضيع حالياً في المركز المعرفي
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === "accounting" &&
        (() => {
          const accountingOrders = orders.filter((o) => !o.isDeleted);
          const fullPayment = accountingOrders.filter(
            (o) =>
              o.paymentStatus === "مدفوع بالكامل" || o.totalAmount === 1780,
          );
          const flexPayment = accountingOrders.filter(
            (o) => o.totalAmount === 1980,
          );
          return (
            <div className="space-y-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100">
                  <h3 className="font-bold text-lg text-brand-900 mb-2">
                    إجمالي الطلبات (الدفع الكامل)
                  </h3>
                  <p className="text-3xl font-bold font-mono text-brand-600">
                    {fullPayment.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100">
                  <h3 className="font-bold text-lg text-brand-900 mb-2">
                    إجمالي الطلبات (الدفع المرن)
                  </h3>
                  <p className="text-3xl font-bold font-mono text-brand-600">
                    {flexPayment.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100">
                  <h3 className="font-bold text-lg text-brand-900 mb-2">
                    دفعات مستحقة (لم تسدد)
                  </h3>
                  <p className="text-3xl font-bold font-mono text-red-600">
                    {
                      flexPayment.filter(
                        (o) =>
                          o.paymentStatus === "مستحق الدفعة الثانية" ||
                          o.paymentStatus === "مستحق الدفعة الثالثة",
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                  <h2 className="font-bold text-lg text-brand-900">
                    سجل المدفوعات والفواتير المبدئية
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-white text-brand-500 border-b border-brand-100">
                      <tr>
                        <th className="px-4 py-4 font-medium">رقم الطلب</th>
                        <th className="px-4 py-4 font-medium">نوع الدفع</th>
                        <th className="px-4 py-4 font-medium">حالة الدفع</th>
                        <th className="px-4 py-4 font-medium">الإجراء الحالي</th>
                        <th className="px-4 py-4 font-medium">
                          الإجراءات المحاسبية
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-50">
                      {accountingOrders.map((order) => {
                        const isFlexible = order.totalAmount === 1980;
                        const showFirstRequest = isFlexible && (order.actionPhase === "مرحلة التوثيق" || order.actionPhase === "تم التوثيق");
                        const showSecondRequest = isFlexible && order.actionPhase === "تم التصميم الإلكتروني";
                        const showRequestBtn = showFirstRequest || showSecondRequest;
                        
                        return (
                        <tr
                          key={`acc-${order.id}`}
                          className="hover:bg-brand-50/30 transition"
                        >
                          <td className="px-4 py-4 font-mono font-bold text-brand-600 uppercase">
                            #
                            {order.orderNumber ||
                              order.id.toUpperCase().substring(0, 6)}
                          </td>
                          <td className="px-4 py-4 font-bold">
                            {isFlexible
                              ? "دفع مرن (دفعات)"
                              : "دفع كامل"}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold border ${order.paymentStatus?.includes("مستحق") ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}
                            >
                              {order.paymentStatus || "غير محدد"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-brand-600 font-bold text-xs">
                             {order.actionPhase || "مرحلة البحث"}
                          </td>
                          <td className="px-4 py-4 flex gap-2 flex-wrap">
                            <button className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg transition border border-brand-200 text-xs shadow-sm">
                              إصدار فاتورة
                            </button>
                            {order.paymentStatus?.includes("مستحق") && (
                              <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition text-xs shadow-sm">
                                تأكيد تحصيل الدفعة
                              </button>
                            )}
                            {showRequestBtn && (
                              <button 
                                onClick={() => setPaymentRequestOrder(order)}
                                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-[#C3262A] hover:bg-red-700 text-white font-bold rounded-lg transition text-xs shadow-md border border-red-500 animate-pulse hover:animate-none"
                              >
                                مطالبة العميل بتحصيل الدفعة
                              </button>
                            )}
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

      {currentTab === "compliance" && <ComplianceDashboard />}

      {currentTab === "marketing" &&
        (() => {
          const inactiveOrders = orders.filter(
            (o) => !o.isDeleted && o.issueStatus === "طلب غير مكتمل",
          );
          const unpaidOrders = orders.filter(
            (o) =>
              !o.isDeleted &&
              (o.issueStatus === "بإنتظار إتمام الدفع" ||
                o.paymentStatus === "غير مدفوع" ||
                o.paymentStatus === "دفع جزئي"),
          );
          return (
            <div className="space-y-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-50 p-3 rounded-xl text-red-600">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-900">
                      طلبات غير مكتملة البيانات
                    </h3>
                  </div>
                  <p className="text-2xl font-bold font-mono text-brand-900 mb-2">
                    {inactiveOrders.length}
                  </p>
                  <p className="text-sm text-brand-500">
                    عملاء غادروا الصفحة قبل إكمال البيانات والدفع.
                  </p>
                  <div className="mt-4 pt-4 border-t border-brand-50">
                    <button className="text-brand-600 font-bold text-sm hover:text-brand-800 transition">
                      تحميل القائمة (CSV)
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-900">
                      طلبات غير مدفوعة (مبيعات متروكة)
                    </h3>
                  </div>
                  <p className="text-2xl font-bold font-mono text-brand-900 mb-2">
                    {unpaidOrders.length}
                  </p>
                  <p className="text-sm text-brand-500">
                    عملاء أكملوا البيانات ولم يتموا الدفع.
                  </p>
                  <div className="mt-4 pt-4 border-t border-brand-50">
                    <button className="text-brand-600 font-bold text-sm hover:text-brand-800 transition">
                      تفعيل حملة استهداف (مبيعات متروكة)
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100">
                <h3 className="font-bold text-lg text-brand-900 mb-6">
                  الحملات والنشرات الترويجية القادمة
                </h3>
                <div className="p-12 text-center bg-brand-50 rounded-xl border border-dashed border-brand-200">
                  <Send className="w-12 h-12 text-brand-300 mx-auto mb-4" />
                  <h4 className="font-bold text-brand-700 mb-2">
                    جدولة النشرات والنشر على منصات التواصل
                  </h4>
                  <p className="text-sm text-brand-500">
                    جاري ربط نظام إدارة التسويق الآلي. سيتم توفير محرر النشرات
                    وتخطيط المحتوى قريباً.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

      {currentTab === "shipping" &&
        (() => {
          const designOrders = orders.filter(
            (o) =>
              !o.isDeleted &&
              (o.actionPhase === "تمت المسودة" ||
                o.actionPhase === "جاري التصويب" ||
                o.actionPhase === "تم التصميم الإلكتروني" ||
                o.actionPhase === "تم إصدار النسخة الأولية" ||
                o.actionPhase === "تم الإصدار" ||
                o.actionPhase === "تم تسليم الإصدار الأول" ||
                o.actionPhase === "تم التصويب" ||
                o.actionPhase === "تم تجهيز السجل للطباعة" ||
                o.actionPhase === "جاهز للتسليم النهائي" ||
                o.actionPhase === "جاهز للتسليم" ||
                o.actionPhase === "تم التسليم"),
          ).sort((a, b) => {
            const needsActionA = a.actionPhase === "تمت المسودة" || a.actionPhase === "تم التصميم الإلكتروني" || a.actionPhase === "تم التصويب";
            const needsActionB = b.actionPhase === "تمت المسودة" || b.actionPhase === "تم التصميم الإلكتروني" || b.actionPhase === "تم التصويب";
            if (needsActionA && !needsActionB) return -1;
            if (!needsActionA && needsActionB) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden mb-12">
              <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                <h2 className="font-bold text-lg text-brand-900">
                  إدارة التصميم والطباعة والتوصيل
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-white text-brand-500 border-b border-brand-100">
                    <tr>
                      <th className="px-4 py-4 font-medium">رقم الطلب</th>
                      <th className="px-4 py-4 font-medium">اسم العميل</th>
                      <th className="px-4 py-4 font-medium">
                        مرحلة التنفيذ (الإجراء)
                      </th>
                      <th className="px-4 py-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {designOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-brand-500 font-bold bg-brand-50/20"
                        >
                          لا يوجد بيانات لعرضها في هذه المرحلة
                        </td>
                      </tr>
                    ) : (
                      designOrders.map((order) => {
                        const needsAction = order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب";
                        const isDelivered = order.actionPhase === "تم التسليم";
                        return (
                        <tr
                          key={`sh-${order.id}`}
                          className={`transition ${needsAction ? "hover:bg-brand-50/30 bg-white" : isDelivered ? "bg-gray-100/60 opacity-80" : "bg-gray-100 hover:bg-gray-200"}`}
                        >
                          <td className="px-4 py-4 font-mono font-bold text-brand-600 uppercase">
                            #
                            {order.orderNumber ||
                              order.id.toUpperCase().substring(0, 6)}
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-brand-900 leading-tight">
                              {order.data.firstName} بن {order.data.fatherName}
                            </p>
                            <p className="text-xs text-brand-600 mt-0.5">
                              ({order.data.familyName})
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1.5 rounded-md font-bold text-xs inline-block border ${needsAction ? 'bg-amber-50 text-amber-700 border-amber-200' : isDelivered ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-200 text-gray-700 border-gray-300'}`}>
                               {order.actionPhase || "تمت المسودة"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2">
                              {!isDelivered && order.initialDesignLink && (order.actionPhase === "تم التصويب" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم الإصدار" || order.actionPhase === "تم تسليم الإصدار الأول") && (
                                <a href={order.initialDesignLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs">
                                  <Download className="w-4 h-4" /> مسودة السجل
                                </a>
                              )}
                              {!isDelivered && (
                                <>
                                  {(order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصويب") && (
                                    <a href={order.actionPhase === "تم التصويب" || order.actionPhase === "جاري التصويب" ? (order.postCorrectionLink || order.researchDraftLink) : order.researchDraftLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs">
                                      <Download className="w-4 h-4" /> {order.actionPhase === "تم التصويب" || order.actionPhase === "جاري التصويب" ? "تحميل ملف البحث بعد التصويب" : "تحميل ملف البحث"}
                                    </a>
                                  )}
                                  {(order.actionPhase === "تمت المسودة" || order.actionPhase === "جاري التصويب" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب" || order.actionPhase === "جاهز للتسليم النهائي") && (
                                    <>
                                      {order.data.designTemplate && (
                                        <button
                                          onClick={() => setShowDesignModal(order.data.designTemplate)}
                                          className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs w-full"
                                        >
                                          <Palette className="w-4 h-4" /> عرض قالب التصميم
                                        </button>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                              {(order.actionPhase === "جاهز للتسليم النهائي" || order.actionPhase === "جاهز للتسليم" || order.actionPhase === "تم تجهيز السجل للطباعة" || order.actionPhase === "تم التسليم" || order.actionPhase === "تمت المسودة" || order.actionPhase === "تم التصميم الإلكتروني" || order.actionPhase === "تم التصويب") && (
                                <button
                                  onClick={() => {
                                    setPrintReadyLink(order.printReadyLink || "");
                                    setShippingContactOrder(order);
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2 text-xs border border-brand-500 hover:animate-none"
                                >
                                  <MapPin className="w-4 h-4" /> عرض بيانات التواصل والعنوان البريدي
                                </button>
                              )}
                              {!isDelivered && order.actionPhase === "تمت المسودة" && (
                                <button
                                  onClick={() => setInitialDesignSubmitOrder(order)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                >
                                  <Upload className="w-4 h-4" /> تسليم السجل الأولي
                                </button>
                              )}
                              {!isDelivered && order.actionPhase === "تم التصويب" && (
                                <>
                                  <button
                                    onClick={() => setDesignSubmitOrder(order)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                  >
                                    <Upload className="w-4 h-4" /> تسليم السجل النهائي لإدارة الطلبات
                                  </button>
                                  
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )})
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

              {currentTab === "customer_service" &&
        (() => {
          let filteredUsers = usersList.filter((u) => u.role === "user");

          if (userSearch) {
            filteredUsers = filteredUsers.filter((u) =>
              `${u.name} ${u.email}`
                .toLowerCase()
                .includes(userSearch.toLowerCase()),
            );
          }

          const formatDate = (d?: string) => {
            if (!d) return "غير محدد";
            return new Intl.DateTimeFormat("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(d));
          };

          return (
            <div className="space-y-8">
              <ChatbotManagement />
              <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                  <h2 className="font-bold text-lg text-brand-900">
                    إدارة خدمة العملاء (العملاء والطلبات)
                  </h2>
                </div>

              <div className="p-4 border-b border-brand-50 flex flex-wrap gap-4 items-center bg-gray-50/50">
                <div className="flex-1 min-w-[200px] relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو البريد..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                  <Search className="w-4 h-4 text-brand-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-white text-brand-500 border-b border-brand-100">
                    <tr>
                      <th className="px-4 py-4 font-medium">
                        البريد الإلكتروني
                      </th>
                      <th className="px-4 py-4 font-medium">الاسم</th>
                      <th className="px-4 py-4 font-medium">
                        اسم العميل والعائلة
                      </th>
                      <th className="px-4 py-4 font-medium">رقم الطلب</th>
                      <th className="px-4 py-4 font-medium">تاريخ الطلب</th>
                      <th className="px-4 py-4 font-medium">
                        الإصدار (حالة التنفيذ)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-brand-500"
                        >
                          لا يوجد عملاء يطابقون بحثك
                        </td>
                      </tr>
                    ) : null}
                    {filteredUsers.map((user) => {
                      const userOrders = orders
                        .filter((o) => o.userId === user.id)
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        );
                      const latestOrder = userOrders[0];

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-brand-50/50 transition"
                        >
                          <td className="px-4 py-4 text-brand-600 font-mono text-xs">
                            {user.email || "بدون بريد"}
                          </td>
                          <td className="px-4 py-4 font-bold text-brand-900">
                            {user.name || "بدون اسم"}
                          </td>
                          <td className="px-4 py-4 text-brand-900 text-xs">
                            {latestOrder
                              ? `${latestOrder.data.firstName} ${latestOrder.data.familyName}`
                              : "لا يوجد طلب"}
                          </td>
                          <td className="px-4 py-4 text-brand-600 font-mono text-xs">
                            {latestOrder
                              ? `#${latestOrder.orderNumber || latestOrder.id.toUpperCase().substring(0, 6)}`
                              : "-"}
                          </td>
                          <td className="px-4 py-4 text-brand-500 text-xs">
                            {latestOrder
                              ? formatDate(latestOrder.createdAt)
                              : "-"}
                          </td>
                          <td className="px-4 py-4">
                            {latestOrder ? (
                              <div className="flex flex-col gap-2">
                                <span className="px-2 py-1 rounded bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100 text-center w-fit">
                                  {latestOrder.issueStatus || "طلب غير مكتمل"}
                                </span>
                                <button
                                  onClick={() => {
                                    setMessagingOrder(latestOrder);
                                    markMessagesAsRead(latestOrder.id, "admin");
                                  }}
                                  className="flex items-center gap-1.5 whitespace-nowrap text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md text-[10px] font-bold transition relative w-fit"
                                >
                                  <MessageSquare className="w-3 h-3" /> طلبات
                                  إيضاح ورسائل
                                  {latestOrder.messages &&
                                    latestOrder.messages.filter(
                                      (m) =>
                                        m.senderRole === "user" && !m.isRead,
                                    ).length > 0 && (
                                      <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full animate-ping"></span>
                                    )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                لا يوجد بيانات
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          );
        })()}

      {currentTab === "users" &&
        (() => {
          let filteredUsers = usersList.filter((u) => u.role !== "user");

          if (userSearch) {
            filteredUsers = filteredUsers.filter((u) =>
              `${u.name} ${u.email}`
                .toLowerCase()
                .includes(userSearch.toLowerCase()),
            );
          }

          if (userCountryFilter) {
            filteredUsers = filteredUsers.filter(
              (u) => u.country === userCountryFilter,
            );
          }

          filteredUsers.sort((a, b) => {
            if (userSortBy === "newest")
              return (
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
              );
            if (userSortBy === "recent_login")
              return (
                new Date(b.lastLoginAt || 0).getTime() -
                new Date(a.lastLoginAt || 0).getTime()
              );
            if (userSortBy === "alpha")
              return (a.name || "").localeCompare(b.name || "", "ar");
            return 0;
          });

          const formatDate = (d?: string) => {
            if (!d) return "غير محدد";
            return new Intl.DateTimeFormat("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(d));
          };

          const uniqueCountries = Array.from(
            new Set(
              usersList
                .filter((u) => u.role !== "user")
                .map((u) => u.country)
                .filter(Boolean),
            ),
          );

          return (
            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
                <h2 className="font-bold text-lg text-brand-900">
                  فريق العمل (إدارة الصلاحيات)
                </h2>
              </div>

              <div className="p-4 border-b border-brand-50 flex flex-wrap gap-4 items-center bg-gray-50/50">
                <div className="flex-1 min-w-[200px] relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو البريد..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                  <Search className="w-4 h-4 text-brand-400 absolute right-3 top-3" />
                </div>

                <select
                  value={userCountryFilter}
                  onChange={(e) => setUserCountryFilter(e.target.value)}
                  className="border border-brand-200 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">جميع الدول</option>
                  {uniqueCountries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value as any)}
                  className="border border-brand-200 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="newest">الأحدث تسجيلاً</option>
                  <option value="recent_login">أحدث دخول</option>
                  <option value="alpha">أبجدياً</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-white text-brand-500 border-b border-brand-100">
                    <tr>
                      <th className="px-4 py-4 font-medium">الاسم</th>
                      <th className="px-4 py-4 font-medium">
                        البريد الإلكتروني
                      </th>
                      <th className="px-4 py-4 font-medium">الدولة</th>
                      <th className="px-4 py-4 font-medium">رقم الجوال</th>
                      <th className="px-4 py-4 font-medium">أخر دخول</th>
                      <th className="px-4 py-4 font-medium">الصلاحيات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-brand-500"
                        >
                          لا يوجد مستخدمين يطابقون بحثك
                        </td>
                      </tr>
                    ) : null}
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-brand-50/50 transition"
                      >
                        <td className="px-4 py-4 font-bold text-brand-900">
                          {user.name || "بدون اسم"}
                        </td>
                        <td className="px-4 py-4 text-brand-600 font-mono text-xs">
                          {user.email || "بدون بريد"}
                        </td>
                        <td className="px-4 py-4 text-brand-600 font-medium">
                          {user.country || "غير محدد"}
                        </td>
                        <td
                          className="px-4 py-4 text-brand-500 text-xs"
                          dir="ltr"
                        >
                          {user.mobile || "غير محدد"}
                        </td>
                        <td className="px-4 py-4 text-brand-500 text-xs">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-4 py-4 flex items-center gap-2">
                          {currentUser &&
                          (currentUser.role === "maestro" ||
                            currentUser.role === "admin") ? (
                            <>
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleRoleChange(user.id, e.target.value)
                                }
                                className="border border-brand-200 rounded-md px-2 py-1 text-xs bg-brand-50 text-brand-900 font-medium font-sans w-32"
                              >
                                <option value="user">مستخدم عادي</option>
                                <option value="maestro">مايسترو</option>
                                <option value="admin">مدير العام</option>
                                <option value="research">مدير البحوث</option>
                                <option value="editor">
                                  مدير تحرير المركز المعرفي
                                </option>
                                <option value="marketing">مدير التسويق</option>
                                <option value="customer_service">
                                  مدير خدمة العملاء
                                </option>
                                <option value="shipping">
                                  مدير إدارة التصميم والطباعة والتوصيل
                                </option>
                                <option value="accounting">
                                  مدير المحاسبة
                                </option>
                                <option value="compliance">
                                  مدير الإمتثال
                                </option>
                              </select>
                              {user.role !== "user" && (
                                <button
                                  onClick={() => {
                                    setEditingUserProfile(user);
                                    setUserProfileForm({
                                      mobile: user.mobile || "",
                                      country: user.country || "",
                                      passportUrl: user.passportUrl || "",
                                    });
                                  }}
                                  className="text-xs font-bold text-brand-600 hover:text-brand-800 bg-white border border-brand-200 px-2 py-1 rounded"
                                >
                                  تعديل البيانات
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="font-bold text-brand-800 bg-brand-100 px-3 py-1 rounded-full text-xs">
                              {user.role}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

      {/* Delete Order Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 p-6 border-b-4 border-red-500">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              تحذير خطير
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 font-medium">
              سيتم حذف السجل رقم{" "}
              <span className="p-1 px-2 uppercase bg-gray-100 rounded text-brand-700 mx-1">
                #{orderToDelete.orderNumber || orderToDelete.id.toUpperCase()}
              </span>{" "}
              وكافة مرفقاته ومكوناته.
              <br />
              <br />
              هل أنت متأكد من ذلك؟ هذا الإجراء{" "}
              <strong>لا يمكن التراجع عنه</strong>!
            </p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const { updateDoc, doc } =
                      await import("firebase/firestore");
                    const { db } = await import("@/lib/firebase");
                    await updateDoc(doc(db, "orders", orderToDelete.id), {
                      isDeleted: true,
                    });
                    useAppStore.setState((s) => ({
                      orders: s.orders.map((o) =>
                        o.id === orderToDelete.id
                          ? { ...o, isDeleted: true }
                          : o,
                      ),
                    }));
                    setOrderToDelete(null);
                  } catch (e) {
                    console.error(e);
                    alert("خطأ في الحذف");
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
              >
                تأكيد حذف السجل
              </button>
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {selectedAuditOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
              <h3 className="font-bold text-brand-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-600" />
                سجل حركات الطلب - طلب #
                {selectedAuditOrder.orderNumber ||
                  selectedAuditOrder.id.toUpperCase().substring(0, 6)}
              </h3>
              <button
                onClick={() => setSelectedAuditOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50 flex-1 space-y-6">
              <div className="bg-white p-5 rounded-xl border border-brand-100 shadow-sm relative">
                <h4 className="font-bold text-brand-900 border-b border-brand-100 pb-2 mb-4">
                  التسلسل الزمني للطلب
                </h4>

                {selectedAuditOrder.timeline &&
                selectedAuditOrder.timeline.length > 0 ? (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-200 before:to-transparent">
                    {[...selectedAuditOrder.timeline]
                      .sort(
                        (a, b) =>
                          new Date(a.timestamp).getTime() -
                          new Date(b.timestamp).getTime(),
                      )
                      .map((event, idx) => (
                        <div
                          key={idx}
                          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-100 text-brand-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md hover:border-brand-300">
                            <div className="flex items-center justify-between space-x-2 space-x-reverse mb-1">
                              <div className="font-bold text-brand-900">
                                {event.message || event.event || "حدث"}
                              </div>
                              <time className="font-mono text-xs text-brand-500">
                                {new Intl.DateTimeFormat("ar-SA", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }).format(new Date(event.timestamp))}
                              </time>
                            </div>
                            <div className="text-sm text-brand-700">
                              {event.details}
                            </div>
                            {event.userName && (
                              <div className="mt-3 pt-3 border-t border-brand-50 flex items-center justify-start">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-brand-50 to-white px-3 py-1.5 rounded-full border border-brand-200 shadow-sm hover:shadow-md transition">
                                  <div className="bg-brand-600 text-white rounded-full p-1">
                                    <User className="w-3 h-3" />
                                  </div>
                                  <span className="text-xs font-bold text-brand-900">
                                    {event.userName}
                                  </span>
                                  <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-md font-medium">
                                    {roleNames[event.role || ""] || event.role}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-brand-500 text-center py-8">
                    لا يوجد سجل حركات متاح لهذا الطلب.
                  </p>
                )}
              </div>

              {selectedAuditOrder.data.documents &&
                selectedAuditOrder.data.documents.length > 0 &&
                selectedAuditOrder.data.documents.some((d) => {
                  if (!d) return false;
                  const kind = typeof d === "string" ? "" : d.kind;
                  return kind === "توقيع إلكتروني" || kind === "عقد signnow";
                }) && (
                  <div className="bg-white p-5 rounded-xl border border-brand-100 shadow-sm">
                    <h4 className="font-bold text-brand-900 border-b border-brand-100 pb-2 mb-4">
                      العقود والإقرارات الموقعة (Signnow)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedAuditOrder.data.documents || [])
                        .filter((d) => {
                          if (!d) return false;
                          const kind = typeof d === "string" ? "" : d.kind;
                          return (
                            kind === "توقيع إلكتروني" || kind === "عقد signnow"
                          );
                        })
                        .map((docItem, idx) => {
                          if (!docItem) return null;
                          const url =
                            typeof docItem === "string" ? docItem : docItem.url;
                          const title =
                            typeof docItem === "string"
                              ? `عقد موقع #${idx + 1}`
                              : docItem.title || `عقد موقع #${idx + 1}`;
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 bg-brand-50 border border-brand-200 p-4 rounded-xl hover:border-brand-500 transition shadow-sm text-brand-700"
                            >
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-brand-200">
                                <FileText className="w-5 h-5 text-brand-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-brand-900 truncate">
                                  {title}
                                </p>
                                <p className="text-xs text-brand-500 mt-1">
                                  توقيع إلكتروني معتمد
                                </p>
                              </div>
                            </a>
                          );
                        })}
                    </div>
                  </div>
                )}
            </div>

            <div className="p-4 border-t border-brand-100 bg-brand-50 flex justify-end">
              <button
                onClick={() => setSelectedAuditOrder(null)}
                className="px-6 py-2 bg-white border border-brand-200 text-brand-900 font-bold rounded-lg hover:bg-brand-100 transition shadow-sm"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
              <h3 className="font-bold text-brand-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                تفاصيل الطلب:{" "}
                <span className="uppercase">
                  #{selectedOrder.orderNumber || selectedOrder.id.toUpperCase()}
                </span>
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-white rounded-full p-1 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-sm text-brand-800">
              <div className="grid grid-cols-2 gap-6 mb-8 bg-brand-50 p-4 rounded-xl border border-brand-100">
                <div>
                  <p className="text-brand-500 text-xs mb-1">العميل</p>
                  <p className="font-bold text-brand-900">
                    {selectedOrder.data.firstName} بن{" "}
                    {selectedOrder.data.fatherName} ({" "}
                    {selectedOrder.data.familyName} )
                  </p>
                </div>
                <div>
                  <p className="text-brand-500 text-xs mb-1">تاريخ الطلب</p>
                  <p className="font-bold font-mono text-brand-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "ar-SA",
                    )}
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2">
                تفاصيل وبيانات العائلة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-brand-100 rounded-xl">
                  <strong className="text-brand-600 block mb-1">
                    اسم الجد الأول:
                  </strong>{" "}
                  {selectedOrder.data.grandfatherName}
                </div>
                <div className="bg-white p-4 border border-brand-100 rounded-xl">
                  <strong className="text-brand-600 block mb-1">
                    اسم القبيلة/العائلة:
                  </strong>{" "}
                  {selectedOrder.data.tribeName || "غير متوفر"}
                </div>
                <div className="bg-white p-4 border border-brand-100 rounded-xl">
                  <strong className="text-brand-600 block mb-1">
                    الموطن أو المنشأ:
                  </strong>{" "}
                  {selectedOrder.data.country} - {selectedOrder.data.homeland}
                </div>
                {currentTab === "orders" && (
                  <>
                    <div className="bg-white p-4 border border-brand-100 rounded-xl">
                      <strong className="text-brand-600 block mb-1">
                        رقم هاتف العميل:
                      </strong>{" "}
                      <span dir="ltr">
                        {selectedOrder.data.mobileNumber || "غير متوفر"}
                      </span>
                    </div>
                    {selectedOrder.data.shippingAddress && (
                      <div className="bg-white p-4 border border-brand-100 rounded-xl md:col-span-2">
                        <strong className="text-brand-600 block mb-1">
                          عنوان الشحن:
                        </strong>
                        {selectedOrder.data.shippingAddress.country}،{" "}
                        {selectedOrder.data.shippingAddress.state}،{" "}
                        {selectedOrder.data.shippingAddress.street} (الرمز البريدي:{" "}
                        {selectedOrder.data.shippingAddress.zip})
                      </div>
                    )}
                  </>
                )}
                {(selectedOrder.data.startingPoint ||
                  selectedOrder.data.startingPointType) && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl md:col-span-2">
                    <strong className="text-brand-600 block mb-1">
                      نقطة الانطلاق لعمود النسب:
                    </strong>
                    <p className="mt-1 font-medium">
                      {selectedOrder.data.startingPointType === "أنا أمين السجل"
                        ? `${selectedOrder.data.firstName} بن ${selectedOrder.data.fatherName}`
                        : selectedOrder.data.startingPointType === "اسم العائلة"
                          ? `( ${selectedOrder.data.familyName} )`
                          : selectedOrder.data.startingPointType ===
                              "احد الأسلاف"
                            ? selectedOrder.data.startingPointName
                            : selectedOrder.data.startingPoint}
                    </p>
                  </div>
                )}
                {selectedOrder.data.designTemplate && currentTab !== "research" && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl md:col-span-2">
                    <strong className="text-brand-600 block mb-1">
                      القالب المختار:
                    </strong>{" "}
                    <p className="mt-1 font-medium">
                      {selectedOrder.data.designTemplate}
                    </p>
                  </div>
                )}
                {[
                  { key: "managerWord", label: "كلمة أمين السجل" },
                  { key: "historicalNotes", label: "نبذة عن العائلة" },
                  { key: "placesAssociated", label: "أماكن ارتبطت بالعائلة" },
                  { key: "familyNames", label: "أعلام الأسرة وألقابها" },
                  { key: "familyPersonalities", label: "شخصيات ورموز العائلة" },
                  { key: "professions", label: "المهن والأعمال والإرث المهني" },
                  { key: "familyMemory", label: "ذاكرة العائلة والإرث الاجتماعي" },
                ].map(({ key, label }) => {
                  const val = (selectedOrder.data as any)[key];
                  if (!val) return null;
                  const isClosed = selectedOrder.data.sectionStatuses?.[key] === "closed";
                  return (
                    <div key={key} className={`border p-4 rounded-xl md:col-span-2 ${isClosed ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-brand-100"}`}>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <strong className="text-brand-700">{label}:</strong>
                        {isClosed ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> نسخة نهائية (مُغلقة)
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                            مسودة مُعلقة (قابلة للتعديل من العميل)
                          </span>
                        )}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-brand-900 leading-relaxed">
                        {val}
                      </p>
                    </div>
                  );
                })}
                {selectedOrder.contractSigned && selectedOrder.data.contractUrl && selectedOrder.data.contractUrl.startsWith('data:image') && (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl md:col-span-2">
                    <strong className="text-blue-800 block mb-2 flex items-center gap-2">
                      التوقيع الإلكتروني المعتمد:
                    </strong>
                    <div className="bg-white p-2 border border-blue-200 rounded-lg inline-block">
                       <img src={selectedOrder.data.contractUrl} alt="Signature" className="h-24 object-contain mix-blend-multiply" />
                    </div>
                    <p className="text-xs text-blue-600 mt-2 font-mono" dir="ltr">Time: {selectedOrder.contractSignedAt ? new Date(selectedOrder.contractSignedAt).toLocaleString() : 'N/A'}</p>
                  </div>
                )}
              </div>

              {selectedOrder.data.timelineEvents && selectedOrder.data.timelineEvents.length > 0 && (
                <>
                  <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">
                    التسلسل الزمني للعائلة
                  </h4>
                  <div className="bg-white rounded-xl border border-brand-200 p-6 mb-6">
                    <div className="space-y-4">
                      {(selectedOrder.data.timelineEvents || []).map((evt, idx) => (
                        <div key={idx} className="flex gap-4 p-4 border border-brand-100 rounded-lg bg-brand-50/50">
                          <div className="w-24 shrink-0 text-center">
                            <div className="bg-brand-100 text-brand-800 font-bold py-1 px-2 rounded-lg text-sm mb-1">{evt.date}</div>
                            {evt.dateAccuracy && (
                              <span className="text-[10px] text-brand-500 whitespace-nowrap">
                                {evt.dateAccuracy === "confirmed" && "مؤكد"}
                                {evt.dateAccuracy === "approximate" && "تقريبي"}
                                {evt.dateAccuracy === "inherited" && "متوارث"}
                                {evt.dateAccuracy === "unknown" && "غير محدد"}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-brand-900 mb-1">{evt.title}</h5>
                            <p className="text-sm text-brand-700 leading-relaxed mb-2">{evt.description}</p>
                            {(evt.associatedPeople?.length || evt.location || evt.source || evt.type) && (
                              <div className="flex flex-wrap gap-3 text-xs text-brand-500 bg-white p-2 border border-brand-100 rounded">
                                {evt.type && <span>النوع: {evt.type}</span>}
                                {evt.location && <span>المكان: {evt.location}</span>}
                                {evt.source && <span>المصدر: {evt.source}</span>}
                                {evt.associatedPeople && evt.associatedPeople.length > 0 && (
                                  <span>ارتباط: {evt.associatedPeople.join("، ")}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedOrder.data.treeData && (
                <>
                  <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">
                    مخطط شجرة العائلة المرفق
                  </h4>
                  <div className="rounded-xl border border-brand-200 overflow-hidden bg-brand-50 mb-6">
                    <TreeBuilder
                      initialNodes={selectedOrder.data.treeData.nodes || []}
                      initialEdges={selectedOrder.data.treeData.edges || []}
                      readOnly={true}
                      onChange={() => {}}
                    />
                  </div>
                </>
              )}

              {activeTab === "orders" && selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <>
                  <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-600" /> الجدول
                    الزمني للطلب (سجل حركات الطلب)
                  </h4>
                  <div className="bg-white rounded-xl border border-brand-200 p-6 mb-6">
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-200 before:to-transparent">
                      {[...(selectedOrder.timeline || [])]
                        .sort(
                          (a, b) =>
                            new Date(a.timestamp).getTime() -
                            new Date(b.timestamp).getTime(),
                        )
                        .map((event, idx) => (
                          <div
                            key={event.id}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-brand-100 text-brand-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              {idx + 1}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-brand-100 bg-brand-50 shadow-sm text-right">
                              <div className="flex flex-col mb-2">
                                <p className="font-bold text-brand-900 leading-relaxed mb-2 text-sm">{event.message}</p>
                                <span className="text-[10px] text-brand-500 font-mono bg-white px-2 py-1 rounded-md border border-brand-100 self-start" dir="ltr">
                                  {new Intl.DateTimeFormat("ar-SA", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(new Date(event.timestamp))}
                                </span>
                              </div>
                              {event.userName && (
                                <div className="mt-3 pt-3 border-t border-brand-100/50 flex items-center justify-end">
                                  <div className="flex items-center gap-2 bg-gradient-to-r from-brand-50 to-white px-3 py-1.5 rounded-full border border-brand-200 shadow-sm hover:shadow-md transition">
                                    <div className="bg-brand-600 text-white rounded-full p-1">
                                      <User className="w-3 h-3" />
                                    </div>
                                    <span className="text-xs font-bold text-brand-900">
                                      {event.userName}
                                    </span>
                                    <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-md font-medium">
                                      {roleNames[event.role || ""] || event.role}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {selectedOrder.data.documents &&
                selectedOrder.data.documents.length > 0 && (
                  <>
                    <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">
                      الوثائق والمرفقات
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedOrder.data.documents || []).map((docItem, idx) => {
                        if (!docItem) return null;
                        const isStr = typeof docItem === "string";
                        const url = isStr ? docItem : docItem.url;
                        const title =
                          !isStr && docItem.title
                            ? docItem.title
                            : `مرفق وثيقة #${idx + 1}`;
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col gap-2 bg-white border border-brand-200 p-4 rounded-xl hover:border-brand-500 transition shadow-sm text-brand-700"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <FileText className="w-6 h-6 text-brand-500 shrink-0" />
                              <div className="overflow-hidden w-full">
                                <p className="font-bold text-sm text-brand-900 line-clamp-1">
                                  {title}
                                </p>
                                {!isStr && (
                                  <p className="text-xs text-brand-600 mt-1 line-clamp-1">
                                    {docItem.purpose}
                                  </p>
                                )}
                              </div>
                            </div>
                            {!isStr &&
                              (docItem.kind || docItem.description) && (
                                <div className="mt-2 text-xs text-brand-800 bg-brand-50 p-2 rounded-lg border border-brand-100">
                                  {docItem.kind && (
                                    <p>
                                      <span className="font-bold">النوع:</span>{" "}
                                      {docItem.kind}
                                    </p>
                                  )}
                                  {docItem.description && (
                                    <p className="mt-1 whitespace-pre-line">
                                      <span className="font-bold">الوصف:</span>{" "}
                                      {docItem.description}
                                    </p>
                                  )}
                                </div>
                              )}
                          </a>
                        );
                      })}
                    </div>
                  </>
                )}
              {selectedOrder.data.photos &&
                selectedOrder.data.photos.length > 0 && (
                  <>
                    <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">
                      الصور المرفقة
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {(selectedOrder.data.photos || []).map((photoItem, idx) => {
                        if (!photoItem) return null;
                        const isStr = typeof photoItem === "string";
                        const url = isStr ? photoItem : photoItem.url;
                        const title =
                          !isStr && photoItem.title
                            ? photoItem.title
                            : `صورة ${idx + 1}`;
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="relative group flex flex-col rounded-xl overflow-hidden border border-brand-200 hover:border-brand-500 transition shadow-sm bg-white"
                          >
                            <div className="aspect-square relative w-full">
                              <img
                                src={url}
                                alt={title}
                                className="w-full h-full object-cover bg-gray-100 absolute inset-0"
                                loading="lazy"
                              />
                            </div>
                            {!isStr && (
                              <div className="p-3 bg-white text-right border-t border-brand-100">
                                <p className="text-sm font-bold text-brand-900 mb-1 line-clamp-1">
                                  {title}
                                </p>
                                <div className="text-xs text-brand-600 space-y-1">
                                  {photoItem.purpose && (
                                    <p>
                                      <span className="font-semibold">
                                        الغرض:
                                      </span>{" "}
                                      {photoItem.purpose}
                                    </p>
                                  )}
                                  {photoItem.description && (
                                    <p>
                                      <span className="font-semibold">
                                        الوصف:
                                      </span>{" "}
                                      {photoItem.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </>
                )}
            </div>
            <div className="p-4 border-t border-brand-100 bg-brand-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 rounded-md font-bold bg-brand-600 text-white hover:bg-brand-700 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      {messagingOrder && (
        (() => {
          const currentMessagingOrder = orders.find(o => o.id === messagingOrder.id) || messagingOrder;
          return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
              <h3 className="font-bold text-brand-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                مراسلة وتوجيهات للعميل: {currentMessagingOrder.data.firstName}
              </h3>
              <button
                onClick={() => setMessagingOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-white rounded-full p-1 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 max-h-80">
              {!currentMessagingOrder.messages ||
              currentMessagingOrder.messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-4">
                  ابداً المحادثة مع العميل الآن.
                </div>
              ) : (
                currentMessagingOrder.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.senderRole === "admin" ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${msg.senderRole === "admin" ? "bg-brand-600 text-white rounded-tr-none" : "bg-white border border-brand-200 text-brand-900 rounded-tl-none shadow-sm"}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.attachments.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className={`text-xs px-3 py-1 rounded bg-black/10 hover:bg-black/20 transition flex items-center gap-1 ${msg.senderRole === "admin" ? "text-white" : "text-brand-700"}`}
                            >
                              <FileText className="w-3 h-3" /> مرفق العميل{" "}
                              {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {msg.senderRole === "admin" ? "الباحث" : "العميل"} •{" "}
                      {new Intl.DateTimeFormat("ar-SA", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(msg.createdAt))}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t border-brand-100 flex flex-col gap-3">
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب توجيهك أو الرد على استفسار العميل هنا... (سيتم تغيير حالة الطلب تلقائياً إلى 'طلب إيضاح')"
                className="w-full border border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 p-3 bg-brand-50 text-sm"
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMessagingOrder(null)}
                  className="px-4 py-2 rounded-md font-medium text-brand-600 hover:bg-brand-100 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendReply}
                  className="px-6 py-2 rounded-md font-bold bg-brand-600 text-white hover:bg-brand-700 transition"
                >
                  إرسال التوجيه
                </button>
              </div>
            </div>
          </div>
        </div>
        );
        })()
      )}

      {/* Delivery Modal */}
      {deliveryOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right py-6 px-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-brand-900 flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-brand-600" />
                إتمام وتسليم الطلب
              </h3>
              <button
                onClick={() => setDeliveryOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-brand-700 mb-6 text-sm">
              {deliveryTab === "draft" 
                ? "برجاء إدخال رابط العرض الإلكتروني للنسخة الأولية (مثال: رابط fliphtml5.com). سيتم تغيير حالة الطلب وتسليمه للعميل مباشرة للإعتماد."
                : "برجاء إدخال رابط الوثيقة النهائية (مثال: رابط Google Drive، أو رابط Dropbox، أو رابط مباشر للملف). سيتم تغيير حالة الطلب وتسليمه للعميل مباشرة."}
            </p>

            <div className="flex bg-brand-100 rounded-lg p-1 mb-6 text-center">
              <div className="flex-1 py-2 text-sm font-bold rounded-md transition bg-white text-brand-900 shadow-sm">
                {deliveryTab === "draft" ? "تسليم النسخة الأولية للإعتماد" : "التسليم النهائي للسجل"}
              </div>
            </div>

            
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div>
                <label className="block font-semibold text-brand-900 mb-2">
                  {deliveryTab === "draft" ? "رابط عرض النسخة الأولية للتصفح (Flipbook)" : "رابط النسخة الرقمية للسجل للتصفح"}
                </label>
                <input
                  type="url"
                  value={digitalCopyLink}
                  onChange={(e) => {
                    setDigitalCopyLink(e.target.value);
                    setDeliveryLink(e.target.value);
                  }}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              {deliveryTab !== "draft" && (
                <>
                  <div className="flex flex-col gap-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="font-bold text-lg text-brand-900 border-b border-brand-200 pb-2">بيانات الشحنة (تظهر للعميل بعد التسليم)</div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-900 mb-2">تاريخ الشحن</label>
                      <input
                        type="date"
                        value={shippingDate}
                        onChange={(e) => setShippingDate(e.target.value)}
                        className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-900 mb-2">إسم الناقل</label>
                      <input
                        type="text"
                        value={carrierName}
                        onChange={(e) => setCarrierName(e.target.value)}
                        placeholder="أدخل اسم شركة الشحن..."
                        className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-900 mb-2">رقم الشحنة للتتبع</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="أدخل رقم التتبع..."
                        className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-900 mb-2 mt-4">
                       رابط النسخة الرقمية للسجل للتحميل
                    </label>
                    <input
                      type="url"
                      value={digitalCopyDownloadLink}
                      onChange={(e) => setDigitalCopyDownloadLink(e.target.value)}
                      placeholder="https://..."
                      dir="ltr"
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-2">
                      رابط بوستر المشجرة
                    </label>
                    <input
                      type="url"
                      value={posterLink}
                      onChange={(e) => setPosterLink(e.target.value)}
                      placeholder="https://..."
                      dir="ltr"
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-brand-900 mb-2 mt-4">
                      التوصيات واقتراحات فريق البحث
                    </label>
                    <textarea
                      value={researchRecommendations}
                      onChange={(e) => setResearchRecommendations(e.target.value)}
                      placeholder="أكتب التوصيات..."
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                    />
                  </div>
                </>
              )}
              
              <button
                onClick={handleFulfillOrder}
                disabled={isFulfilling || !digitalCopyLink.trim()}
                className="w-full py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isFulfilling ? (
                  "جاري التسليم..."
                ) : (
                  <>
                    <Send className="w-5 h-5" /> تأكيد التسليم وإرسال البريد
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Delivery Modal */}
      {researchDeliveryOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right py-6 px-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                <Upload className="w-6 h-6 text-emerald-600" />
                {researchDeliveryTab === "draft" ? "تسليم المسودة لإدارة التصميم" : "تسليم السجل بعد التصويب"}
              </h3>
              <button
                onClick={() => setResearchDeliveryOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط المستند</label>
                <input
                  type="url"
                  value={researchDocumentLink}
                  onChange={(e) => setResearchDocumentLink(e.target.value)}
                  placeholder="أدخل رابط المستند هنا (Google Drive, DropBox, الخ)"
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <button
                onClick={handleResearchDelivery}
                disabled={isFulfilling || !researchDocumentLink.trim()}
                className="w-full py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-2 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isFulfilling ? (
                  "جاري التسليم..."
                ) : (
                  <>
                    <Send className="w-5 h-5" /> تأكيد التسليم لإدارة التصميم
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDesignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="p-8 text-center relative z-10">
              <div className="w-20 h-20 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Palette className="w-10 h-10 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold text-brand-900 mb-2 font-serif">قالب التصميم المختار</h3>
              <p className="text-brand-600 mb-8 font-medium">الرجاء اعتماد هذا التصميم للعمل عليه</p>
              
              <div className="bg-gradient-to-tr from-brand-50 to-white border ${showDesignModal.toLowerCase().includes('فضي') ? 'border-gray-300' : showDesignModal.toLowerCase().includes('ذهب') ? 'border-yellow-400' : 'border-brand-200'} rounded-2xl p-6 mb-8 transform transition-transform hover:scale-105 shadow-md">
                <div className="text-3xl font-bold text-brand-800 leading-relaxed font-serif pb-2 border-b border-brand-100 mb-4">{showDesignModal}</div>
                <div className="text-sm text-brand-600 font-medium whitespace-pre-wrap leading-relaxed">بناءً على طلب العميل، هذا هو الخيار الذي تم الاستقرار عليه لتجهيز السجل.</div>
              </div>
              
              <button
                onClick={() => setShowDesignModal(null)}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg text-lg"
              >
                حسناً، إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Initial Design Modal */}
      {paymentRequestOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right py-6 px-8 relative">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-[#C3262A]" />
                إرسال مطالبة تحصيل الدفعة
              </h3>
              <button
                onClick={() => setPaymentRequestOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100">
                <p className="font-bold text-brand-900 mb-2 border-b border-brand-100 pb-2">تفاصيل المطالبة (رسالة البريد الإلكتروني):</p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {(() => {
                    const isPhase2 = paymentRequestOrder.actionPhase === "مرحلة التوثيق" || paymentRequestOrder.actionPhase === "تم التوثيق";
                    const amount = isPhase2 ? "693" : "594";
                    const phaseName = isPhase2 ? "تم التوثيق" : "التصميم الإلكتروني";
                    const paymentLink = isPhase2 
                      ? "https://buy.stripe.com/fZubJ2dnje0hf6GbFH8so02" 
                      : "https://buy.stripe.com/28E14o6YV2hz3nY9xz8so01";
                    
                    const name = paymentRequestOrder.data.firstName ? `${paymentRequestOrder.data.firstName} ${paymentRequestOrder.data.fatherName}` : "عميلنا الكريم";
                    
                    return `أهلاً بك ${name}،\n\nنهديكم أطيب التحيات من منصة سجل تراث العائلة.\nيُسعدنا إبلاغكم بأننا قد أنجزنا بنجاح خطوات مهمة في إعداد سجل عائلتكم العريق، حيث وصل الطلب الآن إلى ${phaseName}.\n\nوفقاً لنظام "الدفع المرن" المختار، فقد استُحقت الآن الدفعة التالية وقدرها (${amount} دولار).\nنرجو منكم التكرم بإتمام عملية السداد لضمان استمرار سير العمل بسلاسة انتقالاً للمرحلة القادمة.\n\nرابط إتمام الدفع (آمن ومباشر):\n${paymentLink}\n\nنشكر لكم ثقتكم وحرصكم الدائم، ونسعد دوماً بخدمتكم وتدوين إرث عائلتكم الممتد.\n\nمع خالص التحيات،\nفريق سجل تراث العائلة`;
                  })()}
                </div>
              </div>
              
              <button
                onClick={async () => {
                  const isPhase2 = paymentRequestOrder.actionPhase === "مرحلة التوثيق" || paymentRequestOrder.actionPhase === "تم التوثيق";
                  const amount = isPhase2 ? "693" : "594";
                  const phaseName = isPhase2 ? "تم التوثيق" : "التصميم الإلكتروني";
                  const paymentLink = isPhase2 
                    ? "https://buy.stripe.com/fZubJ2dnje0hf6GbFH8so02" 
                    : "https://buy.stripe.com/28E14o6YV2hz3nY9xz8so01";
                  const name = paymentRequestOrder.data.firstName ? `${paymentRequestOrder.data.firstName} ${paymentRequestOrder.data.fatherName}` : "عميلنا الكريم";
                  const emailBody = `أهلاً بك ${name}،\n\nنهديكم أطيب التحيات من منصة سجل تراث العائلة.\nيُسعدنا إبلاغكم بأننا قد أنجزنا بنجاح خطوات مهمة في إعداد سجل عائلتكم العريق، حيث وصل الطلب الآن إلى ${phaseName}.\n\nوفقاً لنظام "الدفع المرن" المختار، فقد استُحقت الآن الدفعة التالية وقدرها (${amount} دولار).\nنرجو منكم التكرم بإتمام عملية السداد لضمان استمرار سير العمل بسلاسة انتقالاً للمرحلة القادمة.\n\nرابط إتمام الدفع (آمن ومباشر):\n${paymentLink}\n\nنشكر لكم ثقتكم وحرصكم الدائم، ونسعد دوماً بخدمتكم وتدوين إرث عائلتكم الممتد.\n\nمع خالص التحيات،\nفريق سجل تراث العائلة`;
                  
                  // Use window.open with mailto as fallback, or our email service if extended
                  const toEmail = usersList.find((u) => u.id === paymentRequestOrder.userId)?.email || paymentRequestOrder.data.contactEmail;
                  const subject = encodeURIComponent(`مطالبة سداد مستحقة - ${phaseName} - منصة سجل تراث العائلة`);
                  const body = encodeURIComponent(emailBody);
                  window.open(`mailto:${toEmail}?subject=${subject}&body=${body}`, '_blank');
                  
                  // Optimistically update timeline
                  useAppStore.getState().logTimelineEvent(
                    paymentRequestOrder.id,
                    `تم إرسال مطالبة تحصيل الدفعة (${amount} دولار) للعميل بنجاح.`
                  );
                  alert("تم تجهيز الايميل وتسجيل الإجراء في حركات الطلب!");
                  setPaymentRequestOrder(null);
                }}
                className="w-full py-4 rounded-xl font-bold bg-[#C3262A] text-white hover:bg-[#a61c20] transition flex items-center justify-center gap-2 mt-4 shadow-md text-lg"
              >
                <Send className="w-5 h-5" /> إرسال المطالبة للعميل عبر الإيميل
              </button>
            </div>
          </div>
        </div>
      )}

      {shippingContactOrder && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right py-8 px-10 relative print:shadow-none print:w-full print:max-w-full print:h-auto print:overflow-visible print:block">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 print:hidden"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10 print:hidden">
              <h3 className="font-bold text-2xl text-brand-900 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-indigo-600" />
                بيانات التوصيل والطباعة
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="text-brand-600 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition shadow-sm"
                  title="طباعة"
                >
                  <MapPin className="w-5 h-5 hidden" />
                  <span className="font-bold px-2 py-1 text-sm">طباعة البطاقة</span>
                </button>
                <button
                  onClick={() => setShippingContactOrder(null)}
                  className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-4 relative z-10 print:overflow-visible">
              
              <div className="bg-gradient-to-br from-indigo-50 to-brand-50 p-6 rounded-2xl border border-indigo-100 shadow-sm print:border-none print:shadow-none">
                <h4 className="text-lg font-bold text-indigo-900 mb-4 border-b border-indigo-200 pb-2">بيانات العميل للإتصال</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-bold text-indigo-500 mb-1">اسم المستلم</span>
                    <p className="font-bold text-brand-900 text-lg">{shippingContactOrder.data.firstName} {shippingContactOrder.data.fatherName} {shippingContactOrder.data.familyName}</p>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-indigo-500 mb-1">رقم الجوال</span>
                    <p className="font-bold text-brand-900 text-lg dir-ltr text-right">{shippingContactOrder.data.mobileNumber || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-xs font-bold text-indigo-500 mb-1">البريد الإلكتروني</span>
                    <p className="font-bold text-brand-900">{shippingContactOrder.data.email || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-sm print:border-none print:shadow-none">
                <h4 className="text-lg font-bold text-emerald-900 mb-4 border-b border-emerald-200 pb-2">عنوان التوصيل المعتمد</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-bold text-emerald-500 mb-1">الدولة</span>
                    <p className="font-bold text-brand-900 text-lg">{shippingContactOrder.data.shippingAddress?.country || '—'}</p>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-500 mb-1">المدينة / المحافظة</span>
                    <p className="font-bold text-brand-900 text-lg">{shippingContactOrder.data.shippingAddress?.state || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-xs font-bold text-emerald-500 mb-1">الشارع / العنوان بالتفصيل</span>
                    <p className="font-bold text-brand-900">{shippingContactOrder.data.shippingAddress?.street || '—'}</p>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-500 mb-1">الرمز البريدي</span>
                    <p className="font-bold text-brand-900">{shippingContactOrder.data.shippingAddress?.zip || '—'}</p>
                  </div>
                </div>
              </div>

              {(shippingContactOrder.printReadyLink || printReadyLink) && (
                <div className="hidden print:block bg-gray-50 p-6 border border-gray-200 text-left dir-ltr mt-6 break-inside-avoid">
                  <span className="block text-xs font-bold text-gray-500 mb-1 dir-rtl text-right">رابط تحميل السجل الأساسي (مُجهز للطباعة)</span>
                  <a href={shippingContactOrder.printReadyLink || printReadyLink} className="text-blue-600 font-mono text-sm underline break-all">{shippingContactOrder.printReadyLink || printReadyLink}</a>
                </div>
              )}

              <div className="print:hidden bg-white p-6 rounded-2xl border border-gray-200">
                <label className="block font-bold text-brand-900 mb-2">رابط تحميل السجل (مُجهز للطباعة)</label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={printReadyLink}
                    onChange={(e) => setPrintReadyLink(e.target.value)}
                    placeholder="أدخل رابط السجل هنا..."
                    className="flex-1 border border-brand-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none"
                  />
                  <button
                    onClick={async () => {
                      if(!printReadyLink.trim()) return;
                      setIsFulfilling(true);
                      try {
                        const { updateDoc, doc } = await import("firebase/firestore");
                        const { db } = await import("@/lib/firebase");
                        await updateDoc(doc(db, "orders", shippingContactOrder.id), {
                          printReadyLink: printReadyLink
                        });
                        useAppStore.setState((s) => ({
                          orders: s.orders.map((o) =>
                            o.id === shippingContactOrder.id ? { ...o, printReadyLink } : o
                          ),
                        }));
                        alert("تم حفظ رابط الطباعة بنجاح");
                      } catch(e) {
                        console.error(e);
                      } finally {
                        setIsFulfilling(false);
                      }
                    }}
                    disabled={isFulfilling || !printReadyLink.trim()}
                    className="px-6 py-3 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 transition disabled:bg-gray-300 shadow-sm"
                  >
                    {isFulfilling ? "جاري الحفظ" : "حفظ الرابط"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Initial Design Modal */}
      {initialDesignSubmitOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right py-6 px-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                <Upload className="w-6 h-6 text-emerald-600" />
                تسليم السجل الأولي لإدارة الطلبات
              </h3>
              <button
                onClick={() => setInitialDesignSubmitOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط السجل الأولي</label>
                <input
                  type="url"
                  value={initialDesignLink}
                  onChange={(e) => setInitialDesignLink(e.target.value)}
                  placeholder="أدخل رابط السجل هنا..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <button
                onClick={handleInitialDesignSubmit}
                disabled={isFulfilling || !initialDesignLink.trim()}
                className="w-full py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-2 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isFulfilling ? (
                  "جاري التأكيد..."
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> تأكيد جاهزية السجل الأولي
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Design Submit Modal */}
      {designSubmitOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right py-6 px-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                تسليم السجل جاهز للتسليم النهائي
              </h3>
              <button
                onClick={() => setDesignSubmitOrder(null)}
                className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط النسخة الرقمية للسجل للتصفح</label>
                <input
                  type="url"
                  value={designRecordLink}
                  onChange={(e) => setDesignRecordLink(e.target.value)}
                  placeholder="أدخل رابط التصفح هنا..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط النسخة الرقمية للسجل للتحميل</label>
                <input
                  type="url"
                  value={designDownloadLink}
                  onChange={(e) => setDesignDownloadLink(e.target.value)}
                  placeholder="أدخل رابط التحميل هنا..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط بوستر المشجرة للتحميل</label>
                <input
                  type="url"
                  value={designTreeLink}
                  onChange={(e) => setDesignTreeLink(e.target.value)}
                  placeholder="أدخل رابط المشجرة هنا..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="flex flex-col gap-4 mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200 text-right">
                <div className="font-bold text-lg text-brand-900 border-b border-brand-200 pb-2">بيانات الشحنة</div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-2">تاريخ الشحن</label>
                  <input type="date" value={shippingDate} onChange={(e) => setShippingDate(e.target.value)} className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-2">إسم الناقل</label>
                  <input type="text" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} placeholder="أدخل اسم شركة الشحن..." className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-2">رقم الشحنة للتتبع</label>
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="أدخل رقم التتبع..." className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
              </div>

              <button
                onClick={handleDesignSubmit}
                disabled={isFulfilling || !designRecordLink.trim()}
                className="w-full py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-2 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isFulfilling ? (
                  "جاري التأكيد..."
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> تأكيد جاهزية السجل
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold font-serif text-brand-900">
                {editingArticle
                  ? "تعديل الموضوع"
                  : "إضافة موضوع جديد (مقال/فيديو)"}
              </h2>
              <button
                onClick={() => {
                  setIsArticleModalOpen(false);
                  setEditingArticle(null);
                  setArticleForm({
                    title: "",
                    type: "مقال",
                    section: "الروايات والذاكرة",
                    filter: "عام",
                  });
                }}
                className="p-2 hover:bg-brand-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    نوع المادة
                  </label>
                  <select
                    className="w-full p-3 border border-brand-200 rounded-lg bg-gray-50"
                    value={articleForm.type}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        type: e.target.value as "مقال" | "فيديو",
                      })
                    }
                  >
                    <option value="مقال">مقال</option>
                    <option value="فيديو">مقطع فيديو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    القسم
                  </label>
                  <select
                    className="w-full p-3 border border-brand-200 rounded-lg bg-gray-50"
                    value={articleForm.section}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        section: e.target.value,
                      })
                    }
                  >
                    <option value="الروايات والذاكرة">الروايات والذاكرة</option>
                    <option value="قراءات ومراجع">قراءات ومراجع</option>
                    <option value="عالَم الأنساب">عالَم الأنساب</option>
                    <option value="الأخبار والفعاليات">
                      الأخبار والفعاليات
                    </option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    الفرع / التصفية (كتابة حرة لإنشاء قسم جديد أو اختيار موجود)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.filter}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, filter: e.target.value })
                    }
                    placeholder="مثال: عام، السعودية، اليمن، الحمض النووي..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    العنوان الرئيسي
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, title: e.target.value })
                    }
                    placeholder={
                      articleForm.type === "فيديو"
                        ? "عنوان الفيديو..."
                        : "عنوان المقال..."
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    نص وصفي حول المادة (اختياري)
                  </label>
                  <textarea
                    className="w-full p-3 border border-brand-200 rounded-lg min-h-[80px]"
                    value={articleForm.description || ""}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="وصف مختصر للمادة..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    عنوان الصورة/الفيديو (يعرض كنص فوق الصورة الرئيسية المصغرة)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.coverTextOverlay || ""}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        coverTextOverlay: e.target.value,
                      })
                    }
                    placeholder="مثال: رحلة البحث في المخطوطات..."
                  />
                </div>
              </div>

              <div className="border-t border-brand-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    {articleForm.type === "فيديو" ? "اسم المنتج" : "اسم الكاتب"}{" "}
                    (اختياري)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.author || ""}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, author: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    المحرر (اختياري)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.editor || ""}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, editor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    تاريخ النشر (اختياري)
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.publishDate || ""}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        publishDate: e.target.value,
                      })
                    }
                  />
                </div>

                {articleForm.type === "فيديو" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-brand-900 mb-2">
                        رابط الفيديو (اختياري)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        className="w-full p-3 border border-brand-200 rounded-lg text-left"
                        value={articleForm.videoUrl || ""}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            videoUrl: e.target.value,
                          })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-900 mb-2">
                        مدة المقطع (اختياري)
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-brand-200 rounded-lg"
                        value={articleForm.duration || ""}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            duration: e.target.value,
                          })
                        }
                        placeholder="مثال: 05:30"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* ALWAYS SHOW RICH TEXT EDITOR, EVEN FOR VIDEOS IF THEY WANT IT */}
              <div className="border-t border-brand-100 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-brand-900">
                    نص المقال/وصف الفيديو (اخيتاري - محرر نصي يدعم جميع المزايا)
                  </label>
                  <div className="flex flex-wrap gap-1 text-xs bottom-toolbar bg-brand-50 p-1 rounded-md border border-brand-200">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => document.execCommand("bold")}
                      className="px-2 py-1 hover:bg-brand-200 rounded font-bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => document.execCommand("italic")}
                      className="px-2 py-1 hover:bg-brand-200 rounded italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => document.execCommand("underline")}
                      className="px-2 py-1 hover:bg-brand-200 rounded underline"
                    >
                      U
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        document.execCommand("fontSize", false, "5")
                      }
                      className="px-2 py-1 hover:bg-brand-200 rounded"
                    >
                      تكبير
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        document.execCommand("fontSize", false, "3")
                      }
                      className="px-2 py-1 hover:bg-brand-200 rounded"
                    >
                      تصغير
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        document.execCommand("insertUnorderedList")
                      }
                      className="px-2 py-1 hover:bg-brand-200 rounded"
                    >
                      • نقاط
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => document.execCommand("justifyRight")}
                      className="px-2 py-1 hover:bg-brand-200 rounded"
                    >
                      يمين
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => document.execCommand("justifyCenter")}
                      className="px-2 py-1 hover:bg-brand-200 rounded"
                    >
                      وسط
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => document.execCommand("justifyLeft")}
                      className="px-2 py-1 hover:bg-brand-200 rounded"
                    >
                      يسار
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => {
                        const selection = window.getSelection();
                        if (!selection || selection.rangeCount === 0) return;
                        const range = selection.getRangeAt(0);
                        const url = prompt("أدخل رابط الصورة:");
                        if (url) {
                          selection.removeAllRanges();
                          selection.addRange(range);
                          document.execCommand("insertImage", false, url);

                          // Try to find the inserted image to style it
                          setTimeout(() => {
                            const editor =
                              document.getElementById("article-editor");
                            if (editor) {
                              const imgs = editor.getElementsByTagName("img");
                              if (imgs.length > 0) {
                                const lastImg = imgs[imgs.length - 1];
                                lastImg.style.maxWidth = "100%";
                                lastImg.style.borderRadius = "8px";
                                lastImg.style.margin = "16px auto";
                                lastImg.style.display = "block";
                              }
                            }
                          }, 50);
                        }
                      }}
                      className="px-2 py-1 hover:bg-brand-200 rounded bg-white border border-brand-200 shadow-sm font-bold text-brand-600"
                    >
                      إدراج صورة
                    </button>
                  </div>
                </div>
                <div
                  id="article-editor"
                  className="w-full p-4 border border-brand-200 rounded-lg min-h-[300px] text-justify leading-loose focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white overflow-y-auto"
                  contentEditable
                  onBlur={(e) =>
                    setArticleForm({
                      ...articleForm,
                      content: e.currentTarget.innerHTML,
                    })
                  }
                  dangerouslySetInnerHTML={{
                    __html: articleForm.content || "",
                  }}
                ></div>
              </div>

              <div className="border-t border-brand-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-brand-900 mb-4 border-r-4 border-brand-500 pr-2">
                    الروابط والصور
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    رابط صورة الغلاف (اختياري)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 p-3 border border-brand-200 rounded-lg text-left dir-ltr"
                      value={articleForm.coverImageUrl || ""}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          coverImageUrl: e.target.value,
                        })
                      }
                    />
                    <label className="bg-brand-100 hover:bg-brand-200 text-brand-700 px-4 py-3 rounded-lg font-bold cursor-pointer transition flex items-center justify-center whitespace-nowrap">
                      {isUploading ? "جاري الرفع..." : "إرفاق صورة"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-brand-500 mt-1">
                    أضف رابط مباشر للصور أو قم بتحميل ملف صورة.
                  </p>
                </div>
                {articleForm.type === "فيديو" && (
                  <div>
                    <label className="block text-sm font-bold text-brand-900 mb-2">
                      رابط الفيديو (يوتيوب أو غيره)
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full p-3 border border-brand-200 rounded-lg text-left dir-ltr"
                      value={articleForm.videoUrl || ""}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          videoUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                {articleForm.type === "فيديو" && (
                  <div>
                    <label className="block text-sm font-bold text-brand-900 mb-2">
                      مدة الفيديو (اختياري - مثلاً 12:30)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-brand-200 rounded-lg text-left dir-ltr"
                      value={articleForm.duration || ""}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-brand-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-brand-900 mb-4 border-r-4 border-brand-500 pr-2">
                    النصوص المصاحبة للصورة/الفيديو
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    إلصق عنوان (الصورة/الفيديو) وهو نص يعرض فوق الصورة (اختياري)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg text-center font-bold"
                    value={articleForm.coverTextOverlay || ""}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        coverTextOverlay: e.target.value,
                      })
                    }
                    placeholder="مثال: رحلة البحث في التراث..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    وصف الصورة/الفيديو المصغر (أسفل الصورة) (اختياري)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.imageCaption || ""}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        imageCaption: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">
                    الملكية الفكرية (اختياري)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.imageCopyright || ""}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        imageCopyright: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-brand-50 rounded-xl p-4 flex gap-4 text-brand-600 text-sm mt-4 border border-brand-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                  الحقول الاختيارية التي لا يتم تعبئتها لن تظهر للمستخدم للحفاظ
                  على جمالية العرض.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveArticle}
                  disabled={!articleForm.title || !articleForm.section}
                  className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50"
                >
                  حفظ المادة المعرفية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Profile Modal */}
      {editingUserProfile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50">
              <h2 className="text-xl font-bold font-serif text-brand-900">
                بيانات المستخدم الخاصة بالإدارة
              </h2>
              <button
                onClick={() => setEditingUserProfile(null)}
                className="p-2 hover:bg-brand-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-900 mb-2">
                  رقم الجوال
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-brand-200 rounded-lg text-left"
                  dir="ltr"
                  value={userProfileForm.mobile}
                  onChange={(e) =>
                    setUserProfileForm({
                      ...userProfileForm,
                      mobile: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-900 mb-2">
                  الدولة
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-brand-200 rounded-lg"
                  value={userProfileForm.country}
                  onChange={(e) =>
                    setUserProfileForm({
                      ...userProfileForm,
                      country: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-900 mb-2">
                  رابط صورة باسبور (اختياري)
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-brand-200 rounded-lg text-left"
                  dir="ltr"
                  value={userProfileForm.passportUrl}
                  onChange={(e) =>
                    setUserProfileForm({
                      ...userProfileForm,
                      passportUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={async () => {
                    try {
                      const { updateDoc, doc } =
                        await import("firebase/firestore");
                      const { db } = await import("@/lib/firebase");
                      await updateDoc(doc(db, "users", editingUserProfile.id), {
                        mobile: userProfileForm.mobile,
                        country: userProfileForm.country,
                        passportUrl: userProfileForm.passportUrl,
                      });
                      alert("تم الحفظ بنجاح");
                      setEditingUserProfile(null);
                    } catch (e) {
                      console.error(e);
                      alert("حدث خطأ أثناء الحفظ");
                    }
                  }}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  حفظ البيانات
                </button>
              </div>
            </div>
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
          <div className="mt-8 pt-8 border-t border-brand-200 text-sm opacity-75">
            <p>© 2026 GeneaLab LLC — جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {successModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden border border-brand-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
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
      
      {/* Assign Success Modal */}
      {assignSuccessModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm flex flex-col items-center justify-center shadow-2xl p-8 transform scale-100 animate-in zoom-in-95 font-sans">
            <div className="w-20 h-20 bg-green-100 text-green-600 mb-6 rounded-full flex items-center justify-center ring-4 ring-green-50 shadow-inner">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 text-center mb-2">نجاح باهر!</h3>
            <p className="text-slate-600 text-center font-medium leading-relaxed">
              تم تعيين الباحث وتحديث حالة الطلب بنجاح.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
