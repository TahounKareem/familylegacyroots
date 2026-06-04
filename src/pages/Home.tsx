import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { BookOpen, Shield, TreeDeciduous, ArrowLeft, Star, ChevronLeft, Play, FolderPlus, Database, SearchCheck, Gift, Network, FileText, Clock, Users } from "lucide-react";

export function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-0 md:pb-0 md:aspect-[21/9] lg:aspect-[2.5/1] flex items-center overflow-hidden text-white bg-brand-950">
        {/* Background Image without filters */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://i.postimg.cc/y8tmcZTT/webhero.jpg')] bg-cover bg-center"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-serif text-5xl lg:text-7xl leading-tight mb-6 text-white flex flex-col gap-2">
                <span className="font-bold">سجل يوثق</span>
                <span>عمود النسب</span>
                <span>والذاكرة العائلية</span>
              </h1>
              <p className="text-xl text-white mb-10 leading-relaxed max-w-lg">
                مشروع توثيق عائلي يجمع البحث التاريخي والروايات والوثائق ضمن سجل فاخر يوثق عمود النسب والامتداد العائلي.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/auth" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-md font-semibold transition text-center text-lg flex items-center justify-center gap-2 group w-fit">
                  ابدأ سجل عائلتك
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 w-full flex justify-center z-10 px-4">
          <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-base md:text-lg font-serif font-semibold tracking-wide shadow-sm">
            كل جيل يحمل جزءًا من الرواية… حتى يأتي من يجمعها في سجل واحد
          </span>
        </div>
      </section>

      {/* Philosophy / About & Video Section */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-8" />
          <h2 className="font-serif text-4xl text-brand-900 mb-8 leading-normal">
            ما هو "سجل تراث العائلة"؟
          </h2>
          <p className="text-xl text-brand-800 leading-relaxed font-light max-w-3xl mx-auto mb-4">
            سجل تراث العائلة مشروع توثيق يجمع الروايات والوثائق وعمود النسب ضمن سجل معرفي مصمم للأجيال القادمة
          </p>
          <p className="text-lg text-brand-600 font-medium mb-16">
            عمود النسب • الوثائق • الروايات • الأرشفة الرقمية
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
                    src="https://img.youtube.com/vi/QttZpZzFris/hqdefault.jpg" 
                    alt="سجل التراث العائلي فيديو تعريفي" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-950/30 group-hover:bg-brand-950/10 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-transparent border-2 border-white hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <Play className="w-8 h-8 text-white ml-2" fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/QttZpZzFris?autoplay=1&rel=0&showinfo=0" 
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
            <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4">رحلة توثيق سجل تراث عائلتك</h2>
            <p className="text-brand-600 text-lg max-w-2xl mx-auto">رحلة بحث وتوثيق تحفظ امتداد العائلة ورواياتها ضمن سجل معرفي موثق</p>
          </div>
          
                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2 lg:gap-4 hidden md:flex" dir="rtl">
            {[
              { title: "ابدأ سجل عائلتك", desc: "قم بإنشاء حسابك وإعداد النطاق الأولي للسجل" },
              { title: "حدثنا عن عائلتك", desc: "أدخل البيانات والمعلومات الأولية المتوفرة لديك" },
              { title: "نقوم بالبحث والتوثيق", desc: "فريقنا يبدأ جمع ومراجعة وتوثيق الروايات والوثائق" },
              { title: "استلم السجل", desc: "احصل على سجل عائلتك مطبوعاً ورقمياً بتصميم فاخر" }
            ].map((step, idx) => (
              <div key={idx} className="relative flex-1 flex items-stretch group">
                <div 
                  className="bg-[#f8e6e5] z-10 text-brand-900 border border-[#f5d7d5] shadow-sm py-6 px-8 flex-1 text-center h-full flex flex-col justify-center transition-colors hover:bg-[#f3d7d5]"
                  style={{
                    clipPath: idx === 0 
                      ? 'polygon(100% 0%, 15% 0%, 0% 50%, 15% 100%, 100% 100%)' 
                      : idx === 3 
                        ? 'polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%, 85% 50%)' 
                        : 'polygon(100% 0%, 15% 0%, 0% 50%, 15% 100%, 100% 100%, 85% 50%)',
                    borderRadius: idx === 0 ? '0 1.5rem 1.5rem 0' : idx === 3 ? '1.5rem 0 0 1.5rem' : '0'
                  }}
                >
                  <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {[
              { title: "ابدأ سجل عائلتك", desc: "قم بإنشاء حسابك وإعداد النطاق الأولي للسجل" },
              { title: "حدثنا عن عائلتك", desc: "أدخل البيانات والمعلومات الأولية المتوفرة لديك" },
              { title: "نقوم بالبحث والتوثيق", desc: "فريقنا يبدأ جمع ومراجعة وتوثيق الروايات والوثائق" },
              { title: "استلم السجل", desc: "احصل على سجل عائلتك مطبوعاً ورقمياً بتصميم فاخر" }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#f8e6e5] border-[#f5d7d5] rounded-2xl p-6 text-center shadow-sm border text-brand-900">
                <h3 className="font-bold text-lg mb-2">{idx + 1}. {step.title}</h3>
                <p className="text-sm opacity-80">{step.desc}</p>
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center flex justify-center"
          >
            <Link to="/services" className="inline-flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-xl font-semibold transition shadow-lg text-lg group w-fit">
              أعرف المزيد عن السجل
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
                 <h2 className="font-serif text-4xl mb-8 font-bold text-brand-900">لمن صُمم سجل تراث العائلة؟</h2>
                 <ul className="space-y-6">
                   {[
                     { text: "لمن يرغب في توثيق عمود نسب عائلته ضمن سجل معرفي موثق.", icon: Network },
                     { text: "للعائلات التي تخشى ضياع الروايات والوثائق عبر الأجيال.", icon: FileText },
                     { text: "لمن يسعى لحفظ الذاكرة العائلية ضمن سجل مطبوع ورقمي فاخر.", icon: Clock },
                     { text: "كهدية معرفية تحفظ امتداد العائلة للأبناء والأحفاد.", icon: Users }
                   ].map((item, i) => (
                     <li key={i} className="flex gap-4 items-start">
                       <span className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-sm">
                         <item.icon className="w-5 h-5 text-white" />
                       </span>
                       <span className="text-xl text-brand-800 mt-1.5 font-medium">{item.text}</span>
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
