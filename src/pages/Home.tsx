import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { BookOpen, Shield, TreeDeciduous, ArrowLeft, Star, ChevronLeft, Play, FolderPlus, Database, SearchCheck, Gift } from "lucide-react";

export function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden text-white">
        {/* Background Image with optimized visibility */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://i.postimg.cc/T3GWLKFv/Pic2-3.jpg')] bg-cover bg-center"></div>
          {/* Elegant Dark Red Overlay - light enough to show details, dark enough for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/40 to-brand-950/90"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-brand-800 text-brand-300 text-sm font-semibold mb-6 tracking-wide uppercase">
                إرث يمتد لأجيال
              </span>
              <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight mb-6">
                وثق جذورك<br />
                <span className="text-brand-400 font-light italic">وإحفظ تراثك</span>
              </h1>
              <p className="text-xl text-brand-200 mb-10 leading-relaxed max-w-lg">
                عمل احترافي دقيق لتوثيق تاريخ وعراقة العائلة من خلال البحث العميق، وتصميم "سجل التراث العائلي" بأسلوب فني يليق بقيمتكم.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#journey" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-md font-semibold transition text-center text-lg flex items-center justify-center gap-2 group">
                  إبدأ رحلة توثيق سجلك العائلي
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / About & Video Section */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-8" />
          <h2 className="font-serif text-4xl text-brand-900 mb-8 leading-normal">
            ما هو "سجل تراث العائلة"؟
          </h2>
          <p className="text-xl text-brand-800 leading-relaxed font-light max-w-3xl mx-auto mb-16">
            ليس مجرد كتاب، بل هو وثيقة تاريخية محققة تُورث للأجيال القادمة. نقوم بجمع الروايات المتناثرة، وتوثيق شجرة العائلة المتصلة، وتنسيق الوثائق التاريخية في قالب منهجي وفني فاخر.
          </p>

          {/* Engraved Video Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-3 md:p-5 rounded-[2.5rem] bg-brand-100/50 shadow-inner border border-brand-200/60 mx-auto backdrop-blur-sm"
          >
            <div className="aspect-[16/9] rounded-[1.5rem] overflow-hidden shadow-2xl relative bg-brand-950 border border-brand-100 group cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
              {!isVideoPlaying ? (
                <>
                  <img 
                    src="https://img.youtube.com/vi/ZeSwzfHvw3I/maxresdefault.jpg" 
                    alt="سجل التراث العائلي فيديو تعريفي" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-950/30 group-hover:bg-brand-950/10 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-brand-600/90 hover:bg-brand-500 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <Play className="w-8 h-8 text-white ml-2" fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/ZeSwzfHvw3I?autoplay=1&rel=0&showinfo=0" 
                  title="سجل التراث العائلي" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="journey" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4">رحلة توثيق سجل تراث العائلة</h2>
            <p className="text-brand-600 text-lg max-w-2xl mx-auto">منهجية أكاديمية دقيقة تضمن لكم الحصول على سجل تاريخي معتمد</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: FolderPlus,
                title: "فتح سجل تراث العائلة",
                desc: "خطوتك الأولى لتدوين تاريخ عائلتك العريق وتوليد ملف خاص بأسرتك."
              },
              {
                icon: Database,
                title: "تزويد البيانات",
                desc: "إدراج التفاصيل الخاصة والوثائق والصور بدقة وسرية تامة."
              },
              {
                icon: SearchCheck,
                title: "التدقيق الميداني",
                desc: "فحص وتوثيق وتحقيق أكاديمي للمعلومات لضمان التاريخ المعتمد."
              },
              {
                icon: Gift,
                title: "استلم السجل",
                desc: "حصولك على نسختك الفاخرة والرقمية لتراثك الموثق الجاهز للمشاركة."
              }
            ].map((feature, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-brand-50 rounded-3xl p-8 border border-brand-100 hover:shadow-xl transition-shadow text-center"
               >
                 <div className="w-16 h-16 bg-brand-200 rounded-full flex items-center justify-center text-brand-700 mx-auto mb-6">
                   <feature.icon className="w-8 h-8" />
                 </div>
                 <h3 className="font-serif text-xl font-bold text-brand-900 mb-4">{feature.title}</h3>
                 <p className="text-brand-800/80 leading-relaxed text-sm">{feature.desc}</p>
               </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center flex justify-center"
          >
            <Link to="/auth" className="inline-flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-xl font-semibold transition shadow-lg text-lg group">
              إبدأ رحلة توثيق سجلك العائلي
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Target Audience */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-50 rounded-[3rem] p-8 md:p-16 shadow-xl border border-brand-100">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              <div>
                 <h2 className="font-serif text-4xl mb-8 font-bold text-brand-900">لمن هذا السجل؟</h2>
                 <ul className="space-y-6">
                   {[
                     "لكل من يرغب في حفظ إرث أجداده.",
                     "للأجيال الشابة الباحثة عن الانتماء ومعرفة جذورها.",
                     "لمن يرغب في تقديم هدية قيمة لعائلته."
                   ].map((item, i) => (
                     <li key={i} className="flex gap-4 items-start">
                       <span className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-sm">
                         <ChevronLeft className="w-5 h-5 text-white" />
                       </span>
                       <span className="text-xl text-brand-800 mt-1 font-medium">{item}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Natural Image Container - Ensures 0 aspect ratio distortion */}
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://i.postimg.cc/cLpTJghp/Pic2.jpg" 
                  alt="نموذج سجل العائلة" 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer" 
                />
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
