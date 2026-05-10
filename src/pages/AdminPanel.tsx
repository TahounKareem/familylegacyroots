import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import { useAppStore, Order, UserInfo } from "@/lib/store";
import { Navigate, Link } from "react-router";
import { Users, FileText, CheckCircle, Search, Edit3, Eye, MessageSquare, X, Home, Link as LinkIcon, Send, AlertCircle } from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";
import { sendDeliveryEmail } from "@/lib/emailService";

export function AdminPanel() {
  const { currentUser, orders, updateOrderStatus, addMessageToOrder, fulfillOrder, markMessagesAsRead } = useAppStore();
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

  if (!currentUser || currentUser.role !== "admin") {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8 border-b border-brand-200 pb-4">
        <h1 className="text-3xl font-serif text-brand-900">
          لوحة تحكم الإدارة (فريق البحث)
        </h1>
        <Link to="/" className="flex items-center gap-2 bg-white text-brand-600 border border-brand-200 px-4 py-2 rounded-md hover:bg-brand-50 transition shadow-sm font-medium">
          <Home className="w-5 h-5" /> الصفحة الرئيسية
        </Link>
      </div>

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
                       <option value="راحل">راحل (تم الدفع)</option>
                       <option value="قيد البحث">قيد البحث والمقارنة</option>
                       <option value="طلب إيضاح">طلب إيضاح / وثائق ناقصة</option>
                       <option value="تم الرد">تم الرد (من العميل)</option>
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
    </div>
  );
}
