import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Play } from 'lucide-react';

export function StoriesSection() {
  const [selectedStory, setSelectedStory] = useState<{name: string; fullText: string} | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  const stories = [
    {
      name: "عبدالعزيز القحطاني",
      image: "https://i.postimg.cc/jqmMjvJk/QPicture1.png",
      quote: "عندما رأيت السجل بصورته النهائية، شعرت أن جزءًا من تاريخ عائلتنا أصبح شيئًا ملموسًا يمكن أن يبقى معنا.",
      fullText: "«كنت أرى أن لدينا الكثير من الروايات والمعلومات والصور التي تتناقلها العائلة، لكن لم تكن مجتمعة في مكان واحد. ما أعجبني في سجل تراث العائلة أنه لم يكتفِ بجمع المعلومات، وبناء عمود النسب لعائلتنا بل حوّلها إلى سجل متكامل يمكن أن نحتفظ به ونقدمه لأبنائنا وأحفادنا. عندما رأيت السجل بصورته النهائية، شعرت أن جزءًا من تاريخ عائلتنا أصبح شيئًا ملموسًا يمكن أن يبقى معنا.»"
    },
    {
      name: "فاطمة الناجي",
      image: "https://i.postimg.cc/3rVtw9Dc/QPicture2.png",
      quote: "أكثر ما جذبني إلى فكرة سجل تراث العائلة هو أن بعض التفاصيل التي نعرفها اليوم قد لا يعرفها أبناؤنا بالطريقة نفسها غدًا.",
      fullText: "«أكثر ما جذبني إلى فكرة سجل تراث العائلة هو أن بعض التفاصيل التي نعرفها اليوم قد لا يعرفها أبناؤنا بالطريقة نفسها غدًا. لذلك شعرت أن توثيق نسب العائلة، والروايات والصور والوثائق في سجل واحد هو أكثر من مجرد حفظ للمعلومات؛ إنه طريقة لنترك للأجيال القادمة شيئًا يعرفون من خلاله قصة عائلتهم. بالنسبة لي، قيمة السجل الحقيقية ليست في الكتاب نفسه فقط، وإنما في الذكريات التي أصبح يحملها ويحفظها.»"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Rounded Container (matches the Hero video border) */}
        <div className="p-3 md:p-5 rounded-[2.5rem] bg-brand-100/50 shadow-inner border border-brand-200/60 mx-auto backdrop-blur-sm">
          <div className="rounded-[1.5rem] border border-brand-100 bg-white shadow-2xl px-6 py-12 md:px-16 md:py-16 relative">
            
            {/* Header */}
            <div className="flex flex-col items-start mb-16 text-right">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-[#722f37]" strokeWidth={2} />
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-black">قصص السجل</h2>
              </div>
              <p className="text-lg md:text-xl text-black font-serif font-bold mt-2 md:mr-14">من الرواية إلى السجل</p>
            </div>

            {/* Main Story (Al-Moatasem) */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
              {/* Text Content */}
              <div className="flex-1 text-right">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#722f37] mb-4">المعتصم آل السيد</h3>
                <p className="text-xl md:text-2xl text-black font-serif font-bold leading-relaxed mb-6 max-w-xl">
                  "اليوم أصبح لدينا سجل يجمع الروايات.. والوثائق.. وعمود النسب.. في مكان واحد"
                </p>
                <button 
                  onClick={() => setPlayingVideoUrl('https://www.youtube.com/embed/R3nNU3dH2EY?autoplay=1')}
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-serif text-lg font-bold transition-colors mt-2"
                >
                  شاهد القصة
                </button>
              </div>
              
              {/* Video Thumbnail Image */}
              <div className="flex-1 flex justify-center md:justify-end w-full">
                 <div className="relative cursor-pointer group" onClick={() => setPlayingVideoUrl('https://www.youtube.com/embed/R3nNU3dH2EY?autoplay=1')}>
                    <img 
                      src="https://i.postimg.cc/44qW3wh0/01-Tes.jpg" 
                      alt="المعتصم آل السيد" 
                      className="w-full max-w-[240px] md:max-w-[280px] rounded-xl shadow-2xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 group-hover:bg-[#722f37]/80 transition-all duration-300">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 mt-8">
              {stories.map((story, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  {/* Image (Right in RTL) */}
                  <div className="w-full sm:w-1/3 shrink-0 flex justify-center sm:justify-start">
                    <div className="relative z-10 perspective-1000">
                      <img 
                        src={story.image} 
                        alt={story.name} 
                        className="w-40 sm:w-full max-w-[150px] h-auto rounded shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                        style={{
                          WebkitBoxReflect: 'below 0px linear-gradient(transparent, transparent, transparent, rgba(0,0,0,0.3))'
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  
                  {/* Text (Left in RTL) */}
                  <div className="w-full sm:w-2/3 text-center sm:text-right pt-2">
                    <h4 className="font-serif text-xl md:text-2xl font-bold text-black mb-3">{story.name}</h4>
                    <p className="text-black font-serif text-base md:text-lg leading-relaxed font-bold mb-4">
                      {story.quote}
                    </p>
                    <button 
                      onClick={() => setSelectedStory(story)}
                      className="text-gray-400 font-serif text-lg font-bold hover:text-black transition-colors inline-flex items-center gap-1"
                    >
                      . المزيد
                    </button>
                  </div>
                </div>
              ))}
            </div>

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
