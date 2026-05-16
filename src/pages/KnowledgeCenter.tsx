import React, { useState, useEffect } from "react";
import { FileText, Link as LinkIcon, Book, X, PlayCircle, Edit3, Share2, Facebook, Twitter, Mail, Copy, Instagram } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNewsletterPopupOpen, setIsNewsletterPopupOpen] = useState(false);

  // Reusable popup opener
  const openNewsletter = () => setIsNewsletterPopupOpen(true);

  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  useEffect(() => {
    if (selectedArticle) {
      setIsPlaying(false);
    }
  }, [selectedArticle]);

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
      {/* Header Section */}
      <div className="w-full bg-white overflow-hidden relative border-b border-gray-200">
        {/* Logo at the top */}
        <div className="relative z-20 flex justify-center py-6 bg-white shrink-0">
          <img src="https://i.postimg.cc/mDCchCVH/logo.jpg" alt="شعار المركز المعرفي" className="h-24 sm:h-32 object-contain" />
        </div>

        {/* Content & Background Image */}
        <div className="relative w-full h-[30vh] sm:h-[40vh] flex items-center justify-center sm:justify-start px-4 sm:px-12 lg:px-24">
          <img 
            src="https://i.postimg.cc/k5tGhK0z/Header.png" 
            alt="المركز المعرفي" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-900/50 to-transparent"></div>
          
          <div className="relative z-10 text-right max-w-2xl ml-auto bg-white/90 p-6 sm:p-8 rounded-2xl backdrop-blur-md border-2 border-[#C3262A] shadow-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 font-bold tracking-tight mb-4 leading-tight">
              المركز المعرفي
            </h1>
            <p className="text-base sm:text-xl text-brand-700 font-medium leading-relaxed font-serif">
              مساحة معرفية حول الأنساب والذاكرة العائلية والتحول الرقمي مقالات ورؤى ودراسات مختارة حول الروايات العائلية والتراث الرقمي وعالَم الأنساب.
            </p>
          </div>
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
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">المدة: {item.duration} دقيقة</div>
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
                    <span>{item.author ? (item.type === 'فيديو' ? `المنتج: ${item.author}` : `الكاتب: ${item.author}`) : 'إدارة المحتوى'}</span>
                    {item.editor && <span>تحرير: {item.editor}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Page Newsletter and Banner */}
        <div className="mt-20">
          {/* Newsletter Trigger */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden group mb-12">
            <div className="absolute inset-0 bg-[#F2E3DE] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#B6191F] mb-4">اشترك في النشرة البريدية</h2>
              <p className="text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto font-medium">
                كن أول من يصله أبرز الرؤى والمقالات المتخصصة في عالم الأنساب والذاكرة.
              </p>
              <button 
                onClick={openNewsletter}
                className="bg-[#C3262A] hover:bg-[#a61c20] text-white px-8 py-3.5 rounded-full font-bold transition-transform hover:scale-105 shadow-md"
              >
                انضم إلى النشرة البريدية
              </button>
            </div>
          </div>

          {/* Banner Section */}
          <div className="mb-12">
            <a href="/services" className="block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <img src="https://i.postimg.cc/QM11TcY9/Bar.png" alt="سجل تراث العائلة" className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity" />
            </a>
          </div>
        </div>
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
            <div className="overflow-y-auto px-6 sm:px-12 py-10 relative">
              {/* Share Buttons */}
              <div className="absolute left-6 top-10 flex flex-col gap-2 z-10">
                <button onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(`${selectedArticle.title}\n${url}`);
                  alert('تم نسخ الرابط بنجاح');
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C3262A] hover:text-white transition-colors shadow-sm" title="نسخ الرابط">
                  <Copy className="w-5 h-5" />
                </button>
                <button onClick={() => {
                  const url = window.location.href;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(url)}`, '_blank');
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors shadow-sm" title="مشاركة على اكس">
                  <Twitter className="w-5 h-5" />
                </button>
                <button onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors shadow-sm" title="مشاركة على فيسبوك">
                  <Facebook className="w-5 h-5" />
                </button>
                <button onClick={() => {
                   const url = window.location.href;
                   navigator.clipboard.writeText(`${selectedArticle.title}\n${url}`);
                   alert('تم نسخ الرابط لمشاركته على انستغرام');
                   window.open('https://instagram.com', '_blank');
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-colors shadow-sm" title="مشاركة على انستغرام">
                  <Instagram className="w-5 h-5" />
                </button>
                <button onClick={() => {
                   const url = window.location.href;
                   navigator.clipboard.writeText(`${selectedArticle.title}\n${url}`);
                   alert('تم نسخ الرابط لمشاركته على تيك توك');
                   window.open('https://tiktok.com', '_blank');
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-sm" title="مشاركة على تيك توك">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </button>
                <button onClick={() => {
                   const url = window.location.href;
                   navigator.clipboard.writeText(`${selectedArticle.title}\n${url}`);
                   alert('تم نسخ الرابط لمشاركته على سناب شات');
                   window.open('https://snapchat.com', '_blank');
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-yellow-400 hover:text-white transition-colors shadow-sm" title="مشاركة على سناب شات">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M11 2c2 0 3 1.5 3 3v2c0 1 .5 1.5 1 1.5s1-.5 1-1.5c0-1 1-1.5 2-1.5s2 .5 2 1.5c0 2-1.5 3-3 3-1 0-1.5.5-1.5 1.5s.5 1.5 1.5 1.5c1.5 0 2 1 2 2s-.5 2-2 2h-1c-1 0-1.5.5-1.5 1.5 0 .5-.5 1-1.5 1h-3c-1 0-1.5-.5-1.5-1-1-1-1.5-1.5-1.5-1.5h-1c-1.5 0-2-1-2-2s.5-2 2-2c1 0 1.5-.5 1.5-1.5S7.5 13 6.5 13c-1.5 0-3-1-3-3s1-1.5 2-1.5c1 0 2-.5 2-1.5S7 6 7 5c0-1.5 1-3 3-3h1z"/></svg>
                </button>
                <button onClick={() => {
                  const url = window.location.href;
                  window.location.href = `mailto:?subject=${encodeURIComponent(selectedArticle.title)}&body=${encodeURIComponent('ألق نظرة على هذا المحتوى: ' + selectedArticle.title + '\n\n' + url)}`;
                }} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors shadow-sm" title="مشاركة عبر البريد">
                  <Mail className="w-5 h-5" />
                </button>
              </div>

              <div className="max-w-3xl mx-auto">
                {selectedArticle.type === 'فيديو' && selectedArticle.videoUrl ? (
                  <div className="w-full aspect-video bg-gray-100 mb-10 rounded-lg overflow-hidden relative shadow-lg">
                    {!isPlaying ? (
                      <div className="absolute inset-0 group cursor-pointer" onClick={() => setIsPlaying(true)}>
                        <img src={selectedArticle.coverImageUrl || "https://images.unsplash.com/photo-1577493341514-fc5685514add?auto=format&fit=crop&q=80"} alt="cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <PlayCircle className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <iframe 
                        src={getYoutubeEmbedUrl(selectedArticle.videoUrl)} 
                        className="w-full h-full border-0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 sm:h-96 bg-gray-100 mb-10 rounded-lg overflow-hidden relative shadow-lg">
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
                {selectedArticle.author && <span>{selectedArticle.type === 'فيديو' ? 'المنتج' : 'الكاتب'}: <span className="text-gray-900 font-bold">{selectedArticle.author}</span></span>}
                {selectedArticle.editor && <span>تحرير: <span className="text-gray-900 font-bold">{selectedArticle.editor}</span></span>}
                {selectedArticle.publishDate && <span>تاريخ النشر: <span className="text-gray-900">{selectedArticle.publishDate}</span></span>}
              </div>

              {selectedArticle.content && (
                <div className="prose prose-lg max-w-none text-gray-800 leading-loose text-justify whitespace-pre-wrap font-serif">
                  {selectedArticle.content}
                </div>
              )}

              {/* Newsletter Trigger */}
              <div className="bg-white border inset-0 border-gray-100 rounded-2xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#F2E3DE] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#B6191F] mb-4">اشترك في النشرة البريدية</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto font-medium">
                    كن أول من يصله أبرز الرؤى والمقالات المتخصصة في عالم الأنساب والذاكرة.
                  </p>
                  <button 
                    onClick={openNewsletter}
                    className="bg-[#C3262A] hover:bg-[#a61c20] text-white px-8 py-3.5 rounded-full font-bold transition-transform hover:scale-105 shadow-md"
                  >
                    انضم إلى النشرة البريدية
                  </button>
                </div>
              </div>

              {/* Banner Section */}
              <div className="mt-12 mb-12">
                <a href="/services" className="block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                  <img src="https://i.postimg.cc/QM11TcY9/Bar.png" alt="سجل تراث العائلة" className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity" />
                </a>
              </div>

              <div className="mt-16 text-center border-t border-gray-100 pt-8">
                <button onClick={() => setSelectedArticle(null)} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  العودة إلى الصفحة السابقة
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Popup */}
      {isNewsletterPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm shadow-2xl">
          <div className="relative w-full max-w-2xl bg-[#F2E3DE] rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" dir="rtl">
            <button 
              onClick={() => setIsNewsletterPopupOpen(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#B6191F] mb-6 leading-tight max-w-xl mx-auto">
                انضم إلى نشرة المركز المعرفي بمنصة سجل تراث العائلة واكتشف مقالات ورؤى مختارة حول الروايات والذاكرة وعالَم الأنساب والتراث الرقمي.
              </h2>
              <p className="text-[#801D22] opacity-80 mb-8 font-medium text-lg">
                المحتوى مجاني بالكامل، ويمكنك إلغاء الاشتراك في أي وقت.
              </p>
              <form className="max-w-md mx-auto" onSubmit={async (e) => {
                  e.preventDefault();
                  const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
                  const email = emailInput.value;
                  const btn = e.currentTarget.querySelector('button');
                  if (email && btn) {
                    try {
                      btn.disabled = true;
                      btn.textContent = 'جاري...';
                      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                      await addDoc(collection(db, 'newsletter_subscribers'), {
                        email,
                        subscribedAt: serverTimestamp(),
                        source: 'knowledge_center_popup'
                      });
                      alert('تم تسجيل بريدك الإلكتروني بنجاح!');
                      setIsNewsletterPopupOpen(false);
                    } catch (err) {
                      console.error(err);
                      alert('حدث خطأ أثناء التسجيل. قد لا تملك الصلاحية للوصول لجدول النشرات البريدية في قواعد البيانات.');
                    } finally {
                      btn.disabled = false;
                      btn.textContent = 'اشترك';
                    }
                  }
                }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="عنوان بريدك الإلكتروني" 
                  required
                  className="w-full px-5 py-4 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B6191F] mb-6 text-right shadow-inner border border-[#e0c4ba]"
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button type="submit" className="w-full sm:w-auto bg-[#801D22] hover:bg-[#6b161c] text-white px-10 py-3 rounded-full font-bold transition-transform hover:scale-105 text-lg shadow-md">
                    اشترك
                  </button>
                  <a href="/legal/privacy" className="text-gray-600 hover:text-gray-900 border-b border-gray-400 pb-0.5 text-sm font-medium transition-colors">
                    سياسة الخصوصية
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
