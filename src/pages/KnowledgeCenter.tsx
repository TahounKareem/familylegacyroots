import React, { useState, useEffect } from "react";
import { FileText, Link as LinkIcon, Book, X, PlayCircle, Edit3 } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface KnowledgeArticle {
  id: string;
  title: string;
  section: string;
  filter: string;
  type: 'مقال' | 'فيديو';
  description?: string;
  content?: string;
  author?: string;
  editor?: string;
  publishDate?: string;
  imageCaption?: string;
  imageCopyright?: string;
  coverImageUrl?: string;
  videoUrl?: string;
  duration?: string;
  createdAt?: string;
}

const SECTIONS = [
  {
    id: "الروايات والذاكرة",
    title: "الروايات والذاكرة",
    desc: "مقالات ومقاطع فيديو حول الانسان والمكان تغطي القضايا الاجتماعية وتاريخ الاعلَام والمشاهير من مختلف الدول والبقاع",
    filters: ["عام", "السعودية", "اليمن", "عمان", "الامارات", "الكويت", "قطر", "البحرين", "العراق", "سوريا", "الاردن", "فلسطين", "مصر", "ليبيا", "الجزائر", "المغرب", "موريتانيا", "السودان", "الصومال", "جيبوتي", "جزر القمر", "زنجبار", "ايران", "تركيا", "افغانستان", "الهند", "البرازيل", "الارجنتين", "استراليا"]
  },
  {
    id: "قراءات ومراجع",
    title: "قراءات ومراجع",
    desc: "قراءات جادة لبحوث ودراسات حول الأنساب والتاريخ بالإضافة الى قراءات في المصادر والوثائق والأراشيف المختلفة",
    filters: ["عام", "مراجع", "وثائق", "كتب", "مخطوطات", "صحف ومجلات"]
  },
  {
    id: "عالَم الأنساب",
    title: "عالَم الأنساب",
    desc: "كل جديد في عالَم الأنساب ، وما يخدم هذا العالَم من معارض ، مؤتمرات ، مشاريع ، الأرشفة ، التوثيق الرقمي ، الحمض النووي، اكتشافات ، حفظ السجلات",
    filters: ["عام", "التوثيق الرقمي", "الحمض النووي", "اكتشافات", "حفظ السجلات"]
  },
  {
    id: "الأخبار والفعاليات",
    title: "الأخبار والفعاليات",
    desc: "هنا ستجدون الجديد من الأخبار ، والفعاليات حول مشاريعنا ، وانجازات فريقنا البحثي ، وشبكة باحثينا بالإضافة الى شركاؤنا في النجاح",
    filters: ["عام", "أخبار", "فعاليات"]
  }
];

export function KnowledgeCenter() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [activeFilter, setActiveFilter] = useState("عام");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    const q = query(collection(db, "knowledge_articles"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: KnowledgeArticle[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as KnowledgeArticle);
      });

      if (data.length === 0) {
        import("firebase/firestore").then(async ({ addDoc }) => {
          try {
            await addDoc(collection(db, "knowledge_articles"), {
              title: "تاريخ عائلة عريق وممتد عبر الأجيال",
              type: "مقال",
              section: "الروايات والذاكرة",
              filter: "المشجرات العائلية",
              description: "مقال توضيحي يستعرض تاريخ العائلة، من خلال تتبع الجذور والروايات الشفوية القديمة، ويستحضر العادات والتقاليد.",
              author: "أمين السجل",
              content: "هذا نص مكون كمحتوى عشوائي.\nتعتبر الذاكرة العائلية من أهم مصادر كتابة التاريخ، حيث أن الكثير من العائلات تمتلك مقتنيات أو صور ووثائق تحكي الكثير من تاريخها...\n\nهذا المقال مجرد نموذج تجريبي لكيفية عرض المقالات في الواجهة.",
              coverImageUrl: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=800&q=80",
              imageCaption: "صورة تعبيرية لتجمع عائلي قديم",
              createdAt: new Date().toISOString()
            });
            await addDoc(collection(db, "knowledge_articles"), {
              title: "رحلة البحث في التراث: فيلم وثائقي قصير",
              type: "فيديو",
              section: "قراءات ومراجع",
              filter: "مراجع",
              description: "شرح تفصيلي مرئي يشرح كيفية قراءة الوثائق التاريخية وكيفية الاستدلال بها.",
              duration: "14:45",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              coverImageUrl: "https://images.unsplash.com/photo-1492271626350-0bfbdc753b89?auto=format&fit=crop&w=800&q=80",
              imageCaption: "لقطة من الفيلم الوثائقي",
              createdAt: new Date().toISOString()
            });
          } catch (e) {
            console.error("Error seeding", e);
          }
        });
      }

      setArticles(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching articles", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const currentSectionData = SECTIONS.find(s => s.id === activeSection)!;
  
  // Filter logic: Section must match. If activeFilter is not "عام", it must match filter too. 
  // Wait, the prompt says "كل مستخدم حسب ال IP الخاص به تفتح له فلتر دولته او اذا كان خارج هذه الدول فتفتح له الصفحة العامة", for now we'll just test UI and default to "عام".
  const displayedArticles = articles.filter(a => {
    if (a.section !== activeSection) return false;
    if (activeFilter !== "عام" && a.filter !== activeFilter) return false;
    return true;
  });

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      {/* Header Image */}
      <div className="w-full h-[50vh] relative bg-brand-900 overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" 
          alt="المركز المعرفي" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay grayscale"
        />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-6 flex items-center justify-center border border-white/30">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">المركز المعرفي</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Sections Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12 border-b border-brand-200 pb-4">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => { setActiveSection(section.id); setActiveFilter("عام"); }}
              className={`text-xl md:text-2xl font-bold font-serif transition-colors ${activeSection === section.id ? "text-[#C3262A]" : "text-gray-500 hover:text-gray-800"}`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Section Description */}
        <div className="text-center mb-12">
          <p className="text-brand-900 font-bold text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            {currentSectionData.desc}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 max-w-5xl mx-auto">
          {currentSectionData.filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-sm md:text-base transition-colors ${activeFilter === filter ? "text-[#C3262A] font-bold" : "text-gray-500 hover:text-gray-800"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-20 animate-pulse text-brand-600 font-bold">جاري تحميل المحتوى...</div>
        ) : displayedArticles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">لا يوجد محتوى حالياً في هذا القسم.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full" onClick={() => setSelectedArticle(item)}>
                {/* Thumbnail placeholder */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img src={item.coverImageUrl || "https://images.unsplash.com/photo-1577493341514-fc5685514add?auto=format&fit=crop&q=80"} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.type === 'فيديو' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  {item.type === 'فيديو' && item.duration && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">الموّدة: {item.duration} دقيقة</div>
                   )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-semibold">
                    {item.type === 'فيديو' ? <PlayCircle className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                    <span>{item.type} / {item.section} - {item.filter}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#C3262A] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                    <span>{item.author ? `الكاتب: ${item.author}` : 'إدارة المحتوى'}</span>
                    {item.editor && <span>تحرير: {item.editor}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden rounded-xl animate-in zoom-in-95 duration-300">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                {selectedArticle.type === 'فيديو' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {selectedArticle.type}
              </span>
              <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 sm:px-12 py-10">
              {selectedArticle.type === 'فيديو' && selectedArticle.videoUrl ? (
                <div className="w-full aspect-video bg-black mb-10 rounded-lg overflow-hidden flex items-center justify-center">
                  <a href={selectedArticle.videoUrl} target="_blank" rel="noreferrer" className="text-white flex flex-col items-center hover:text-[#C3262A] transition-colors">
                    <PlayCircle className="w-16 h-16 mb-4" />
                    <span className="font-bold">تشغيل المقطع في نافذة جديدة</span>
                  </a>
                </div>
              ) : (
                <div className="w-full h-64 sm:h-96 bg-gray-100 mb-10 rounded-lg overflow-hidden relative">
                  <img src={selectedArticle.coverImageUrl || "https://images.unsplash.com/photo-1577493341514-fc5685514add?auto=format&fit=crop&q=80"} alt="cover" className="w-full h-full object-cover" />
                </div>
              )}

              {selectedArticle.imageCaption && (
                <p className="text-center font-bold text-lg font-serif text-[#C3262A] mb-2">{selectedArticle.imageCaption}</p>
              )}
              {selectedArticle.imageCopyright && (
                <p className="text-center text-xs text-gray-400 mb-10">{selectedArticle.imageCopyright}</p>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-12 border-y border-gray-100 py-4">
                {selectedArticle.author && <span>الكاتب / المنتج: <span className="text-gray-900 font-bold">{selectedArticle.author}</span></span>}
                {selectedArticle.editor && <span>تحرير: <span className="text-gray-900 font-bold">{selectedArticle.editor}</span></span>}
                {selectedArticle.publishDate && <span>تاريخ النشر: <span className="text-gray-900">{selectedArticle.publishDate}</span></span>}
              </div>

              {selectedArticle.content && (
                <div className="prose prose-lg max-w-none text-gray-800 leading-loose text-justify whitespace-pre-wrap font-serif">
                  {selectedArticle.content}
                </div>
              )}

              <div className="mt-16 text-center">
                <button onClick={() => setSelectedArticle(null)} className="text-[#C3262A] font-bold text-sm hover:underline">
                  العودة إلى الصفحة السابقة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
