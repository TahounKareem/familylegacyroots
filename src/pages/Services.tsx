import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, BookOpen, Clock, ShieldCheck, CheckCircle2, Bookmark, Info, ChevronDown, Users, FileText, Lock, Coins, Sparkles, LayoutList } from 'lucide-react';

export function Services() {
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFlexiblePaymentInfo, setShowFlexiblePaymentInfo] = useState(false);
  const [showFullPaymentInfo, setShowFullPaymentInfo] = useState(false);

  const sections = [
    { id: 'memory', title: 'ذاكرة العائلة' },
    { id: 'what-is', title: 'ما هو سجل تراث العائلة؟' },
    { id: 'why-different', title: 'لماذا هذا السجل مختلف؟' },
    { id: 'methodology', title: 'المنهجية المعتمدة' },
    { id: 'content-model', title: 'نموذج لمحتوى السجل' },
    { id: 'basic-edition', title: 'الإصدار الأساسي' },
    { id: 'advanced-research', title: 'البحث المتقدم' },
    { id: 'what-is-included', title: 'ما الذي يشمله السجل؟' },
    { id: 'curator', title: 'أمين السجل' },
    { id: 'timeline', title: 'مدة العمل' },
    { id: 'privacy', title: 'الخصوصية وحماية البيانات' },
    { id: 'investment', title: 'الاستثمار في حفظ إرث العائلة' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      let currentActive = '';
      for (const el of sectionElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentActive = el.id;
            break;
          }
        }
      }
      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-50 min-h-screen pb-20 relative">
      <div className="bg-white py-16 mb-12 shadow-sm border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-6" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-900 mb-6">سجل تراث العائلة</h1>
          <p className="text-xl text-brand-700 max-w-2xl mx-auto font-light leading-relaxed">
            <span className="font-bold">سجل يوثق عمود النسب والذاكرة العائلية</span><br/><br/>
            نوثق الروايات والوثائق وعمود النسب ضمن سجل عائلي يجمع البحث التاريخي والإخراج الأنيق.<br/>
            كل جيل يحمل جزءًا من الرواية… حتى يأتي من يجمعها في سجل واحد.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-1/4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100 hidden lg:block">
                <img src="https://i.postimg.cc/hG3tfLbD/Hist.png" alt="فهرس تاريخي" className="w-full h-auto object-cover rounded-xl" />
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100">
                <h3 className="font-serif text-xl font-bold text-brand-900 mb-6 border-b border-brand-100 pb-4">عن سجل تراث العائلة</h3>
                <ul className="space-y-3">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      onClick={() => scrollToSection(sec.id)}
                      className={`text-right w-full transition-colors duration-200 text-sm md:text-base ${
                        activeSection === sec.id
                          ? 'text-brand-600 font-bold'
                          : 'text-brand-700 hover:text-brand-500 font-medium'
                      }`}
                    >
                      {sec.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </div>

          <div className="lg:w-3/4 space-y-16 bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-sm border border-brand-100 overflow-hidden">
            
            <section id="memory" className="scroll-mt-32">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-brand-500 shrink-0" /> ذاكرة العائلة
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>في الذاكرة العائلية لا يُذكر النسب بوصفه أسماء فقط، بل بوصفه امتدادًا للرواية والانتماء والهوية.</p>
                <p>ومع مرور الزمن، تصبح بعض الروايات أقل وضوحًا، ليس لغيابها، بل لتراكم ما فوقها واختلاطها بما يُروى عبر الأجيال.</p>
                <p>ومن هنا جاءت فكرة "سجل تراث العائلة"… ليس بوصفه مشجرة تقليدية، ولا مجرد تجميع للروايات، بل بوصفه سجلًا بحثيًا يوثق عمود النسب ضمن إطار علمي ومنهجي واضح.</p>
                <p>نحن لا نسعى إلى جمع كل شيء، بل إلى توثيق ما يمكن إثباته بصورة مهنية مسؤولة، وبناء سجل معرفي يمكن الرجوع إليه والبناء عليه مستقبلًا.</p>
              </div>
            </section>

            <section id="what-is" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Info className="w-8 h-8 text-brand-500 shrink-0" /> ما هو سجل تراث العائلة؟
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>"سجل تراث العائلة" هو مشروع توثيق عن العائلة يجمع:</p>
                <ul className="list-disc list-inside space-y-2 pr-4 bg-brand-50 p-6 rounded-2xl">
                  <li>عمود النسب،</li>
                  <li>الروايات،</li>
                  <li>الوثائق،</li>
                  <li>والمراجع المرتبطة بالعائلة،</li>
                </ul>
                <p>ضمن سجل معرفي أنيق يُصمم ليبقى مرجعًا للأجيال القادمة.<br/><br/>ويُبنى السجل وفق:</p>
                <ul className="list-disc list-inside space-y-2 pr-4 bg-brand-50 p-6 rounded-2xl">
                  <li>منهجية بحثية واضحة،</li>
                  <li>نطاق محدد،</li>
                  <li>ومعالجة توثيقية متخصصة.</li>
                </ul>
              </div>
            </section>

            <section id="why-different" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-brand-500 shrink-0" /> لماذا هذا السجل مختلف؟
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>الاختلاف لا يكمن في حجم السجل أو عدد الأسماء الواردة فيه، بل في طريقة التعامل مع المعرفة النسبية ذاتها.<br/>يعتمد «سجل تراث العائلة» على:</p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                  <li>توثيق عمود نسب واحد واضح ومحدد.</li>
                  <li>الفصل بين الرواية والتوثيق.</li>
                  <li>الاعتماد على مصادر ومراجع قابلة للمراجعة.</li>
                  <li>تقديم السجل ضمن قالب بحثي وفني متوازن.</li>
                </ul>
                <p className="mt-4 font-medium pt-2 border-t border-brand-100">نحن لا نقدم مشجرة واسعة بلا معايير، بل سجلًا يُبنى على الوضوح والدقة والمنهجية.</p>
              </div>
            </section>

            <section id="methodology" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-brand-500 shrink-0" /> المنهجية المعتمدة
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-6">
                <p>تستند منهجية إعداد السجل إلى مبادئ البحث التوثيقي المعتمدة في الدراسات التاريخية والنسبية.<br/><strong className="text-brand-900 text-xl block mt-4 mb-2">مراحل العمل</strong></p>
                <div className="space-y-4">
                  <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 group hover:shadow-md transition">
                    <h3 className="font-bold text-brand-900 mb-1 text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">١</div> تحديد نقطة البداية</h3>
                    <p className="pr-8 text-brand-700">اعتماد نقطة العرض الأساسية التي يُبنى عليها عمود النسب.</p>
                  </div>
                  <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 group hover:shadow-md transition">
                    <h3 className="font-bold text-brand-900 mb-1 text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٢</div> جمع الروايات والبيانات</h3>
                    <p className="pr-8 text-brand-700">جمع الروايات والمعطيات من أمين السجل بوصفه المرجع الأساسي للمشروع.</p>
                  </div>
                  <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 group hover:shadow-md transition">
                    <h3 className="font-bold text-brand-900 mb-1 text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٣</div> البحث والتحليل</h3>
                    <p className="pr-8 text-brand-700">مراجعة المصادر والمراجع وتحليل الروابط النسبية وفق المعطيات المتاحة.</p>
                  </div>
                  <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 group hover:shadow-md transition">
                    <h3 className="font-bold text-brand-900 mb-1 text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٤</div> بناء عمود النسب</h3>
                    <p className="pr-8 text-brand-700">ربط طبقات الامتداد العائلي ضمن إطار بحثي واضح.</p>
                  </div>
                  <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 group hover:shadow-md transition">
                    <h3 className="font-bold text-brand-900 mb-1 text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-sm">٥</div> إعداد السجل النهائي</h3>
                    <p className="pr-8 text-brand-700">إخراج السجل ضمن وثيقة عائلية تجمع البحث التاريخي والتصميم الأنيق.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="content-model" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <LayoutList className="w-8 h-8 text-brand-500 shrink-0" /> نموذج لمحتوى السجل
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-6">
                <p>يصدر "سجل تراث العائلة" ضمن عدة أقسام مترابطة تشكل البنية المعرفية للسجل، وهنا نموذج لمحتوى سجل يتضمن أهم الأقسام الرئيسية :</p>
                
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-200 shadow-sm space-y-8">
                  <div>
                    <h3 className="font-bold text-brand-900 text-xl border-b border-brand-100 pb-2 mb-3">التقديم العام</h3>
                    <p>مقدمة تعريفية بالسجل ونقطة العرض الأساسية والامتداد النسبي المرتبط بالعائلة.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xl border-b border-brand-100 pb-2 mb-3">السجل النسبي</h3>
                    <p>القسم البحثي الرئيسي في السجل، ويتضمن:</p>
                    <ul className="space-y-2 mt-3 pr-4">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> مفاتيح السجل النسبي.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> عمود النسب.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> فروع العائلة الرئيسية.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> الانتساب الموروث.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> تراجم العقد النسبية.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> توثيق المصادر والمراجع.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xl border-b border-brand-100 pb-2 mb-3">عمود النسب</h3>
                    <p>القسم المركزي في السجل، ويشمل: طبقات الامتداد النسبي، العلاقات بين الأجيال، توثيق التسلسل النسبي، والمراجع المرتبطة بكل طبقة من طبقات العمود.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xl border-b border-brand-100 pb-2 mb-3">توثيق المصادر والمراجع</h3>
                    <p>يتضمن: مصادر العقد النسبية، المراجع التاريخية، تراجم الشخصيات الواردة في السجل، والوثائق المتاحة المرتبطة بالبحث.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xl border-b border-brand-100 pb-2 mb-3">مساحة الإدراج الاختياري</h3>
                    <p>يوفر السجل مساحة اختيارية تتيح لأمين السجل إضافة بعض المواد العائلية الخاصة التي تضيف بعدًا إنسانيًا وتاريخيًا للسجل. وقد تشمل:</p>
                    <ul className="space-y-2 mt-3 pr-4">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> كلمة خاصة للعائلة.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> نبذة تاريخية عن العائلة.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> صورًا ووثائق مختارة.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> بعض الروايات أو القصص العائلية.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> معلومات مرتبطة ببعض أفراد العائلة.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xl border-b border-brand-100 pb-2 mb-3">إبقاء السجل حيًا</h3>
                    <p>يتيح هذا القسم:</p>
                    <ul className="space-y-2 mt-3 pr-4">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> الوصول إلى النسخة الرقمية،</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> تحديث البيانات،</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> إصدار نسخ إضافية،</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> وربط السجل برمز QR للقراءة الرقمية.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div> خدمة الأبحاث المتقدمة "فتح الأبواب المغلقة" ، بناءاً على توصيات فريق البحث بعد اصدار السجل الأساسي.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="basic-edition" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-brand-500 shrink-0" /> الإصدار الأساسي
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>يمثل «الإصدار الأساسي» المرحلة الجوهرية في رحلة التوثيق، وهو العمل الذي يتم خلاله توثيق عمود النسب وإعداد السجل الأساسي للعائلة.</p>
                <p>ويُعد هذا الإصدار القاعدة التي يمكن البناء عليها مستقبلًا في حال الحاجة إلى مسارات بحثية إضافية أو أبحاث متقدمة.</p>
              </div>
            </section>

            <section id="advanced-research" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-brand-500 shrink-0" /> البحث المتقدم
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>في بعض الحالات، قد يقترح فريق البحث مسارات إضافية لتعميق التوثيق أو معالجة بعض الجوانب التي تحتاج إلى أعمال بحثية متقدمة.</p>
                <p>وتشمل هذه المسارات — عند الحاجة — أنواعًا متخصصة من البحث، مثل:</p>
                <ul className="list-disc list-inside space-y-2 pr-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <li>البحث في الوثائق والسجلات الرسمية.</li>
                  <li>البحث في الأرشيفات التاريخية.</li>
                  <li>دراسة بعض القرائن المرتبطة بالبحث.</li>
                  <li>تحليل وتفسير نتائج الحمض النووي وربطها بالسياق النسبي.</li>
                </ul>
                <p>ويتم تقديم أي توصيات بحثية متقدمة بعد صدور الإصدار الأساسي من السجل.</p>
              </div>
            </section>

            <section id="what-is-included" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-brand-500 shrink-0" /> ما الذي يشمله السجل؟
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-8">
                
                <div className="bg-brand-50 p-6 md:p-8 rounded-3xl border border-brand-100 shadow-sm">
                   <h3 className="font-bold text-brand-900 text-2xl mb-4 border-b border-brand-100 pb-3 font-serif">يشمل الإصدار الأساسي من «سجل تراث العائلة»:</h3>
                   <ul className="space-y-3 pr-4 text-brand-800 font-medium">
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> البحث العلمي والتاريخي المتخصص.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> توثيق عمود النسب.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> توثيق المصادر والمراجع.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> توثيق تراجم الشخصيات الواردة في عمود النسب.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> مواءمة مواد الإدراج الاختياري ضمن السجل.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> التصميم والإخراج الفني الاحترافي.</li>
                   </ul>
                   <h3 className="font-bold text-brand-900 mt-8 mb-4 border-b border-brand-100 pb-3 text-xl font-serif">ويتم تسليم العمل عبر:</h3>
                   <ul className="space-y-3 pr-4 text-brand-800 font-medium">
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> نسخة رقمية إلكترونية.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> 10 نسخ مطبوعة بإخراج أنيق.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> بوستر لمخطط عمود النسب.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> حافظة أنيقة للبوستر.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" /> شحن الباقة.</li>
                   </ul>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-brand-100 mt-8 shadow-sm">
                   <h3 className="font-bold text-brand-900 text-2xl mb-4 border-b border-brand-100 pb-3 font-serif">ما الذي لا يشمله السجل؟</h3>
                   <p className="mb-4 text-brand-800 font-medium">يركز الإصدار الأساسي على توثيق عمود النسب ضمن النطاق المتفق عليه. ولذلك، لا يشمل:</p>
                   <ul className="space-y-3 pr-4 text-brand-800">
                      <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2.5 rounded-full bg-red-400 shrink-0"></div> تشجير العائلة الموسع.</li>
                      <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2.5 rounded-full bg-red-400 shrink-0"></div> التوسع خارج نطاق عمود النسب المتعاقد عليه.</li>
                      <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2.5 rounded-full bg-red-400 shrink-0"></div> أعمال الحمض النووي أو تفسيرها ضمن الإصدار الأساسي.</li>
                      <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2.5 rounded-full bg-red-400 shrink-0"></div> الأبحاث المتقدمة في الأرشيفات الحكومية والتاريخية.</li>
                   </ul>
                   <p className="mt-6 text-brand-900 font-medium p-4 bg-brand-50 rounded-xl border border-brand-100 shadow-sm border-r-4 border-r-brand-400">وفي حال الحاجة إلى أي أعمال بحثية إضافية، فقد يقترح فريق البحث مسارات متقدمة مستقلة بعد صدور الإصدار الأساسي.</p>
                </div>

                <div className="mt-8 rounded-[2rem] overflow-hidden shadow-lg border border-brand-100 bg-white p-2">
                  <img src="https://i.postimg.cc/13fQKqzZ/img1.png" alt="مخطط السجل" className="w-full h-auto object-cover rounded-2xl" />
                </div>
              </div>
            </section>

            <section id="curator" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-brand-500 shrink-0" /> أمين السجل
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>يعتمد المشروع على أمين سجل واحد يمثل المرجع الأساسي للمشروع، ويعتبر "العميل" هو أمين السجل ونقطة العرض الأساسية لعمود النسب ويتولى:</p>
                <ul className="list-disc list-inside space-y-2 pr-4 bg-brand-50 p-6 rounded-2xl border border-brand-100 font-medium">
                  <li>تقديم البيانات الأولية،</li>
                  <li>متابعة مراحل العمل،</li>
                  <li>التواصل مع فريق البحث،</li>
                  <li>وإدارة الإدراجات المرتبطة بالسجل.</li>
                </ul>
                <p>ويهدف ذلك إلى الحفاظ على دقة المعلومات واستقرار مسار التوثيق.</p>
              </div>
            </section>

            <section id="timeline" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4 flex items-center gap-3">
                <Clock className="w-8 h-8 text-brand-500 shrink-0" /> مدة العمل
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>تختلف مدة إعداد السجل بحسب: طبيعة البحث، توفر المصادر والروايات، نطاق المعالجة، ومستوى استكمال البيانات المطلوبة.</p>
                <div className="bg-brand-50 p-8 flex flex-col items-center justify-center rounded-3xl border border-brand-100 shadow-inner mt-6 max-w-sm mx-auto">
                  <span className="text-xl font-bold text-brand-900 mb-3 text-center">وعادةً ما تتراوح مدة إعداد السجل بين:</span>
                  <span className="text-4xl text-brand-600 mb-4 font-mono font-bold" dir="rtl">٩٠ - ١٨٠ <span className="text-2xl font-sans">يوماً</span></span>
                  <span className="text-sm font-medium text-brand-700 bg-white px-4 py-2 rounded-lg shadow-sm">بحسب طبيعة المشروع</span>
                </div>
              </div>
            </section>

            <section id="privacy" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-4 flex items-center gap-3">
                <Lock className="w-8 h-8 text-brand-500 shrink-0" /> الخصوصية وحماية البيانات
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>نتعامل مع جميع البيانات والوثائق المقدمة عبر المنصة بسرية وخصوصية عالية.</p>
                <p>كما تخضع أعمال المعالجة والتوثيق لمعايير حماية البيانات والخصوصية المعمول بها، بما يشمل القوانين الأمريكية ومعايير الخصوصية الدولية ذات الصلة.</p>
              </div>
            </section>

            <section id="investment" className="mt-16 pt-16 border-t border-brand-100 scroll-mt-32">
              <div className="bg-[#fef1f2] rounded-[2rem] p-6 lg:p-12 shadow-sm border border-[#fbd3d5] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://i.postimg.cc/wMpkC5mC/Pic-Pattern.png')] opacity-[0.03] mix-blend-multiply"></div>
                <div className="relative z-10 w-full">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl lg:text-4xl font-serif font-bold mb-6 text-brand-900 text-center">الاستثمار في حفظ إرث العائلة</h3>
                    <div className="inline-block bg-white px-8 py-5 rounded-3xl border border-[#fbd3d5] shadow-sm max-w-full">
                      <div className="text-5xl lg:text-6xl font-bold text-brand-600 font-mono mb-2" dir="rtl">١،٩٨٠ دولار</div>
                      <p className="text-brand-700 text-base lg:text-lg font-medium px-2">يشمل الإصدار الأساسي من "سجل تراث العائلة"</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-[#fbd3d5] mb-10 w-full max-w-3xl mx-auto shadow-sm text-right">
                    <h4 className="font-bold text-2xl mb-6 font-serif text-brand-900 text-center border-b border-brand-100 pb-4">خيارات تنفيذ المشروع</h4>
                    
                    <div className="space-y-4 w-full">
                      <div className="bg-[#fef1f2] p-4 lg:p-5 rounded-2xl border border-[#fbd3d5] transition-colors hover:bg-[#fae1e3] cursor-pointer overflow-hidden" onClick={() => setShowFullPaymentInfo(!showFullPaymentInfo)}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                             <div className="bg-white p-2 lg:p-3 rounded-full shrink-0 shadow-sm border border-[#fbd3d5]">
                               <Sparkles className="text-brand-500 w-5 h-5 lg:w-6 lg:h-6"/>
                             </div>
                             <span className="font-bold text-base lg:text-lg text-brand-900 leading-tight">امتيازات للمشاريع المسددة قبل المعالجة!</span>
                          </div>
                          <ChevronDown className="w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto" />
                        </div>
                        <AnimatePresence>
                          {showFullPaymentInfo && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="mt-6 pt-2 space-y-4 text-center">
                                <div className="text-lg lg:text-xl text-center mb-4 bg-white rounded-xl py-4 border border-[#fbd3d5] shadow-sm mx-auto max-w-xs">
                                   قيمة السداد المبكر: <br/><span className="font-bold text-brand-600 font-mono text-3xl block mt-2" dir="ltr">١،٧٨٠ دولار</span>
                                </div>
                                <p className="text-sm lg:text-base text-brand-800 bg-white p-5 rounded-xl leading-relaxed text-right border-r-4 border-r-brand-400 w-full shadow-sm">
                                  تتضمن الامتيازات اولوية الجدولة لمراحل البحث والتوثيق والتسليم باللإضافة الي التوصيل السريع.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="bg-[#fef1f2] p-4 lg:p-5 rounded-2xl border border-[#fbd3d5] transition-colors hover:bg-[#fae1e3] cursor-pointer overflow-hidden" onClick={() => setShowFlexiblePaymentInfo(!showFlexiblePaymentInfo)}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                             <div className="bg-white p-2 lg:p-3 rounded-full shrink-0 shadow-sm border border-[#fbd3d5]">
                               <Coins className="text-brand-500 w-5 h-5 lg:w-6 lg:h-6"/>
                             </div>
                             <span className="font-bold text-base lg:text-lg text-brand-900">خيار الدفع المرن</span>
                          </div>
                          <ChevronDown className="w-6 h-6 text-brand-500 shrink-0 self-end sm:self-auto" />
                        </div>
                        <AnimatePresence>
                          {showFlexiblePaymentInfo && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="mt-6 text-sm lg:text-base text-brand-800 bg-white p-6 rounded-xl space-y-4 shadow-sm text-right border-r-4 border-r-brand-400">
                                <p className="font-bold text-brand-900 border-b border-brand-100 pb-2 mb-4">يمكن توزيع قيمة المشروع على ٣ مراحل ميسرة:</p>
                                <ul className="space-y-4 font-medium">
                                  <li className="flex items-start gap-3"><div className="w-2 h-2 mt-2 bg-brand-400 rounded-full shrink-0"></div> دفعة أولى: 35% عند تفعيل الطلب – مرحلة البحث</li>
                                  <li className="flex items-start gap-3"><div className="w-2 h-2 mt-2 bg-brand-400 rounded-full shrink-0"></div> دفعة ثانية: 35% عند انتهاء مرحلة التوثيق</li>
                                  <li className="flex items-start gap-3"><div className="w-2 h-2 mt-2 bg-brand-400 rounded-full shrink-0"></div> دفعة ثالثة: 30% عند انتهاء العمل وتسليم السجل</li>
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="text-xs lg:text-sm text-brand-600 mt-8 pt-5 border-t border-[#fbd3d5] font-light leading-relaxed text-center">
                      * نقبل عددًا محدودًا من مشاريع التوثيق شهريًا حفاظًا على جودة البحث والتوثيق.<br/>
                      * تنطبق الشروط والأحكام على جميع الخدمات.
                    </div>
                  </div>

                  <div className="text-center pt-4 max-w-2xl mx-auto px-4">
                    <p className="text-brand-700 text-lg lg:text-xl mb-8 leading-relaxed font-light">
                      بعض الروايات تضيع… لأنها لم تُوثق.<br/>
                      <span className="font-bold text-brand-900 mt-1 block">ابدأ اليوم إنشاء سجل عائلي يوثق عمود نسبكم ويحفظ الذاكرة العائلية للأجيال القادمة.</span>
                    </p>
                    <Link to="/auth" className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-400 text-white text-xl lg:text-2xl px-12 py-5 lg:py-6 rounded-2xl font-bold transition shadow-[0_0_40px_-10px_rgba(185,28,34,0.3)] hover:shadow-[0_0_60px_-10px_rgba(185,28,34,0.5)] hover:-translate-y-1 w-full sm:w-auto">
                      ابدأ سجل عائلتك
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 left-8 bg-brand-600 text-white p-3 rounded-full shadow-lg hover:bg-brand-500 transition-colors z-50 focus:outline-none"
            aria-label="العودة للأعلى"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
