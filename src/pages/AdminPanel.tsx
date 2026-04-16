import { useState } from "react";
import { useAppStore, Order } from "@/lib/store";
import { Navigate, Link } from "react-router";
import { Users, FileText, CheckCircle, Search, Edit3, Eye, MessageSquare, X, Home } from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";

export function AdminPanel() {
  const { currentUser, orders, updateOrderStatus, addMessageToOrder } = useAppStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messagingOrder, setMessagingOrder] = useState<Order | null>(null);
  const [replyText, setReplyText] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !messagingOrder || !currentUser) return;
    
    addMessageToOrder(messagingOrder.id, {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "admin",
      text: replyText,
      createdAt: new Date().toISOString()
    }, "طلب إيضاح");

    setReplyText("");
    setMessagingOrder(null);
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
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
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
                  <td className="px-6 py-4 font-mono text-brand-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-900">{order.data.firstName} بن {order.data.fatherName}</p>
                    <p className="text-xs text-brand-600 mt-1">عائلة: {order.data.familyName} | {order.data.homeland}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.plan==='express'?'bg-red-50 text-red-700':'bg-brand-100 text-brand-700'}`}>
                      {order.plan === 'express' ? 'سريع' : 'عادي'}
                    </span>
                  </td>
                   <td className="px-6 py-4">
                     <select 
                       value={order.status} 
                       onChange={(e) => handleStatusChange(order.id, e.target.value)}
                       className="border border-brand-200 rounded px-2 py-1 bg-white text-sm focus:ring-brand-500"
                     >
                       <option value="راحل">راحل (تم الدفع المبدئي)</option>
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
                         className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition font-medium text-xs"
                       >
                         <Eye className="w-3 h-3" /> عرض
                       </button>
                       <button 
                         onClick={() => setMessagingOrder(order)}
                         className="flex-1 flex items-center justify-center gap-1 text-brand-600 hover:text-brand-800 bg-brand-100 hover:bg-brand-200 px-3 py-1.5 rounded-md transition font-medium text-xs"
                       >
                         <MessageSquare className="w-3 h-3" /> مراسلة
                       </button>
                     </div>
                     {order.status === "مكتمل" && (
                       <button className="w-full flex items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition font-medium text-xs">
                         <CheckCircle className="w-3 h-3" /> تسليم عبر Klaviyo
                       </button>
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

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
               <h3 className="font-bold text-brand-900 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-brand-600" />
                 تفاصيل الطلب: {selectedOrder.id}
               </h3>
               <button onClick={() => setSelectedOrder(null)} className="text-brand-500 hover:text-brand-800 bg-white rounded-full p-1 shadow-sm">
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-sm text-brand-800">
              <div className="grid grid-cols-2 gap-6 mb-8 bg-brand-50 p-4 rounded-xl border border-brand-100">
                <div>
                  <p className="text-brand-500 text-xs mb-1">العميل</p>
                  <p className="font-bold text-brand-900">{selectedOrder.data.firstName} بن {selectedOrder.data.fatherName} {selectedOrder.data.familyName}</p>
                </div>
                <div>
                  <p className="text-brand-500 text-xs mb-1">تاريخ الطلب</p>
                  <p className="font-bold font-mono text-brand-900">{new Date(selectedOrder.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <p className="text-brand-500 text-xs mb-1">المسار (الباقة)</p>
                  <p className="font-bold text-brand-900">{selectedOrder.plan === 'express' ? 'سريع' : 'عادي'}</p>
                </div>
                <div>
                  <p className="text-brand-500 text-xs mb-1">طلب طباعة ورقية</p>
                  <p className="font-bold text-brand-900">{selectedOrder.printRequested ? 'نعم (يتم تقييم التكلفة وتسعيرها للعميل)' : 'لا (نسخة رقمية فقط)'}</p>
                </div>
              </div>

              <h4 className="font-bold text-lg text-brand-900 mb-4 border-b border-brand-100 pb-2">تفاصيل وبيانات العائلة</h4>
              <div className="space-y-4">
                 <div><strong className="text-brand-600">جد العائلة:</strong> {selectedOrder.data.grandfatherName}</div>
                 <div><strong className="text-brand-600">اسم القبيلة/العائلة:</strong> {selectedOrder.data.tribeName || 'غير متوفر'}</div>
                 <div><strong className="text-brand-600">الموطن أو المنشأ:</strong> {selectedOrder.data.country} - {selectedOrder.data.homeland}</div>
                 {selectedOrder.data.knownLineage && (
                   <div><strong className="text-brand-600">التسلسل النسبي المعروف:</strong> <p className="mt-1 bg-gray-50 p-3 rounded border border-gray-200">{selectedOrder.data.knownLineage}</p></div>
                 )}
                 {selectedOrder.data.historicalNotes && (
                   <div><strong className="text-brand-600">ملاحظات تاريخية:</strong> <p className="mt-1 bg-gray-50 p-3 rounded border border-gray-200">{selectedOrder.data.historicalNotes}</p></div>
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
                    {selectedOrder.data.documents.map((docUrl, idx) => (
                      <a key={idx} href={docUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white border border-brand-200 p-3 rounded-lg hover:border-brand-500 transition shadow-sm text-brand-700">
                        <FileText className="w-5 h-5 text-brand-500" />
                        <div className="overflow-hidden">
                           <p className="font-medium text-sm">مرفق وثيقة #{idx + 1}</p>
                           <p className="text-xs text-brand-500 truncate" dir="ltr">{docUrl.substring(0,40)}...</p>
                        </div>
                      </a>
                    ))}
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
    </div>
  );
}
