import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Play } from 'lucide-react';

interface Story {
  id: string;
  name: string;
  image: string;
  quote: string;
  actionText: string;
  isVideo: boolean;
  videoUrl?: string;
  fullText: string;
}

export function StoriesSection() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  const stories: Story[] = [
    {
      id: "al-moatasem",
      name: "المعتصم آل السيد",
      image: "https://i.postimg.cc/cL17Nk2K/01-Tes1.jpg",
      quote: '"اليوم أصبح لدينا سجل يجمع الروايات.. والوثائق.. وعمود النسب.. في مكان واحد"',
      actionText: "شاهد القصة",
      isVideo: true,
      videoUrl: "https://www.youtube.com/embed/R3nNU3dH2EY?autoplay=1",
      fullText: "«اليوم أصبح لدينا سجل يجمع الروايات.. والوثائق.. وعمود النسب.. في مكان واحد»"
    },
    {
      id: "abdulaziz",
      name: "عبدالعزيز القحطاني",
      image: "https://i.postimg.cc/jqmMjvJk/QPicture1.png",
      quote: "عندما رأيت السجل بصورته النهائية، شعرت أن جزءًا من تاريخ عائلتنا أصبح شيئًا ملموسًا يمكن أن يبقى معنا.",
      actionText: ". المزيد",
      isVideo: false,
      fullText: "«كنت أرى أن لدينا الكثير من الروايات والمعلومات والصور التي تتناقلها العائلة، لكن لم تكن مجتمعة في مكان واحد. ما أعجبني في سجل تراث العائلة أنه لم يكتفِ بجمع المعلومات، وبناء عمود النسب لعائلتنا بل حوّلها إلى سجل متكامل يمكن أن نحتفظ به ونقدمه لأبنائنا وأحفادنا. عندما رأيت السجل بصورته النهائية، شعرت أن جزءًا من تاريخ عائلتنا أصبح شيئًا ملموسًا يمكن أن يبقى معنا.»"
    },
    {
      id: "fatima",
      name: "فاطمة الناجي",
      image: "https://i.postimg.cc/3rVtw9Dc/QPicture2.png",
      quote: "أكثر ما جذبني إلى فكرة سجل تراث العائلة هو أن بعض التفاصيل التي نعرفها اليوم قد لا يعرفها أبناؤنا بالطريقة نفسها غدًا.",
      actionText: ". المزيد",
      isVideo: false,
      fullText: "«أكثر ما جذبني إلى فكرة سجل تراث العائلة هو أن بعض التفاصيل التي نعرفها اليوم قد لا يعرفها أبناؤنا بالطريقة نفسها غدًا. لذلك شعرت أن توثيق نسب العائلة، والروايات والصور والوثائق في سجل واحد هو أكثر من مجرد حفظ للمعلومات؛ إنه طريقة لنترك للأجيال القادمة شيئًا يعرفون من خلاله قصة عائلتهم. بالنسبة لي، قيمة السجل الحقيقية ليست في الكتاب نفسه فقط، وإنما في الذكريات التي أصبح يحملها ويحفظها.»"
    }
  ];

  return (
    <section id="stories-section" className="pb-24 pt-2 bg-white relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek rectangular container */}
        <div className="rounded-2xl md:rounded-3xl bg-brand-50 border border-brand-100 p-6 sm:p-8 md:p-10 relative shadow-sm">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-brand-200/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#722f37]/10 flex items-center justify-center text-[#722f37]">
                <BookOpen className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black">قصص السجل</h2>
                <span className="text-brand-300 font-light">|</span>
                <p className="text-sm sm:text-base text-brand-700 font-serif font-bold">من الرواية إلى السجل</p>
              </div>
            </div>
          </div>

          {/* Testimonial Cards Grid: 3 equal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {stories.map((story) => (
              <div 
                key={story.id} 
                id={`story-card-${story.id}`}
                className="flex flex-col justify-between h-full bg-white rounded-xl border border-brand-100 p-5 shadow-sm hover:border-[#722f37]/40 hover:shadow-md transition-all duration-200 group"
              >
                {/* Media frame */}
                <div 
                  onClick={() => {
                    if (story.isVideo && story.videoUrl) {
                      setPlayingVideoUrl(story.videoUrl);
                    } else {
                      setSelectedStory(story);
                    }
                  }}
                  className="relative w-full h-36 sm:h-40 rounded-lg bg-brand-100/40 border border-brand-200/50 flex items-center justify-center overflow-hidden cursor-pointer"
                  title={story.isVideo ? "شاهد القصة" : "قراءة القصة كاملة"}
                >
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className={`max-h-full max-w-full ${story.isVideo ? 'w-full h-full object-cover' : 'object-contain p-2'} transition-transform duration-300 group-hover:scale-105`}
                    referrerPolicy="no-referrer"
                  />
                  {story.isVideo && (
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                      <div className="w-11 h-11 bg-[#722f37] text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="pt-4 flex flex-col flex-1 text-right">
                  <h4 className="font-serif text-lg md:text-xl font-bold text-black mb-2">{story.name}</h4>
                  <p className="font-serif text-sm md:text-base text-brand-800 leading-relaxed font-bold flex-1">
                    {story.quote}
                  </p>
                  
                  {/* Action Link / Button */}
                  <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-start">
                    {story.isVideo ? (
                      <button 
                        id={`btn-${story.id}`}
                        onClick={() => story.videoUrl && setPlayingVideoUrl(story.videoUrl)}
                        className="inline-flex items-center gap-1.5 text-[#722f37] hover:text-[#521e25] font-serif text-base font-bold transition-colors"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {story.actionText}
                      </button>
                    ) : (
                      <button 
                        id={`btn-${story.id}`}
                        onClick={() => setSelectedStory(story)}
                        className="text-gray-400 hover:text-black font-serif text-base font-bold transition-colors inline-flex items-center gap-1"
                      >
                        {story.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideoUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setPlayingVideoUrl(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <button 
                onClick={() => setPlayingVideoUrl(null)}
                className="absolute top-4 right-4 z-20 text-white hover:text-gray-200 transition-colors bg-black/40 hover:bg-black/80 backdrop-blur-md p-2 rounded-full"
                aria-label="إغلاق"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe 
                src={playingVideoUrl} 
                className="w-full h-full border-0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title="تشغيل الفيديو"
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Elegant Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#722f37]" />
                  <h3 className="font-serif text-2xl font-bold text-[#722f37] m-0 leading-none">
                    {selectedStory.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-200 p-3 rounded-full flex-shrink-0"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar">
                <p className="font-serif text-xl sm:text-2xl leading-loose text-gray-800 text-justify">
                  {selectedStory.fullText}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
