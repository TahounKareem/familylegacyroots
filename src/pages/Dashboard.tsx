import { useAppStore, Order, Message } from "@/lib/store";
import { Navigate, Link, useLocation, useNavigate } from "react-router";
import { FileText, Clock, AlertCircle, CheckCircle, BookOpen, MessageSquare, X, UploadCloud } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { storage, auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";

export function Dashboard() {
  const { currentUser, orders, addMessageToOrder, updateOrderStatus } = useAppStore();
  const [messagingOrder, setMessagingOrder] = useState<Order | null>(null);
  const [replyText, setReplyText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachedUrls, setAttachedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for Stripe success redirect
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const orderId = params.get("order_id");

    if (success === "true" && orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order && order.status === "بانتظار الدفع") {
        updateOrderStatus(orderId, "قيد البحث");
        // Trigger email
        getDoc(doc(db, "users", currentUser.id)).then(userDoc => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            import("@/lib/emailService").then(({ sendOrderConfirmationEmail }) => {
              sendOrderConfirmationEmail(userData.email, userData.name || "العميل الكريم", orderId);
            });
          }
        });
        // Remove query params to avoid re-triggering
        navigate("/dashboard", { replace: true });
      }
    }
  }, [location.search, orders, updateOrderStatus, navigate]);

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  const userOrders = orders.filter(o => o.userId === currentUser.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مكتمل": return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "طلب إيضاح": return <AlertCircle className="text-orange-500 w-5 h-5" />;
      case "قيد البحث": return <Clock className="text-blue-500 w-5 h-5" />;
      case "تم الرد": return <CheckCircle className="text-brand-500 w-5 h-5" />;
      default: return <Clock className="text-gray-500 w-5 h-5" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `messages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
        alert("فشل رفع الملف.");
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAttachedUrls(prev => [...prev, downloadURL]);
          setUploading(false);
        });
      }
    );
  };

  const handleSendReply = () => {
    if (!messagingOrder || !currentUser || (!replyText.trim() && attachedUrls.length === 0)) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderRole: "user",
      text: replyText,
      attachments: attachedUrls,
      createdAt: new Date().toISOString()
    };

    addMessageToOrder(messagingOrder.id, newMessage, "تم الرد");
    
    setReplyText("");
    setAttachedUrls([]);
    setMessagingOrder(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-900 mb-2">أهلاً بك، {currentUser.name}</h1>
          <p className="text-brand-700">مرحباً بك في لوحة التحكم الخاصة بك , يمكنك تتبع طلباتك وإضافة بياناتك من هنا.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-brand-600 hover:text-brand-800 hover:underline font-medium">العودة للرئيسية</Link>
          <span className="text-brand-300">|</span>
          <button onClick={() => {
            signOut(auth);
            useAppStore.getState().logout();
          }} className="text-brand-600 hover:text-brand-800 hover:underline font-medium">تسجيل الخروج</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-serif text-brand-900">طلبات سجل تراث العائلة</h2>
              <Link to="/order" className="bg-brand-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-700 transition">
                طلب جديد
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-12 bg-brand-50 rounded-xl border border-dashed border-brand-200">
                <FileText className="w-12 h-12 text-brand-300 mx-auto mb-4" />
                <h3 className="text-lg text-brand-800 mb-2">لا توجد طلبات بعد</h3>
                <p className="text-brand-600 mb-6 font-light">ابدأ بتوثيق تراث عائلتك الآن</p>
                <Link to="/order" className="bg-brand-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-700 transition">
                  إنشاء السجل
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const deliveryDate = new Date(new Date(order.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000);
                  const daysRemaining = Math.ceil((deliveryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  return (
                  <div key={order.id} className="border border-brand-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-brand-900 text-lg">سجل عائلة {order.data.familyName}</h4>
                      <p className="text-sm text-brand-600 mt-1">تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                      <p className="text-sm text-brand-600">تاريخ الإستلام المتوقع: خلال 90 يوم من تاريخ تقديم الطلب ({deliveryDate.toLocaleDateString('ar-EG')})</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${order.status === 'مكتمل' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-50 border-brand-100'}`}>
                         {getStatusIcon(order.status)}
                         {order.status}
                       </span>
                       {order.status === "طلب إيضاح" && (
                         <button 
                           onClick={() => setMessagingOrder(order)}
                           className="text-sm text-orange-600 hover:text-orange-800 hover:underline flex items-center gap-1 font-medium bg-orange-100 px-3 py-1.5 rounded-md"
                         >
                           <MessageSquare className="w-4 h-4" /> الرد على الإيضاح
                         </button>
                       )}
                       {order.messages && order.messages.length > 0 && order.status !== "طلب إيضاح" && (
                         <button 
                           onClick={() => setMessagingOrder(order)}
                           className="text-sm text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1 font-medium bg-brand-100 px-3 py-1.5 rounded-md"
                         >
                           <MessageSquare className="w-4 h-4" /> عرض الرسائل
                         </button>
                       )}
                       {order.status === "مكتمل" && order.deliveryLink && (
                         <a 
                           href={order.deliveryLink}
                           target="_blank"
                           rel="noreferrer"
                           className="text-sm text-white bg-green-600 hover:bg-green-700 flex items-center gap-1 font-medium px-4 py-2 rounded-md shadow-sm transition mt-2"
                         >
                           <CheckCircle className="w-4 h-4" /> استلام الوثيقة
                         </a>
                       )}
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-950 text-white rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BookOpen className="w-32 h-32" />
             </div>
             <h3 className="font-serif text-xl font-bold mb-4 relative z-10">نصيحة الباحث</h3>
             <p className="text-brand-200 text-sm leading-relaxed relative z-10">
               كلما قدمت وثائق أكثر تفصيلاً كالشهادات القديمة، عقود المبايعات، وصكوك الأوقاف، زادت دقة شجرة عائلتك وتمكنا من الوصول لأجداد أبعد.
             </p>
          </div>
        </div>
      </div>

      {/* Messaging Modal */}
      {messagingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right relative">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
               <h3 className="font-bold text-brand-900 flex items-center gap-2">
                 <MessageSquare className="w-5 h-5 text-brand-600" />
                 طلب إيضاح وتواصل الاستشاري (طلب رقم: <span className="font-mono">{messagingOrder.id}</span>)
               </h3>
               <button onClick={() => setMessagingOrder(null)} className="text-brand-500 hover:text-brand-800 bg-white rounded-full p-1 shadow-sm">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {(!messagingOrder.messages || messagingOrder.messages.length === 0) ? (
                <div className="text-center text-gray-500 text-sm py-4">لا توجد رسائل سابقة.</div>
              ) : (
                messagingOrder.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'user' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.senderRole === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white border border-brand-200 text-brand-900 rounded-tl-none shadow-sm'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.attachments.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className={`text-xs px-3 py-1 rounded bg-black/10 hover:bg-black/20 transition flex items-center gap-1 ${msg.senderRole === 'user' ? 'text-white' : 'text-brand-700'}`}>
                              <FileText className="w-3 h-3" /> مرفق {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString('ar-SA')}</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t border-brand-100 flex flex-col gap-3">
              <textarea 
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك هنا للباحث..."
                className="w-full border border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 p-3 bg-brand-50 text-sm"
              ></textarea>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                  <button onClick={() => fileInputRef.current?.click()} className="text-brand-600 hover:text-brand-800 flex items-center gap-1 text-sm font-medium">
                    <UploadCloud className="w-4 h-4" /> إرفاق ملف
                  </button>
                  {uploading && <span className="text-xs text-brand-500 font-medium">جاري الرفع... {Math.round(uploadProgress)}%</span>}
                  
                  {attachedUrls.length > 0 && (
                    <span className="text-xs text-green-600 font-medium">{attachedUrls.length} ملفات مرفقة</span>
                  )}
                </div>
                
                <button 
                  onClick={handleSendReply} 
                  disabled={uploading || (!replyText.trim() && attachedUrls.length === 0)}
                  className={`px-6 py-2 rounded-md font-bold text-white transition ${uploading || (!replyText.trim() && attachedUrls.length === 0) ? 'bg-brand-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-md'}`}
                >
                  إرسال الرد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
