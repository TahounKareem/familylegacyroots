import React, { useState } from "react";
import { TimelineFormEvent } from "@/lib/store";
import { Plus, Trash2, Edit3, Calendar, MapPin, Users, HelpCircle, Save, X } from "lucide-react";

interface TimelineBuilderProps {
  events: TimelineFormEvent[];
  onChange: (events: TimelineFormEvent[]) => void;
  readOnly?: boolean;
}

export function TimelineBuilder({ events, onChange, readOnly = false }: TimelineBuilderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TimelineFormEvent>>({});

  const handleAddNew = () => {
    setFormData({});
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleEdit = (index: number) => {
    setFormData(events[index]);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الحدث؟")) {
      const newEvents = [...events];
      newEvents.splice(index, 1);
      onChange(newEvents);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.description) {
      alert("الرجاء تعبئة الحقول الإلزامية: عنوان الحدث، التاريخ، والوصف.");
      return;
    }

    const newEvent = formData as TimelineFormEvent;
    if (editingIndex !== null) {
      const newEvents = [...events];
      newEvents[editingIndex] = newEvent;
      onChange(newEvents);
    } else {
      onChange([...events, newEvent]);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm space-y-6">
        <h3 className="font-bold text-brand-900 text-lg">
          {editingIndex !== null ? "تعديل حدث" : "إضافة حدث جديد"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              عنوان الحدث <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: هجرة العائلة، ولادة الجد..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              السنة / الفترة التقريبية <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="مثال: 1350 هـ، أو بداية القرن الرابع عشر"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              دقة التاريخ
            </label>
            <select
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              value={formData.dateAccuracy || ""}
              onChange={(e) => setFormData({ ...formData, dateAccuracy: e.target.value as any })}
            >
              <option value="">-- اختر الدقة --</option>
              <option value="confirmed">مؤكد</option>
              <option value="approximate">تقريبي</option>
              <option value="inherited">رواية متوارثة</option>
              <option value="unknown">غير محدد بدقة</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              نوع الحدث (اختياري)
            </label>
            <input
              type="text"
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.type || ""}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="مثال: توطين، منصب..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              المكان (اختياري)
            </label>
            <input
              type="text"
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              وصف الحدث <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-32 border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="تفاصيل ما حدث..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              الشخصيات المرتبطة (اختياري)
            </label>
            <input
              type="text"
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.associatedPeople?.join("، ") || ""}
              onChange={(e) => setFormData({ ...formData, associatedPeople: e.target.value.split("،").map(s => s.trim()).filter(Boolean) })}
              placeholder="افصل بين الأسماء بفاصلة (,)"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-700 mb-1">
              مصدر المعلومة (اختياري)
            </label>
            <input
              type="text"
              className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.source || ""}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="وثيقة، كتاب، رواية فلان..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-brand-100">
          <button
            onClick={handleSave}
            className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition"
          >
            <Save className="w-5 h-5" />
            حفظ الحدث
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-white text-brand-700 border border-brand-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-50 transition"
          >
            <X className="w-5 h-5" />
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-brand-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-600" />
            التسلسل الزمني للعائلة
          </h2>
          <p className="text-brand-600 mt-1">
            سجل أهم الأحداث والتواريخ المفصلية في مسيرة العائلة وتاريخها.
          </p>
        </div>
        {!readOnly && (
          <button
            onClick={handleAddNew}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 transition"
          >
            <Plus className="w-5 h-5" />
            إضافة حدث جديد
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-10 text-center">
          <Calendar className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <p className="text-brand-500 font-medium">لا توجد أحداث مسجلة بعد. ابدأ بإضافة أهم محطات العائلة.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl border border-brand-200 hover:border-brand-400 transition group relative shadow-sm">
              {!readOnly && (
                <div className="absolute top-5 left-5 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(index)} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-start gap-4 pr-2">
                <div className="w-20 text-center shrink-0">
                  <div className="bg-brand-100 text-brand-800 font-bold py-1 px-2 rounded-lg text-sm border border-brand-200">
                    {event.date}
                  </div>
                  {event.dateAccuracy && (
                    <div className="text-[10px] text-brand-500 mt-1">
                      {event.dateAccuracy === "confirmed" && "مؤكد"}
                      {event.dateAccuracy === "approximate" && "تقريبي"}
                      {event.dateAccuracy === "inherited" && "متوارث"}
                      {event.dateAccuracy === "unknown" && "غير محدد"}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 border-r-2 border-brand-100 pr-4">
                  <h4 className="text-lg font-bold text-brand-900 mb-1">{event.title}</h4>
                  {event.type && (
                     <span className="inline-block bg-brand-50 text-brand-600 text-xs px-2 py-0.5 rounded-full mb-2">
                       {event.type}
                     </span>
                  )}
                  <p className="text-brand-700 text-sm leading-relaxed mb-3">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs tracking-tight text-brand-500">
                    {event.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {event.location}</span>
                    )}
                    {event.associatedPeople && event.associatedPeople.length > 0 && (
                      <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {event.associatedPeople.join("، ")}</span>
                    )}
                    {event.source && (
                      <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3"/> المصدر: {event.source}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
