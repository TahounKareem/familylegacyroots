import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Edit2, Trash2, Save, X, MessageCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: number;
}

export function ChatbotManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<FAQ>>({});

  useEffect(() => {
    const q = collection(db, "chatbot_faqs");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: FAQ[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as FAQ);
      });
      data.sort((a, b) => b.createdAt - a.createdAt);
      setFaqs(data);
    }, () => {});
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!editForm.question || !editForm.answer) return;
    try {
      const id = editForm.id || Date.now().toString();
      const docRef = doc(db, "chatbot_faqs", id);
      await setDoc(docRef, {
        question: editForm.question,
        answer: editForm.answer,
        isActive: editForm.isActive ?? true,
        createdAt: editForm.createdAt || Date.now()
      });
      setIsEditing(false);
      setEditForm({});
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    try {
      await deleteDoc(doc(db, "chatbot_faqs", id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (faq: FAQ) => {
    try {
      await setDoc(doc(db, "chatbot_faqs", faq.id), {
        ...faq,
        isActive: !faq.isActive
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-200 mt-8 relative overflow-hidden">
      {/* Visual Accent for this section */}
      <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500 rounded-r-3xl" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-brand-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-900">
              إدارة المرشد الذكي
            </h2>
            <p className="text-sm text-brand-600 mt-1">
              أضف الأسئلة الشائعة والإجابات ليجيب بها المرشد الذكي.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditForm({ isActive: true });
            setIsEditing(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="w-5 h-5" /> إضافة سؤال
        </button>
      </div>

      {isEditing && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8 text-right">
          <h3 className="font-bold text-lg text-indigo-900 mb-4 border-b border-indigo-200 pb-2">
            {editForm.id ? "تعديل السؤال" : "إضافة سؤال جديد"}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-indigo-900 mb-1">السؤال المتوقع من الزائر</label>
              <input
                type="text"
                value={editForm.question || ""}
                onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                className="w-full border border-indigo-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="مثال: كم تكلفة السجل؟"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-indigo-900 mb-1">الإجابة المعتمدة من الإدارة</label>
              <textarea
                value={editForm.answer || ""}
                onChange={e => setEditForm({ ...editForm, answer: e.target.value })}
                rows={4}
                className="w-full border border-indigo-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="اكتب الإجابة التسويقية والدقيقة..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-indigo-700 bg-white border border-indigo-200 rounded-lg font-bold hover:bg-indigo-50 transition"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Save className="w-4 h-4" /> حفظ وإعتماد
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map(faq => (
          <div key={faq.id} className={`border \${faq.isActive ? "border-green-200 bg-white" : "border-gray-200 bg-gray-50"} rounded-xl p-4 shadow-sm transition hover:shadow-md`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900 line-clamp-2">{faq.question}</h4>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditForm(faq);
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{faq.answer}</p>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 text-left w-full" dir="ltr">
                {new Date(faq.createdAt).toLocaleDateString("ar-EG")}
              </span>
              <button
                onClick={() => handleToggleActive(faq)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition whitespace-nowrap \${faq.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}
              >
                {faq.isActive ? "فعال للمرشد" : "غير مفعل"}
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && !isEditing && (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-bold mb-1">لا توجد أسئلة وإجابات مضافة</p>
            <p className="text-sm text-gray-400">سيعتمد المرشد الذكي على قاعدة المعرفة الأساسية فقط.</p>
          </div>
        )}
      </div>
    </div>
  );
}
