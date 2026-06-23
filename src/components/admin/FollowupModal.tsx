import React, { useState } from "react";
import { X, Send, Mail } from "lucide-react";
import { sendCustomEmail } from "@/lib/emailService";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function FollowupModal({ order, onClose, onSuccess }: { order: any; onClose: () => void; onSuccess?: () => void }) {
  const [subject, setSubject] = useState("دعوة لاستكمال إنشاء سجل تراث عائلتكم");
  const [body, setBody] = useState(
    `أهلاً ${order?.data?.firstName || ''}،\n\nنلاحظ أن طلبكم لإنشاء سجل تراث العائلة ما زال بانتظار إتمام الدفع أو غير مكتمل.\nيسعدنا مساعدتكم في أي خطوة تواجهون فيها صعوبة. لا تترددوا في بالتواصل معنا في حال الاستفسار.\n\nنتطلع للبدء برحلة توثيق تاريخكم العريق.\n\nمع التحية،\nفريق خدمة العملاء`
  );
  const [isSending, setIsSending] = useState(false);

  if (!order) return null;

  const handleSend = async () => {
    const email = order.data?.email || order.userId?.email || ""; // Try to extract email context
    if (!email) {
      alert("البريد الإلكتروني للعميل غير متوفر.");
      return;
    }

    setIsSending(true);
    try {
      const htmlBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${body.replace(/\n/g, '<br/>')}</p>
        </div>
      `;
      await sendCustomEmail(email, subject, htmlBody);
      
      // Update order to record the followup
      await updateDoc(doc(db, "orders", order.id), {
        followups: arrayUnion({
          date: new Date().toISOString(),
          type: "email",
          subject: subject
        })
      });

      alert("تم إرسال الرسالة بنجاح!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء إرسال البريد.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm rtl">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col" dir="rtl">
        <div className="bg-brand-50 border-b border-brand-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-brand-900 font-bold">
            <Mail className="w-5 h-5 text-brand-600" />
            التواصل مع العميل: {order.data?.firstName || ''}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-100 rounded-full transition text-brand-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          <div className="text-sm text-brand-700 bg-brand-50 p-3 rounded-lg border border-brand-100">
            البريد الإلكتروني للعميل: <span className="font-bold ltr inline-block" dir="ltr">{order.data?.email || order.userId || "غير متوفر"}</span>
          </div>

          <div>
             <label className="block text-sm font-bold text-brand-800 mb-2">عنوان الرسالة</label>
             <input type="text" className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-800 mb-2">نص الرسالة</label>
            <textarea rows={8} className="w-full border-brand-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500 border" value={body} onChange={e => setBody(e.target.value)}></textarea>
            <p className="text-xs text-brand-500 mt-2">سيتم إرسال هذا الرد مباشرة للعميل.</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-brand-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition">
            إلغاء
          </button>
          <button onClick={handleSend} disabled={isSending} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 font-bold text-white rounded-xl hover:bg-brand-700 transition disabled:opacity-50">
            <Send className="w-4 h-4" /> {isSending ? "جاري الإرسال..." : "إرسال التذكير"}
          </button>
        </div>
      </div>
    </div>
  );
}
