import { doc, getDoc, collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useAppStore, Order, UserInfo } from "@/lib/store";
import { Navigate, Link } from "react-router";
import { Users, FileText, CheckCircle, Search, Edit3, Eye, MessageSquare, X, Home, Link as LinkIcon, Send, AlertCircle, Book, Plus, Trash2 } from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";
import { sendDeliveryEmail } from "@/lib/emailService";
import { KnowledgeArticle } from "./KnowledgeCenter";

export function AdminPanel() {
  const { currentUser, orders, updateOrderStatus, addMessageToOrder, fulfillOrder, markMessagesAsRead } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>("orders");
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState<Partial<KnowledgeArticle>>({ title: "", type: "مقال", section: "الروايات والذاكرة", filter: "عام" });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messagingOrder, setMessagingOrder] = useState<Order | null>(null);
  const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");
  const [digitalCopyLink, setDigitalCopyLink] = useState("");
  const [posterLink, setPosterLink] = useState("");
  const [researchRecommendations, setResearchRecommendations] = useState("");
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [usersList, setUsersList] = useState<UserInfo[]>([]);

  useEffect(() => {
    if (activeTab === "articles") {
      const q = query(collection(db, "knowledge_articles"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: KnowledgeArticle[] = [];
        snapshot.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() } as KnowledgeArticle);
        });
        setArticles(data);
      });
      return () => unsubscribe();
    }
    
    if (activeTab === "users") {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const data: UserInfo[] = [];
        snapshot.forEach(doc => {
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
        Object.entries(articleForm).filter(([_, v]) => v !== undefined)
      );

      if (editingArticle) {
        await updateDoc(doc(db, "knowledge_articles", editingArticle.id), articleDataToSave);
      } else {
        await addDoc(collection(db, "knowledge_articles"), {
          ...articleDataToSave,
          createdAt: new Date().toISOString() // using ISO string for easier usage and consistent fallback
        });
      }
      setIsArticleModalOpen(false);
      setEditingArticle(null);
      setArticleForm({ title: "", type: "مقال", section: "الروايات والذاكرة", filter: "عام" });
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ المقال");
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

  const isStaff = currentUser && ["admin", "maestro", "research", "marketing", "accounting", "compliance", "shipping", "customer_service", "editor"].includes(currentUser.role);
  if (!currentUser || !isStaff) {
    return <Navigate to="/dashboard" />;
  }

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !messagingOrder || !currentUser) return;
    
    addMessageToOrder(messagingOrder.id, {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "admin",
      text: replyText,
      createdAt: new Date().toISOString()
    }, "طلب إيضاح");

    // Array destruction to get the value for sure
    const userDocRef = doc(db, "users", messagingOrder.userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserInfo;
      if (userData.email) {
        const { sendClarificationRequestEmail } = await import("@/lib/emailService");
        await sendClarificationRequestEmail(userData.email, userData.name || "العميل الكريم", messagingOrder.id, replyText);
      }
    }

    setReplyText("");
    setMessagingOrder(null);
  };

  const handleFulfillOrder = async () => {
    if (!deliveryLink.trim() || !deliveryOrder) return;
    setIsFulfilling(true);
    try {
      await fulfillOrder(deliveryOrder.id, {
        deliveryLink,
        digitalCopyLink,
        posterLink,
        researchRecommendations
      });
      
      const userDoc = await getDoc(doc(db, "users", deliveryOrder.userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserInfo;
        if (userData.email) {
          await sendDeliveryEmail(userData.email, userData.name || "العميل الكريم", deliveryOrder.id, deliveryLink);
        }
      }

      setDeliveryOrder(null);
      setDeliveryLink("");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التسليم");
    } finally {
      setIsFulfilling(false);
    }
  };

  const availableTabs = [];
  if (currentUser?.role === "maestro" || currentUser?.role === "research" || currentUser?.role === "admin") availableTabs.push({ id: "orders", label: "الطلبات (باحثين/مدير)" });
  if (currentUser?.role === "maestro" || currentUser?.role === "marketing" || currentUser?.role === "admin") availableTabs.push({ id: "marketing", label: "التسويق (غير مكتملة)" });
  if (currentUser?.role === "maestro" || currentUser?.role === "editor" || currentUser?.role === "admin") availableTabs.push({ id: "articles", label: "المركز المعرفي" });
  if (currentUser?.role === "maestro" || currentUser?.role === "admin") availableTabs.push({ id: "users", label: "المستخدمين" });

  const currentTab = availableTabs.find(t => t.id === activeTab) ? activeTab : availableTabs[0]?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-brand-200 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-900 mb-2">
            لوحة تحكم الإدارة
          </h1>
          <p className="text-brand-600 text-sm">أهلاً بك، {currentUser?.name} <span className="font-bold text-brand-800 bg-brand-100 px-2 py-0.5 rounded-full mr-2">{currentUser?.role}</span></p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-brand-50 p-1 rounded-xl flex flex-wrap gap-1">
            {availableTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-sm ${currentTab === tab.id ? "bg-white text-brand-900 shadow-sm" : "text-brand-600 hover:bg-brand-100"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link to="/" className="flex items-center gap-2 bg-white text-brand-600 border border-brand-200 px-4 py-2 rounded-md hover:bg-brand-50 transition shadow-sm font-medium">
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>

      {currentTab === "orders" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-600 font-medium">إجمالي الطلبات</p>
            <p className="text-2xl font-bold font-mono text-brand-900">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-600 font-medium">قيد البحث والمراجعة</p>
            <p className="text-2xl font-bold font-mono text-brand-900">{orders.filter(o => o.status === 'قيد البحث').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-600 font-medium">المنجزة (مكتمل)</p>
            <p className="text-2xl font-bold font-mono text-brand-900">{orders.filter(o => o.status === 'مكتمل').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
          <h2 className="font-bold text-lg text-brand-900">إدارة طلبات الأنساب والتسجيل</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-white text-brand-500 border-b border-brand-100">
              <tr>
                <th className="px-6 py-4 font-medium">رقم الطلب</th>
                <th className="px-6 py-4 font-medium">اسم العميل وتفصيل العائلة</th>
                <th className="px-6 py-4 font-medium">الباقة المتفق عليها</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium">إجراءات الباحث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-50/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-brand-600 uppercase">#{order.orderNumber || order.id.toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-900">{order.data.firstName} بن {order.data.fatherName}</p>
                    <p className="text-xs text-brand-600 mt-1">عائلة: ( {order.data.familyName} ) | {order.data.homeland}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.plan==='express'?'bg-red-50 text-red-700': order.plan==='invite' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                      {order.plan === 'express' ? 'سريع' : order.plan === 'invite' ? 'كود دعوة' : 'مدفوع'}
                    </span>
                  </td>
                   <td className="px-6 py-4">
                     <select 
                       value={order.status} 
                       onChange={(e) => handleStatusChange(order.id, e.target.value)}
                       className="border border-brand-200 rounded px-2 py-1 bg-white text-sm focus:ring-brand-500"
                     >
                       <option value="بإنتظار إتمام الدفع">بإنتظار إتمام الدفع</option>
                       <option value="قيد البحث">قيد البحث والمقارنة</option>
                       <option value="طلب إيضاح">طلب إيضاح / وثائق ناقصة</option>
                       <option value="تم الرد">تم الرد (من العميل)</option>
                       <option value="تم تسليم الإصدار الأول">تم تسليم الإصدار الأول</option>
                       <option value="طلب مكتمل">طلب مكتمل</option>
                       <option value="مكتمل">التدقيق المنجز للطباعة</option>
                     </select>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                     <div className="flex gap-2">
                       <button 
                         onClick={() => setSelectedOrder(order)}
                         className="flex-1 flex items-center justify-center gap-1 text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-md transition font-medium text-xs"
                       >
                         <Eye className="w-3 h-3" /> عرض
                       </button>
                       <button 
                         onClick={() => {
                           setMessagingOrder(order);
                           if (order.messages?.some(m => m.senderRole === "user" && !m.isRead)) {
                             markMessagesAsRead(order.id, "admin");
                           }
                         }}
                         className="flex-1 flex items-center justify-center gap-1 text-brand-600 hover:text-brand-800 bg-brand-100 hover:bg-brand-200 px-3 py-1.5 rounded-md transition font-medium text-xs relative"
                       >
                         <MessageSquare className="w-3 h-3" /> مراسلة
                         {order.messages && order.messages.filter(m => m.senderRole === "user" && !m.isRead).length > 0 && (
                           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                             {order.messages.filter(m => m.senderRole === "user" && !m.isRead).length}
                           </span>
                         )}
                       </button>
                       <button 
                         onClick={() => setOrderToDelete(order)}
                         className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition font-medium text-xs"
                       >
                         <X className="w-3 h-3" /> حذف
                       </button>
                     </div>
                     {!order.deliveryLink && (
                       <button 
                         onClick={() => setDeliveryOrder(order)}
                         className="w-full flex items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition font-medium text-xs mt-2 w-full"
                       >
                         <CheckCircle className="w-3 h-3" /> تسليم الوثيقة للعميل
                       </button>
                     )}
                     {order.deliveryLink && (
                       <div className="w-full text-center text-xs text-green-700 font-bold bg-green-50 p-1.5 rounded-md mt-2">
                         تم التسليم
                       </div>
                     )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-500">
                    لا توجد طلبات في النظام حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {currentTab === "articles" && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-brand-900">إدارة المقالات والمركز المعرفي</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => { setEditingArticle(null); setArticleForm({ title: "", type: "مقال", section: "الروايات والذاكرة", filter: "عام" }); setIsArticleModalOpen(true); }}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 transition"
              >
                <Plus className="w-5 h-5"/> إضافة موضوع
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
                  <tr key={article.id} className="hover:bg-brand-50/50 transition">
                    <td className="px-6 py-4 font-bold text-brand-900">{article.title}</td>
                    <td className="px-6 py-4 text-brand-600 font-medium">
                       <span className={`px-2 py-1 rounded text-xs ${article.type === 'فيديو' ? 'bg-red-100 text-red-700' : 'bg-brand-100 text-brand-700'}`}>
                         {article.type}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-brand-600 text-xs">
                      {article.section} <br/> <span className="text-gray-400">{article.filter}</span>
                    </td>
                    <td className="px-6 py-4 text-brand-600">
                      {article.publishDate || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button 
                        onClick={() => { setEditingArticle(article); setArticleForm({ ...article }); setIsArticleModalOpen(true); }}
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
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-500">
                      لا يوجد مواضيع حالياً في المركز المعرفي
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === "marketing" && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-brand-900">متابعة حسابات المبيعات - الطلبات غير المكتملة</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-white text-brand-500 border-b border-brand-100">
                <tr>
                  <th className="px-6 py-4 font-medium">رقم الطلب</th>
                  <th className="px-6 py-4 font-medium">اسم العميل</th>
                  <th className="px-6 py-4 font-medium">وسيلة التواصل / البريد</th>
                  <th className="px-6 py-4 font-medium">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 font-medium">تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {orders.filter(o => o.status === 'بانتظار الدفع' || o.status === 'بإنتظار إتمام الدفع').map((order) => (
                  <tr key={order.id} className="hover:bg-brand-50/50 transition">
                    <td className="px-6 py-4 font-mono text-brand-600 uppercase border-r-2 border-orange-500 bg-orange-50/30">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-900">
                      {order.data?.firstName ? `${order.data.firstName} ${order.data.familyName}` : "غير محدد"}
                    </td>
                    <td className="px-6 py-4 text-brand-600">
                      لم يتم توفير بريد (تواصل عبر المنصة فقط)
                    </td>
                    <td className="px-6 py-4 text-brand-600">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-md transition font-medium"
                      >
                         تفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.filter(o => o.status === 'بانتظار الدفع' || o.status === 'بإنتظار إتمام الدفع').length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-500">
                      لا توجد طلبات معلقة (بانتظار الدفع)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === "users" && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
            <h2 className="font-bold text-lg text-brand-900">إدارة المستخدمين والصلاحيات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-white text-brand-500 border-b border-brand-100">
                <tr>
                  <th className="px-6 py-4 font-medium">الاسم</th>
                  <th className="px-6 py-4 font-medium">البريد الإلكتروني</th>
                  <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
                  <th className="px-6 py-4 font-medium">الصلاحيات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-50/50 transition">
                    <td className="px-6 py-4 font-bold text-brand-900">{user.name || "بدون اسم"}</td>
                    <td className="px-6 py-4 text-brand-600 font-mono text-xs">{user.email || "بدون بريد"}</td>
                    <td className="px-6 py-4 text-brand-600">غير محدد</td>
                    <td className="px-6 py-4">
                      {currentUser?.role === "maestro" && user.role !== "maestro" ? (
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border border-brand-200 rounded-md px-2 py-1 text-sm bg-white"
                        >
                          <option value="user">مستخدم عادي</option>
                          <option value="maestro">مايسترو (Maestro)</option>
                          <option value="admin">مدير نظام (Admin)</option>
                          <option value="research">مدير أبحاث</option>
                          <option value="marketing">مدير تسويق</option>
                          <option value="accounting">مدير حسابات</option>
                          <option value="compliance">مدير مراجعة وتدقيق</option>
                          <option value="shipping">مسؤول شحن</option>
                          <option value="customer_service">خدمة عملاء</option>
                          <option value="editor">مدير التحرير</option>
                        </select>
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
      )}

      {/* Delete Order Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 p-6 border-b-4 border-red-500">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              تحذير خطير
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 font-medium">
              سيتم حذف السجل رقم <span className="p-1 px-2 uppercase bg-gray-100 rounded text-brand-700 mx-1">#{orderToDelete.orderNumber || orderToDelete.id.toUpperCase()}</span> وكافة مرفقاته ومكوناته. 
              <br/><br/>
              هل أنت متأكد من ذلك؟ هذا الإجراء <strong>لا يمكن التراجع عنه</strong>!
            </p>
            <div className="flex gap-3">
              <button 
                onClick={async () => {
                   try {
                     const { deleteDoc, doc } = await import("firebase/firestore");
                     const { db } = await import("@/lib/firebase");
                     await deleteDoc(doc(db, "orders", orderToDelete.id));
                     useAppStore.setState(s => ({ orders: s.orders.filter(o => o.id !== orderToDelete.id) }));
                     setOrderToDelete(null);
                   } catch(e) { console.error(e); alert("خطأ في الحذف"); }
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

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
               <h3 className="font-bold text-brand-900 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-brand-600" />
                 تفاصيل الطلب: <span className="uppercase">#{selectedOrder.orderNumber || selectedOrder.id.toUpperCase()}</span>
               </h3>
               <button onClick={() => setSelectedOrder(null)} className="text-brand-500 hover:text-brand-800 bg-white rounded-full p-1 shadow-sm">
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-sm text-brand-800">
              <div className="grid grid-cols-2 gap-6 mb-8 bg-brand-50 p-4 rounded-xl border border-brand-100">
                <div>
                  <p className="text-brand-500 text-xs mb-1">العميل</p>
                  <p className="font-bold text-brand-900">{selectedOrder.data.firstName} بن {selectedOrder.data.fatherName} ( {selectedOrder.data.familyName} )</p>
                </div>
                <div>
                  <p className="text-brand-500 text-xs mb-1">تاريخ الطلب</p>
                  <p className="font-bold font-mono text-brand-900">{new Date(selectedOrder.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>

              <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2">تفاصيل وبيانات العائلة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-white p-4 border border-brand-100 rounded-xl"><strong className="text-brand-600 block mb-1">اسم الجد الأول:</strong> {selectedOrder.data.grandfatherName}</div>
                 <div className="bg-white p-4 border border-brand-100 rounded-xl"><strong className="text-brand-600 block mb-1">اسم القبيلة/العائلة:</strong> {selectedOrder.data.tribeName || 'غير متوفر'}</div>
                 <div className="bg-white p-4 border border-brand-100 rounded-xl"><strong className="text-brand-600 block mb-1">الموطن أو المنشأ:</strong> {selectedOrder.data.country} - {selectedOrder.data.homeland}</div>
                 <div className="bg-white p-4 border border-brand-100 rounded-xl"><strong className="text-brand-600 block mb-1">رقم هاتف العميل:</strong> <span dir="ltr">{selectedOrder.data.mobileNumber || 'غير متوفر'}</span></div>
                 {selectedOrder.data.shippingAddress && (
                   <div className="bg-white p-4 border border-brand-100 rounded-xl md:col-span-2">
                     <strong className="text-brand-600 block mb-1">عنوان الشحن:</strong>
                     {selectedOrder.data.shippingAddress.country}، {selectedOrder.data.shippingAddress.state}، {selectedOrder.data.shippingAddress.street} (الرمز البريدي: {selectedOrder.data.shippingAddress.zip})
                   </div>
                 )}
                 {(selectedOrder.data.startingPoint || selectedOrder.data.startingPointType) && (
                   <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl md:col-span-2">
                     <strong className="text-brand-600 block mb-1">نقطة الانطلاق لعمود النسب:</strong> 
                     <p className="mt-1 font-medium">
                        {selectedOrder.data.startingPointType === "أنا أمين السجل" ? `${selectedOrder.data.firstName} بن ${selectedOrder.data.fatherName}` :
                         selectedOrder.data.startingPointType === "اسم العائلة" ? `( ${selectedOrder.data.familyName} )` :
                         selectedOrder.data.startingPointType === "احد الأسلاف" ? selectedOrder.data.startingPointName :
                         selectedOrder.data.startingPoint}
                     </p>
                   </div>
                 )}
                 {selectedOrder.data.designTemplate && (
                   <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl md:col-span-2"><strong className="text-brand-600 block mb-1">القالب المختار:</strong> <p className="mt-1 font-medium">{selectedOrder.data.designTemplate}</p></div>
                 )}
                 {selectedOrder.data.managerWord && (
                   <div className="bg-white border border-brand-100 p-4 rounded-xl md:col-span-2"><strong className="text-brand-600 block mb-1">كلمة أمين السجل:</strong> <p className="mt-1 whitespace-pre-wrap">{selectedOrder.data.managerWord}</p></div>
                 )}
                 {selectedOrder.data.historicalNotes && (
                   <div className="bg-white border border-brand-100 p-4 rounded-xl md:col-span-2"><strong className="text-brand-600 block mb-1">ملاحظات تاريخية (نبذة عن العائلة):</strong> <p className="mt-1 whitespace-pre-wrap">{selectedOrder.data.historicalNotes}</p></div>
                 )}
              </div>

              <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">مخطط شجرة العائلة المرفق</h4>
              <div className="rounded-xl border border-brand-200 overflow-hidden bg-brand-50 mb-6">
                <TreeBuilder 
                  initialNodes={selectedOrder.data.treeData.nodes} 
                  initialEdges={selectedOrder.data.treeData.edges} 
                  readOnly={true} 
                  onChange={()=>{}}
                />
              </div>

               {selectedOrder.data.documents && selectedOrder.data.documents.length > 0 && (
                <>
                  <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">الوثائق والمرفقات</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.data.documents.map((docItem, idx) => {
                      const isStr = typeof docItem === 'string';
                      const url = isStr ? docItem : docItem.url;
                      const title = !isStr && docItem.title ? docItem.title : `مرفق وثيقة #${idx + 1}`;
                      return (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" className="flex flex-col gap-2 bg-white border border-brand-200 p-4 rounded-xl hover:border-brand-500 transition shadow-sm text-brand-700">
                        <div className="flex items-center gap-3 w-full">
                          <FileText className="w-6 h-6 text-brand-500 shrink-0" />
                          <div className="overflow-hidden w-full">
                             <p className="font-bold text-sm text-brand-900 line-clamp-1">{title}</p>
                             {!isStr && <p className="text-xs text-brand-600 mt-1 line-clamp-1">{docItem.purpose}</p>}
                          </div>
                        </div>
                        {!isStr && (docItem.kind || docItem.description) && (
                          <div className="mt-2 text-xs text-brand-800 bg-brand-50 p-2 rounded-lg border border-brand-100">
                             {docItem.kind && <p><span className="font-bold">النوع:</span> {docItem.kind}</p>}
                             {docItem.description && <p className="mt-1 whitespace-pre-line"><span className="font-bold">الوصف:</span> {docItem.description}</p>}
                          </div>
                        )}
                      </a>
                    )})}
                  </div>
                </>
              )}
               {selectedOrder.data.photos && selectedOrder.data.photos.length > 0 && (
                <>
                  <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2 mt-8">الصور المرفقة</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedOrder.data.photos.map((photoItem, idx) => {
                      const isStr = typeof photoItem === 'string';
                      const url = isStr ? photoItem : photoItem.url;
                      const title = !isStr && photoItem.title ? photoItem.title : `صورة ${idx + 1}`;
                      return (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" className="relative group flex flex-col rounded-xl overflow-hidden border border-brand-200 hover:border-brand-500 transition shadow-sm bg-white">
                        <div className="aspect-square relative w-full">
                          <img src={url} alt={title} className="w-full h-full object-cover bg-gray-100 absolute inset-0" loading="lazy" />
                        </div>
                        {!isStr && (
                           <div className="p-3 bg-white text-right border-t border-brand-100">
                             <p className="text-sm font-bold text-brand-900 mb-1 line-clamp-1">{title}</p>
                             <div className="text-xs text-brand-600 space-y-1">
                               {photoItem.purpose && <p><span className="font-semibold">الغرض:</span> {photoItem.purpose}</p>}
                               {photoItem.description && <p><span className="font-semibold">الوصف:</span> {photoItem.description}</p>}
                             </div>
                           </div>
                        )}
                      </a>
                    )})}
                  </div>
                </>
               )}
            </div>
            <div className="p-4 border-t border-brand-100 bg-brand-50 flex justify-end gap-3">
               <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 rounded-md font-bold bg-brand-600 text-white hover:bg-brand-700 transition">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      {messagingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
               <h3 className="font-bold text-brand-900 flex items-center gap-2">
                 <MessageSquare className="w-5 h-5 text-brand-600" />
                 مراسلة وتوجيهات للعميل: {messagingOrder.data.firstName}
               </h3>
               <button onClick={() => setMessagingOrder(null)} className="text-brand-500 hover:text-brand-800 bg-white rounded-full p-1 shadow-sm">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 max-h-80">
              {(!messagingOrder.messages || messagingOrder.messages.length === 0) ? (
                <div className="text-center text-gray-500 text-sm py-4">ابداً المحادثة مع العميل الآن.</div>
              ) : (
                messagingOrder.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'admin' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.senderRole === 'admin' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white border border-brand-200 text-brand-900 rounded-tl-none shadow-sm'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.attachments.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className={`text-xs px-3 py-1 rounded bg-black/10 hover:bg-black/20 transition flex items-center gap-1 ${msg.senderRole === 'admin' ? 'text-white' : 'text-brand-700'}`}>
                              <FileText className="w-3 h-3" /> مرفق العميل {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{msg.senderRole === 'admin' ? "الباحث" : "العميل"} • {new Date(msg.createdAt).toLocaleString('ar-SA')}</span>
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
                 <button onClick={() => setMessagingOrder(null)} className="px-4 py-2 rounded-md font-medium text-brand-600 hover:bg-brand-100 transition">إلغاء</button>
                 <button onClick={handleSendReply} className="px-6 py-2 rounded-md font-bold bg-brand-600 text-white hover:bg-brand-700 transition">إرسال التوجيه</button>
              </div>
            </div>
          </div>
        </div>
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
              <button onClick={() => setDeliveryOrder(null)} className="text-brand-500 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-full p-2 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-brand-700 mb-6 text-sm">
              برجاء إدخال رابط الوثيقة النهائية (مثال: رابط Google Drive، أو رابط Dropbox، أو رابط مباشر للملف). سيتم تغيير حالة الطلب وتسليمه للعميل مباشرة.
            </p>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط النسخة الرقمية للسجل</label>
                <input 
                  type="url" 
                  value={digitalCopyLink}
                  onChange={(e) => { setDigitalCopyLink(e.target.value); setDeliveryLink(e.target.value); }}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-900 mb-2">رابط بوستر المشجرة</label>
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
                <label className="block font-semibold text-brand-900 mb-2">التوصيات واقتراحات فريق البحث</label>
                <textarea 
                  value={researchRecommendations}
                  onChange={(e) => setResearchRecommendations(e.target.value)}
                  placeholder="أكتب التوصيات..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                />
              </div>
              <button 
                onClick={handleFulfillOrder}
                disabled={isFulfilling || !digitalCopyLink.trim()}
                className="w-full py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isFulfilling ? 'جاري التسليم...' : (
                  <>
                    <Send className="w-5 h-5" /> تأكيد التسليم وإرسال البريد
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
              <h2 className="text-xl font-bold font-serif text-brand-900">{editingArticle ? 'تعديل الموضوع' : 'إضافة موضوع جديد (مقال/فيديو)'}</h2>
              <button 
                onClick={() => { setIsArticleModalOpen(false); setEditingArticle(null); setArticleForm({ title: "", type: "مقال", section: "الروايات والذاكرة", filter: "عام" }); }}
                className="p-2 hover:bg-brand-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">نوع المادة</label>
                  <select 
                    className="w-full p-3 border border-brand-200 rounded-lg bg-gray-50"
                    value={articleForm.type}
                    onChange={(e) => setArticleForm({...articleForm, type: e.target.value as 'مقال' | 'فيديو'})}
                  >
                    <option value="مقال">مقال</option>
                    <option value="فيديو">مقطع فيديو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">القسم</label>
                  <select 
                    className="w-full p-3 border border-brand-200 rounded-lg bg-gray-50"
                    value={articleForm.section}
                    onChange={(e) => setArticleForm({...articleForm, section: e.target.value})}
                  >
                    <option value="الروايات والذاكرة">الروايات والذاكرة</option>
                    <option value="قراءات ومراجع">قراءات ومراجع</option>
                    <option value="عالَم الأنساب">عالَم الأنساب</option>
                    <option value="الأخبار والفعاليات">الأخبار والفعاليات</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">الفرع / التصفية (كتابة حرة لإنشاء قسم جديد أو اختيار موجود)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.filter}
                    onChange={(e) => setArticleForm({...articleForm, filter: e.target.value})}
                    placeholder="مثال: عام، السعودية، اليمن، الحمض النووي..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">العنوان الرئيسي</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                    placeholder={articleForm.type === 'فيديو' ? "عنوان الفيديو..." : "عنوان المقال..."}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-900 mb-2">نص وصفي حول المادة (اختياري)</label>
                  <textarea 
                    className="w-full p-3 border border-brand-200 rounded-lg min-h-[80px]"
                    value={articleForm.description || ""}
                    onChange={(e) => setArticleForm({...articleForm, description: e.target.value})}
                    placeholder="وصف مختصر للمادة..."
                  />
                </div>
              </div>

              <div className="border-t border-brand-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">{articleForm.type === 'فيديو' ? 'اسم المنتج' : 'اسم الكاتب'} (اختياري)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.author || ""}
                    onChange={(e) => setArticleForm({...articleForm, author: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">المحرر (اختياري)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.editor || ""}
                    onChange={(e) => setArticleForm({...articleForm, editor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">تاريخ النشر (اختياري)</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.publishDate || ""}
                    onChange={(e) => setArticleForm({...articleForm, publishDate: e.target.value})}
                  />
                </div>

                {articleForm.type === 'فيديو' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-brand-900 mb-2">رابط الفيديو (اختياري)</label>
                      <input 
                        type="text" 
                        dir="ltr"
                        className="w-full p-3 border border-brand-200 rounded-lg text-left"
                        value={articleForm.videoUrl || ""}
                        onChange={(e) => setArticleForm({...articleForm, videoUrl: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-900 mb-2">مدة المقطع (اختياري)</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-brand-200 rounded-lg"
                        value={articleForm.duration || ""}
                        onChange={(e) => setArticleForm({...articleForm, duration: e.target.value})}
                        placeholder="مثال: 05:30"
                      />
                    </div>
                  </>
                )}
              </div>

              {articleForm.type === 'مقال' && (
                <div className="border-t border-brand-100 pt-6">
                  <label className="block text-sm font-bold text-brand-900 mb-2">نص المقال (اختياري)</label>
                  <textarea 
                    className="w-full p-3 border border-brand-200 rounded-lg h-64 text-justify leading-loose"
                    value={articleForm.content || ""}
                    onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                    placeholder="يمكنك استخدام Markdown للعناوين الفرعية والصور وغيرها..."
                  />
                </div>
              )}

              <div className="border-t border-brand-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-brand-900 mb-4 border-r-4 border-brand-500 pr-2">الروابط والصور</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">رابط صورة الغلاف (اختياري)</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border border-brand-200 rounded-lg text-left dir-ltr"
                    value={articleForm.coverImageUrl || ""}
                    onChange={(e) => setArticleForm({...articleForm, coverImageUrl: e.target.value})}
                  />
                  <p className="text-xs text-brand-500 mt-1">أضف رابط مباشر للصورة، وإلا سيتم استخدام صورة افتراضية.</p>
                </div>
                {articleForm.type === 'فيديو' && (
                  <div>
                    <label className="block text-sm font-bold text-brand-900 mb-2">رابط الفيديو (يوتيوب أو غيره)</label>
                    <input 
                      type="url" 
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full p-3 border border-brand-200 rounded-lg text-left dir-ltr"
                      value={articleForm.videoUrl || ""}
                      onChange={(e) => setArticleForm({...articleForm, videoUrl: e.target.value})}
                    />
                  </div>
                )}
                {articleForm.type === 'فيديو' && (
                  <div>
                    <label className="block text-sm font-bold text-brand-900 mb-2">مدة الفيديو (اختياري - مثلاً 12:30)</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-brand-200 rounded-lg text-left dir-ltr"
                      value={articleForm.duration || ""}
                      onChange={(e) => setArticleForm({...articleForm, duration: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-brand-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-brand-900 mb-4 border-r-4 border-brand-500 pr-2">النصوص المصاحبة للصورة/الفيديو</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">العنوان (وسط الصورة/الفيديو) (اختياري)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-brand-200 rounded-lg"
                    value={articleForm.imageCaption || ""}
                    onChange={(e) => setArticleForm({...articleForm, imageCaption: e.target.value})}
                  />
                </div>
                {articleForm.type === 'مقال' && (
                  <div>
                    <label className="block text-sm font-bold text-brand-900 mb-2">الملكية الفكرية للصورة (اختياري)</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-brand-200 rounded-lg"
                      value={articleForm.imageCopyright || ""}
                      onChange={(e) => setArticleForm({...articleForm, imageCopyright: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="bg-brand-50 rounded-xl p-4 flex gap-4 text-brand-600 text-sm mt-4 border border-brand-200">
                 <AlertCircle className="w-5 h-5 shrink-0" />
                 <p>الحقول الاختيارية التي لا يتم تعبئتها لن تظهر للمستخدم للحفاظ على جمالية العرض.</p>
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

    </div>
  );
}
