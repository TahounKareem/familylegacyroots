import React, { useState, useEffect } from "react";
import { FileText, Link as LinkIcon, Book, X, PlayCircle, Edit3, Share2, Facebook, Twitter, Mail, Copy, Instagram, ArrowLeft } from "lucide-react";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
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
  coverTextOverlay?: string;
  coverImageUrl?: string;
  videoUrl?: string;
  duration?: string;
  createdAt?: string;
}

const BASE_SECTIONS = [
  {
    id: "الروايات والذاكرة",
    title: "الروايات والذاكرة",
    desc: "مقالات ومقاطع فيديو حول الانسان والمكان تغطي القضايا الاجتماعية وتاريخ الاعلَام والمشاهير من مختلف الدول والبقاع",
    filters: ["عام"]
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
  const [activeSection, setActiveSection] = useState(BASE_SECTIONS[0].id);
  const [activeFilter, setActiveFilter] = useState("عام");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamic SECTIONS derivation
  const getDynamicSections = () => {
    return BASE_SECTIONS.map(section => {
      const sectionArticles = articles.filter(a => a.section === section.id);
      const articleFilters = sectionArticles.map(a => a.filter).filter(Boolean) as string[];
      // Combine base filters and any custom filters found in articles exactly for this section
      const uniqueFilters = Array.from(new Set([...section.filters, ...articleFilters]));
      return { ...section, filters: uniqueFilters };
    });
  };

  const SECTIONS = getDynamicSections();

  // Newsletter Inline Component
  const NewsletterInline = () => (
    <div className="relative mx-auto rounded-2xl w-full max-w-2xl overflow-hidden shadow-md group mt-8">
      <img 
        src="https://i.postimg.cc/76PGqB6Y/News-Letter-N.jpg" 
        alt="اشترك في النشرة البريدية" 
        className="w-full h-auto object-cover" 
      />
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 w-[25%] sm:w-[20%] flex flex-col justify-end">
        <form onSubmit={async (e) => {
            e.preventDefault();
            const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
            const email = emailInput.value;
            const btn = e.currentTarget.querySelector('button');
            if (email && btn) {
              try {
                btn.disabled = true;
                btn.textContent = 'جاري...';
                await addDoc(collection(db, 'newsletter_subscribers'), {
                  email,
                  subscribedAt: serverTimestamp(),
                  source: 'knowledge_center_inline'
                });
                alert('تم تسجيل بريدك الإلكتروني بنجاح!');
                emailInput.value = '';
              } catch (err) {
                console.error(err);
                alert('حدث خطأ أثناء التسجيل.');
              } finally {
                btn.disabled = false;
                btn.textContent = 'انضم';
              }
            }
          }} className="flex flex-col gap-2 relative z-10 w-full" dir="rtl">
          <input 
            type="email" 
            name="email"
            placeholder="البريد الإلكتروني" 
            required
            className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md bg-white/95 focus:bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C3262A] text-[10px] sm:text-xs text-center font-medium"
          />
          <div className="flex justify-end w-full">
            <button type="submit" className="w-[75%] bg-[#C3262A] hover:bg-[#a61c20] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-bold transition-colors text-[10px] sm:text-xs shadow-sm pl-4">
              انضم
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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
    const q = collection(db, "knowledge_articles");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: KnowledgeArticle[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as KnowledgeArticle);
      });

      // Sort locally to avoid excluding documents that are missing the `createdAt` field
      data.sort((a: any, b: any) => {
        const getMs = (dateVal: any) => {
          if (!dateVal) return 0;
          if (dateVal.toDate) return dateVal.toDate().getTime();
          return new Date(dateVal).getTime();
        };
        return getMs(b.createdAt) - getMs(a.createdAt);
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
      
      const urlParams = new URLSearchParams(window.location.search);
      const articleId = urlParams.get('article');
      if (articleId && !selectedArticle) {
        const found = data.find(a => a.id === articleId);
        if (found) {
          setSelectedArticle(found);
          // Set section and filter to match
          setActiveSection(found.section);
          setActiveFilter(found.filter);
        }
      }
      
      setLoading(false);
    }, (error) => {
      // Suppress missing permissions error during check
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

  if (selectedArticle) {
    return (
      <>
      <div className="bg-[#FAF9F6] min-h-screen pb-20 fade-in">
        <div className="relative w-full bg-brand-900 group">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video sm:aspect-[21/9] w-full mt-4 rounded-b-3xl overflow-hidden shadow-md">
              <img 
                src={selectedArticle.coverImageUrl || "https://images.unsplash.com/photo-1577493341514-fc5685514add?auto=format&fit=crop&q=80"} 
                alt="صورة المقال" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedArticle(null)} 
                className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md px-4 py-2 rounded-full transition shadow-sm font-medium"
              >
                <ArrowLeft className="w-5 h-5" /> 
                <span>العودة للمركز المعرفي</span>
              </button>

              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 text-white/90 font-medium mb-4">
                  <span className="bg-[#C3262A] px-3 py-1 rounded-full text-sm shadow-sm">{selectedArticle.type}</span>
                  <span className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">{selectedArticle.section} / {selectedArticle.filter}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg mb-4 max-w-4xl">
                  {selectedArticle.title}
                </h1>
                <div className="flex flex-wrap text-sm gap-x-6 gap-y-2 text-white/80">
                  <span className="flex items-center gap-1.5"><Edit3 className="w-4 h-4"/> {selectedArticle.author ? (selectedArticle.type === 'فيديو' ? `المنتج: ${selectedArticle.author}` : `الكاتب: ${selectedArticle.author}`) : 'إدارة المحتوى'}</span>
                  {selectedArticle.editor && <span className="flex items-center gap-1.5"><FileText className="w-4 h-4"/> تحرير: {selectedArticle.editor}</span>}
                  {selectedArticle.publishDate && <span className="flex items-center gap-1.5">تاريخ النشر: {new Date(selectedArticle.publishDate).toLocaleDateString('ar-EG')}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* The small text as requested */}
          {(selectedArticle.imageCaption || selectedArticle.imageCopyright) && (
            <div className="text-xs text-brand-500 text-right mb-6 -mt-6 pb-4 border-b border-brand-100 flex flex-col gap-1">
              {selectedArticle.imageCaption && <span className="font-bold text-brand-700">{selectedArticle.imageCaption}</span>}
              {selectedArticle.imageCopyright && <span>{selectedArticle.imageCopyright}</span>}
            </div>
          )}

          {selectedArticle.type === 'فيديو' && selectedArticle.videoUrl ? (
            <div className="w-full aspect-video bg-gray-100 mb-10 rounded-xl overflow-hidden relative shadow-xl">
              <iframe 
                src={getYoutubeEmbedUrl(selectedArticle.videoUrl)} 
                className="w-full h-full border-0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={selectedArticle.title}
              ></iframe>
            </div>
          ) : null}

          {selectedArticle.content ? (
            <div 
              className="prose prose-lg sm:prose-xl max-w-none prose-headings:font-serif prose-headings:text-brand-900 prose-p:text-brand-800 prose-p:leading-loose text-justify font-serif"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          ) : (
            selectedArticle.type !== 'فيديو' && (
              <p className="text-gray-500 italic text-center py-10">المقال لا يحتوي على نص حالياً.</p>
            )
          )}

          {/* Share Buttons at the Bottom */}
          <div className="mt-16 pt-8 border-t border-brand-200">
            <h3 className="text-lg font-bold text-brand-900 mb-6 text-center font-serif">شارك المعرفة</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                navigator.clipboard.writeText(`${selectedArticle.title}\n${url}`);
                alert('تم نسخ الرابط بنجاح');
              }} className="px-6 py-3 rounded-full bg-white border border-brand-200 text-brand-700 flex items-center gap-2 hover:bg-brand-50 hover:border-brand-300 transition-colors shadow-sm font-medium" title="نسخ الرابط">
                <Copy className="w-5 h-5" /> نسخ الرابط
              </button>
              <button onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(url)}`, '_blank');
              }} className="px-6 py-3 rounded-full bg-white border border-brand-200 text-gray-700 flex items-center gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors shadow-sm font-medium" title="مشاركة على اكس">
                <Twitter className="w-5 h-5" /> شارك على X
              </button>
              <button onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
              }} className="px-6 py-3 rounded-full bg-white border border-brand-200 text-gray-700 flex items-center gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors shadow-sm font-medium" title="مشاركة على فيسبوك">
                <Facebook className="w-5 h-5" /> شارك على فيسبوك
              </button>
              <button onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedArticle.title + ' ' + url)}`, '_blank');
              }} className="px-6 py-3 rounded-full bg-white border border-brand-200 text-gray-700 flex items-center gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors shadow-sm font-medium" title="مشاركة على واتساب">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> شارك على واتساب
              </button>
            </div>
          </div>

            <div className="mt-20 flex flex-col gap-8 w-full max-w-4xl mx-auto">
              {/* Banner Section */}
              <div className="mb-4 border-t border-brand-100 pt-8 mt-4 w-full">
                <a href="/" className="block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                  <img src="https://i.postimg.cc/d3PQr4fd/Banner.png" alt="سجل تراث العائلة" className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity" />
                </a>
              </div>

              {/* Newsletter Inline */}
              <NewsletterInline />
            </div>
          </div>
      </div>
    </>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      {/* Header Section */}
      <div className="w-full relative border-b border-gray-200 flex flex-col items-center pt-8 pb-12 bg-white">
        <div className="relative w-full max-w-5xl mx-auto mt-16 sm:mt-20">
          <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 z-30 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            <img src="https://i.postimg.cc/ZqwJsJM3/Knowledge-Center-Logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-[35vh] sm:h-[45vh] rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img 
              src="https://i.postimg.cc/B6y4sM37/Knowledge-Center-Hero.png" 
              alt="المركز المعرفي" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Sections Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12 border-b border-brand-200 pb-4">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => { setActiveSection(section.id); setActiveFilter(section.filters.length > 0 ? section.filters[0] : "عام"); }}
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
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img src={item.coverImageUrl || "https://images.unsplash.com/photo-1577493341514-fc5685514add?auto=format&fit=crop&q=80"} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.coverTextOverlay && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white text-center drop-shadow-lg opacity-95">{item.coverTextOverlay}</h3>
                    </div>
                  )}
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
          <div className="mt-20 flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Banner Section */}
            <div className="mb-4 border-t border-brand-100 pt-8 mt-4 w-full">
              <a href="/" className="block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                <img src="https://i.postimg.cc/d3PQr4fd/Banner.png" alt="سجل تراث العائلة" className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity" />
              </a>
            </div>

            {/* Newsletter Inline */}
            <NewsletterInline />
          </div>
      </div>
    </div>
  );
}
