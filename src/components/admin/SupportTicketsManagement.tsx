import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { MessageSquare, Check, Mail, User, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Ticket {
  id: string;
  ticketNumber: string;
  categoryTitle: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: any;
  orderId?: string;
  adminName?: string;
  deviceInfo?: string;
  privacyType?: string;
  isProjectRelated?: string;
  repliedAt?: any;
}

export function SupportTicketsManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("جديدة");

  useEffect(() => {
    const qVars = query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(qVars, (snapshot) => {
      const msgs: Ticket[] = [];
      snapshot.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() } as Ticket);
      });
      setTickets(msgs);
    }, (error) => {
      console.error("SupportTickets error:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkReplied = async (ticket: Ticket) => {
    const subject = encodeURIComponent(`رد على تذكرتكم رقم ${ticket.ticketNumber || ticket.id} - سجل تراث العائلة`);
    const body = encodeURIComponent(`أهلاً بك ${ticket.name}،\n\nإشارة إلى تذكرتكم رقم ${ticket.ticketNumber || ticket.id} بخصوص (${ticket.subject})، نفيدكم بأنه تم استلام استفساركم ويسعدنا الرد عليكم:\n\n\n\n\n\nمع التحية،\nفريق خدمة العملاء`);
    window.open(`mailto:${ticket.email}?subject=${subject}&body=${body}`, '_blank');
    
    if (ticket.status !== "تم الرد") {
      try {
        await updateDoc(doc(db, "support_tickets", ticket.id), {
          status: "تم الرد",
          repliedAt: new Date()
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredTickets = tickets.filter(t => filter === "الكل" || t.status === filter);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-200 mt-8 text-right relative overflow-hidden" dir="rtl">
      {/* Visual Accent for this section */}
      <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 rounded-r-3xl" />

      <div className="flex items-center gap-3 mb-6 border-b border-brand-100 pb-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand-900">إدارة التذاكر والاستفسارات</h2>
          <p className="text-sm text-brand-600">رسائل النماذج، الاستفسارات، الحذف، والدعم الفني</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setFilter("جديدة")} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === "جديدة" ? "bg-amber-100 text-amber-800 border-amber-200 border" : "bg-gray-50 text-gray-600 border border-gray-200"}`}
        >
          إستفسارات جديدة
        </button>
        <button 
          onClick={() => setFilter("تم الرد")} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === "تم الرد" ? "bg-green-100 text-green-800 border-green-200 border" : "bg-gray-50 text-gray-600 border border-gray-200"}`}
        >
          تم الرد
        </button>
        <button 
          onClick={() => setFilter("الكل")} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === "الكل" ? "bg-brand-100 text-brand-800 border-brand-200 border" : "bg-gray-50 text-gray-600 border border-gray-200"}`}
        >
          الكل
        </button>
      </div>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-10 text-brand-500 bg-brand-50 rounded-2xl">
            لا توجد استفسارات حالياً
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const isReplied = ticket.status === "تم الرد";
            
            let replyDuration = null;
            if (isReplied) {
              const getSafeTime = (d: any) => {
                if (!d) return null;
                if (d.toDate) return d.toDate().getTime();
                if (d.seconds) return d.seconds * 1000;
                const time = new Date(d).getTime();
                return isNaN(time) ? null : time;
              };
              const createdTime = getSafeTime(ticket.createdAt);
              const repliedTime = getSafeTime(ticket.repliedAt);
              
              if (createdTime && repliedTime && repliedTime > createdTime) {
                const diffMs = repliedTime - createdTime;
                const diffHours = diffMs / (1000 * 60 * 60);
                if (diffHours < 1) {
                  const diffMins = Math.round(diffMs / (1000 * 60));
                  replyDuration = `خلال ${diffMins} دقيقة`;
                } else if (diffHours < 24) {
                  replyDuration = `خلال ${Math.round(diffHours)} ساعة`;
                } else {
                  replyDuration = `خلال ${Math.round(diffHours / 24)} يوم`;
                }
              }
            }

            return (
              <div 
                key={ticket.id} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isReplied ? 'bg-green-50/50 border-green-200' : 'bg-white hover:border-brand-300 border-brand-200'}`}
              >
                <div 
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer`}
                  onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                >
                  <div className="flex-1 space-y-2 w-full pr-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-brand-100 text-brand-800 px-2 py-1 rounded">{ticket.ticketNumber || "TR-###"}</span>
                        <span className={`text-xs px-2 py-1 rounded select-none ${isReplied ? 'bg-green-100 text-green-800 font-bold' : 'bg-amber-100 text-amber-800 font-bold'}`}>
                          {isReplied ? 'تم الرد' : 'جديدة'}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-1 rounded truncate max-w-[120px]">{ticket.categoryTitle || 'عام'}</span>
                      </div>
                      {expandedId === ticket.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="font-bold text-brand-900 truncate">
                      {ticket.subject}
                    </div>
                    <div className="flex sm:items-center gap-2 sm:gap-4 flex-col sm:flex-row text-xs text-brand-600">
                      <span className="flex items-center gap-1"><User className="w-3 h-3"/> {ticket.name}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {(() => {
                        try {
                          let dateValue = ticket.createdAt;
                          if (!dateValue) return 'حالا';
                          let d: Date;
                          if (dateValue.toDate) d = dateValue.toDate();
                          else if (dateValue.seconds) d = new Date(dateValue.seconds * 1000);
                          else d = new Date(dateValue);
                          
                          if (isNaN(d.getTime())) return 'غير محدد';
                          return format(d, 'PPP - p', {locale: ar});
                        } catch (e) {
                          return 'غير محدد';
                        }
                      })()}</span>
                      {isReplied && replyDuration && (
                        <span className="flex items-center gap-1 text-green-700 font-bold bg-green-100 px-2 rounded-full">
                          <Check className="w-3 h-3" /> تم الرد بنجاح {replyDuration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {expandedId === ticket.id && (
                  <div className="p-4 border-t border-brand-100 bg-white/50 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm bg-white p-4 rounded-xl border border-brand-50 shadow-sm">
                      <div>
                        <span className="block text-brand-500 mb-1 text-xs">البريد الإلكتروني:</span>
                        <span className="font-bold text-brand-900" dir="ltr">{ticket.email}</span>
                      </div>
                      {ticket.orderId && (
                        <div>
                          <span className="block text-brand-500 mb-1 text-xs">رقم الطلب:</span>
                          <span className="font-bold text-brand-900" dir="ltr">{ticket.orderId}</span>
                        </div>
                      )}
                      {ticket.adminName && (
                        <div>
                          <span className="block text-brand-500 mb-1 text-xs">اسم أمين السجل:</span>
                          <span className="font-bold text-brand-900">{ticket.adminName}</span>
                        </div>
                      )}
                      {ticket.privacyType && ticket.categoryTitle === "الخصوصية والوثائق" && (
                         <div>
                          <span className="block text-brand-500 mb-1 text-xs">نوع مسألة الخصوصية:</span>
                          <span className="font-bold text-brand-900">{ticket.privacyType}</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-brand-50 p-4 rounded-xl text-brand-900 font-serif leading-relaxed whitespace-pre-wrap border border-brand-100">
                      {ticket.message}
                    </div>
                    <div className="flex justify-end pt-2">
                       <button
                         onClick={(e) => { e.stopPropagation(); handleMarkReplied(ticket); }}
                         className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                           isReplied 
                             ? 'bg-white border-2 border-green-500 text-green-700 hover:bg-green-50' 
                             : 'bg-brand-600 text-white hover:bg-brand-700'
                         }`}
                       >
                         {isReplied ? (
                           <><Check className="w-4 h-4"/> إرسال رد إضافي</>
                         ) : (
                           <><Mail className="w-4 h-4" /> الرد على العميل عبر البريد والإغلاق</>
                         )}
                       </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
