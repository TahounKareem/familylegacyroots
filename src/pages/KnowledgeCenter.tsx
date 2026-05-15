import React, { useState, useEffect } from "react";
import { FileText, Link as LinkIcon, Book, X } from "lucide-react";
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface KnowledgeArticle {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt?: string;
  colorType?: string;
}

export function KnowledgeCenter() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    const q = query(collection(db, "knowledge_articles"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: KnowledgeArticle[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as KnowledgeArticle);
      });
      setArticles(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching articles", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl font-bold text-brand-900 mb-6">المركز المعرفي ومكتبة الأنساب</h1>
        <p className="text-left text-brand-700 text-lg mx-auto text-center max-w-2xl">
          أدلة، مقالات، ومراجع تاريخية تساعدك في فهم علم الأنساب والوثائق المعتمدة في التدوين التراثي.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse text-brand-600 font-bold">جاري تحميل المقالات...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-brand-400">لا توجد مقالات حالياً بالمكتبة.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => {
            const isOrange = item.colorType === 'orange';
            const isGreen = item.colorType === 'green';
            const colorClass = isOrange ? 'bg-orange-50 text-orange-600' : isGreen ? 'bg-green-50 text-green-600' : 'bg-brand-50 text-brand-600';
            const Icon = item.type.includes('دليل') ? Book : item.type.includes('بحث') ? LinkIcon : FileText;

            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-brand-100 hover:shadow-lg transition-shadow group flex flex-col justify-between h-full">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2 block">{item.type}</span>
                  <h3 className="font-serif text-xl font-bold text-brand-900 mb-4 leading-relaxed">{item.title}</h3>
                </div>
                <button onClick={() => setSelectedArticle(item)} className="text-right text-brand-600 font-medium flex items-center gap-2 group-hover:text-brand-800 transition mt-4">
                  قراءة المزيد <span className="text-xl leading-none">&larr;</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-brand-100 bg-brand-50">
              <span className="text-sm font-bold uppercase tracking-wider text-brand-500">{selectedArticle.type}</span>
              <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-brand-200 bg-brand-100 text-brand-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 leading-relaxed">{selectedArticle.title}</h2>
              <div className="prose prose-brand prose-p:text-brand-800 prose-headings:text-brand-900 max-w-none leading-loose text-justify whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
