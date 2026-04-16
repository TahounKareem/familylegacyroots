import { motion } from "motion/react";
import { Link } from "react-router";
import { BookOpen, Shield, TreeDeciduous, ArrowLeft, Star, ChevronLeft } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/arabesque/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                <span className="text-brand-400 font-light italic">واحفظ عراقتك</span>
              </h1>
              <p className="text-xl text-brand-200 mb-10 leading-relaxed max-w-lg">
                عمل احترافي دقيق لتوثيق تاريخ وعراقة العائلة من خلال البحث العميق، وتصميم "سجل التراث العائلي" بأسلوب فني يليق بقيمتكم.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-md font-semibold transition text-center text-lg flex items-center justify-center gap-2 group">
                  ابدأ توثيق عائلتك
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/services" className="bg-transparent border border-brand-500 text-brand-300 hover:bg-brand-900 px-8 py-4 rounded-md font-semibold transition text-center text-lg">
                  تعرف على خدماتنا
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border-8 border-brand-900 relative shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/vintagebookbox/800/600" 
                  alt="سجل التراث العائلي" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Decorative Play Button for Promo Video */}
                <div className="absolute inset-0 bg-brand-950/20 flex items-center justify-center group cursor-pointer hover:bg-brand-950/10 transition">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-y-[10px] border-y-transparent border-r-[16px] border-r-white ml-2"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / About Short */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-8" />
          <h2 className="font-serif text-4xl text-brand-900 mb-8 leading-normal">
            ما هو "سجل التراث العائلي"؟
          </h2>
          <p className="text-xl text-brand-800 leading-relaxed font-light">
            ليس مجرد كتاب، بل هو وثيقة تاريخية محققة تُورث للأجيال القادمة. نقوم بجمع الروايات المتناثرة، وتوثيق شجرة العائلة المتصلة، وتنسيق الوثائق التاريخية في قالب منهجي وفني فاخر.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-brand-900">لماذا تختار منصتنا؟</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "دقة وموثوقية",
                desc: "باحثون متخصصون في الأنساب يراجعون كافة الوثائق ويدققون المراجع التاريخية لضمان صحة التسلسل."
              },
              {
                icon: TreeDeciduous,
                title: "شجرة العائلة الرقمية",
                desc: "أداة بناء مبتكرة تتيح لك إدخال أسماء أفراد العائلة وترابطهم مع معالجة الروايات المختلفة للنسب."
              },
              {
                icon: Star,
                title: "إخراج فني فاخر",
                desc: "طباعة فاخرة على ورق عالي الجودة وتجليد فني متقن، ليصبح الكتاب تحفة فنية تزين مكتبتك."
              }
            ].map((feature, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-brand-50 rounded-3xl p-8 border border-brand-100 hover:shadow-xl transition-shadow"
               >
                 <div className="w-14 h-14 bg-brand-200 rounded-2xl flex items-center justify-center text-brand-700 mb-6">
                   <feature.icon className="w-7 h-7" />
                 </div>
                 <h3 className="font-serif text-xl font-bold text-brand-900 mb-4">{feature.title}</h3>
                 <p className="text-brand-800/80 leading-relaxed">{feature.desc}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Target Audience */}
      <section className="py-24 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="font-serif text-4xl mb-6">لمن هذا المنتج؟</h2>
               <ul className="space-y-6">
                 {[
                   "لكل عميد أسرة يرغب في حفظ إرث أجداده.",
                   "للأجيال الشابة الباحثة عن الانتماء ومعرفة جذورها.",
                   "كهدية فاخرة لكبار العائلة في المناسبات الخاصة والأعياد."
                 ].map((item, i) => (
                   <li key={i} className="flex gap-4 items-start">
                     <span className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                       <ChevronLeft className="w-5 h-5" />
                     </span>
                     <span className="text-xl text-brand-100 mt-1">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
            <div className="aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden relative">
              <img src="https://picsum.photos/seed/familyportrait/800/1000?blur=2" alt="عائلة" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
