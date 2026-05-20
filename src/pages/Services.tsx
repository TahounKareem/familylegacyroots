import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, BookOpen, Layers, CheckCircle2, Bookmark, Info, Users, Image as ImageIcon, FileText } from "lucide-react";

export function Services() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: "memory", title: "ذاكرة العائلة" },
    { id: "what-is", title: "ما هو سجل تراث العائلة؟" },
    { id: "methodology", title: "المنهجية المعتمدة" },
    { id: "scope", title: "نطاق السجل" },
    { id: "role", title: "دور أمين السجل / العميل" },
    { id: "contents", title: "محتويات السجل" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Determine active section
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      let currentActive = "";
      
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-brand-50 min-h-screen pb-20 relative">
      {/* Hero Section */}
      <div className="bg-white py-16 mb-12 shadow-sm border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-6" />
          <h1 className="font-serif text-5xl font-bold text-brand-900 mb-6">سجل تراث العائلة</h1>
          <p className="text-xl text-brand-700 max-w-2xl mx-auto font-light">
            نوثق تاريخ وعراقة عائلتكم في قالب فني أنيق وإحترافي
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Index Sidebar (Sticky) */}
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
                          ? "text-brand-600 font-bold"
                          : "text-brand-700 hover:text-brand-500 font-medium"
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

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-100">
            
            {/* Section 1 */}
            <section id="memory" className="scroll-mt-32">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-brand-500" />
                ذاكرة العائلة
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>في الذاكرة الجمعية للعائلات، لا يُذكر النسب بوصفه معلومات، بل بوصفه امتداداً ، امتداد أسماء، وامتداد روايات، وامتداد شعور بالانتماء يتوارثه الناس كما يتوارثون الأسماء نفسها.</p>
                <p>غير أن الزمن لا يحفظ الروايات كما قيلت، بل كما أُعيد سردها، ومع مرور الأجيال، يصبح الأصل أقل وضوحًا، لا لغيابه، بل لتراكم ما فوقه.</p>
                <p>من هنا، لم يكن السؤال: كم نعرف؟ بل: كيف نُثبت ما نعرف؟ ولهذا، لم يُنشأ هذا العمل ليكون حكاية، ولا ليجمع كل ما يُقال، بل ليكون سجلًا.</p>
                <p>والسجل، في تقاليده الأقدم، لا يُكتب استعجالاً، ولا يُغلق ادّعاءً، بل يُبنى على ما أُتيح، ويُقدَّم بوصفه معرفة محكومة بزمنها ومنهجها.</p>
                <p>على هذا الأساس، يأتي "سجل تراث العائلة" بوصفه عملاً بحثياً يهدف إلى توثيق عمود نسب واحد صاعد، وفق ما تسمح به المصادر، وبما ينسجم مع أصول التوثيق العلمي.</p>
                <ul className="list-disc list-inside space-y-2 mt-4 pr-4">
                  <li>ليس طلبه الاتساع، بل الثبات.</li>
                  <li>وليس غايته الجمع فقط، بل الدقة التي يمكن البناء عليها مستقبلاً .</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="what-is" className="scroll-mt-32">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Info className="w-8 h-8 text-brand-500" />
                ما هو سجل تراث العائلة؟
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>سجل توثيق العائلة هو منتج بحثي يُعد في صيغة وثيقة مكتوبة ، يهدف إلى تنظيم المعرفة النسبية ضمن إطار محدد وواضح.</p>
                <p>يعتمد السجل على نقطة بدء معتمدة تمكنا من توثيق "عمود النسب" ، ويُبنى وفق تسلسل تصاعدي، مع الالتزام بما يتوافر من مصادر وبيانات قابلة للفحص والتحليل.</p>
                <p>لا يتعامل السجل مع المعرفة بوصفها تراكمًا مفتوحًا، بل بوصفها مادة تحتاج إلى:</p>
                <ul className="list-disc list-inside space-y-2 pr-4 bg-brand-50/50 p-4 rounded-xl">
                  <li>تحديد</li>
                  <li>تصنيف</li>
                  <li>وربط منهجي</li>
                </ul>
                <p>ويُنظر إلى السجل في صورته النهائية على أنه وثيقة مرجعية ضمن نطاقها، لا تمثّل كل ما يمكن معرفته، بل ما أمكن توثيقه على وجه مهني مسؤول.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="methodology" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Layers className="w-8 h-8 text-brand-500" />
                المنهجية المعتمدة
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-6">
                <p>تستند المنهجية المتبعة في إعداد السجل إلى مبادئ البحث التوثيقي المعتمدة في الدراسات التاريخية والنسبية. وتشمل هذه المنهجية، على وجه الخصوص:</p>
                <ul className="space-y-3 pr-4">
                  <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" /> تحديد نقطة بدء واضحة ومعتمدة لبدء توثيق عمود النسب .</li>
                  <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" /> جمع البيانات من مصدر مسؤول واحد (أمين السجل / العميل) .</li>
                  <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" /> الاستعانة بمصادر بحثية معتبرة و موثوقة .</li>
                  <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" /> تحليل الربط النسبي وفق ما تسمح به المعطيات.</li>
                  <li className="flex gap-3 items-start"><CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" /> صياغة النتائج في صورة وثيقة متماسكة.</li>
                </ul>
                <p>ويُراعى في جميع مراحل الإعداد الفصل بين:</p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                  <li>ما ثبت توثيقه</li>
                  <li>ما يرد بوصفه رواية</li>
                  <li>وما لم تتوافر له قرائن كافية</li>
                </ul>
                <p>ويُعد هذا الفصل عنصراً جوهرياً في سلامة السجل وقابليته للاعتماد.</p>
                
                <h3 className="font-serif text-2xl font-bold text-brand-900 mt-10 mb-4">لماذا هذا السجل مختلف؟</h3>
                <p>لا يتمثّل الاختلاف في الشكل أو الحجم، بل في طريقة التعامل مع المعرفة ذاتها. فالسجل لا يُقاس بعدد الأسماء التي يتضمنها، بل بوضوح المعايير التي أُدرجت بها تلك الأسماء.</p>
                <p>إن قيمة هذا العمل تكمن في كونه يقدّم معرفة محددة النطاق، موثقة بقدر ما أُتيح لها، وقابلة للفهم والمراجعة في سياقها الصحيح.</p>
                <p>ومن هذا المنطلق، يُنظر إلى السجل لا بوصفه نهاية، بل بوصفه أساسًا معرفيًا يمكن البناء عليه في مراحل لاحقة، ضمن أطر واضحة ومستقلة.</p>

                <h3 className="font-serif text-2xl font-bold text-brand-900 mt-10 mb-4">كيف يُنشأ السجل؟</h3>
                <p>لا يُنشأ السجل دفعة واحدة، ولا يُكتب بوصفه نتيجة فورية، بل يُبنى بناءاً على عدة اعتبارات، كما تُبنى الأعمال التي يُراد لها البقاء.</p>
                <p>تبدأ العملية بتحديد نقطة البدء، وهي النقطة التي يُبنى عليها عمود النسب، ويُعتمد فيها مرجع واحد مسؤول عن تقديم البيانات الأولية ممثلة في شخص (أمين السجل/العميل) .</p>
                <p>بعد ذلك، تُجمع المعطيات المتاحة، وتُقابل بما يمكن الرجوع إليه من مصادر، ويُحلَّل الربط النسبي ضمن ما يسمح به المنهج.</p>
                <p>وفي المرحلة الأخيرة من هذا السجل الأساسي، تُصاغ النتائج في صورة سجل مكتوب، يُقدَّم بوصفه وثيقة توثيقية تعكس ما أمكن إثباته.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="scope" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-brand-500" />
                نطاق السجل
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-8">
                
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">البحث العلمي والتوثيق:</h3>
                  <p>يقوم سجل توثيق العائلة على توثيق عمود نسب واحد صاعد، يبدأ من نقطة محددة – يحددها امين (السجل/العميل) كأحد اجداده الذين يختارهم على سبيل المثال - ، ويُبنى تسلسلياً وفق ما يتاح من معطيات.</p>
                  <p className="mt-4">هذا التحديد ليس خياراً شكلياً ، بل هو ما يمنح السجل:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2 pr-4">
                    <li>تماسكه</li>
                    <li>قابليته للفهم</li>
                    <li>وصلاحيته كمرجع</li>
                  </ul>
                  <p className="mt-4 text-brand-600 bg-brand-50 p-4 rounded-xl border border-brand-100">ويُعتمد هذا النطاق كاملاً قبل بدء العمل البحثي، وفق شروط وأحكام عقد تقديم الخدمة.</p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">عمود النسب (نقطة البدء):</h3>
                  <p>يقوم السجل على عنصر أساسي وهو توثيق عمود نسب أمين السجل / العميل ، ويمكن لأمين السجل إختيار أحد اسلافه (المشهورين) بدءاً من الأب او أحد الأجداد الذين يختارهم لبدء توثيق عمود النسب ، وبالطبع سيتم سرد سلسلة النسب التي تشمل أمين السجل / العميل تصاعدياً مروراً بنقطة البدء التي اختارها .</p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">السجل الأساسي:</h3>
                  <p>نقدم خدمات توثيق الأنساب " عمود النسب" وفق نموذج مرحلي يبدأ بخدمة أساسية إلزامية وهي خدمة اصدار السجل الأساسي "سجل تراث العائلة" .</p>
                  <p>يعتبر هذا الأصدار من "سجل تراث العائلة" هو السجل الأساسي ، وهو العمل الجوهري الذي تكون من خلالة رحلة توثيق عمود النسب ، وبعد صدور هذا السجل الأساسي ، قد يقترح فريق البحث بعض التوصيات في بعض الحالات التي لاتتوفر فيها مصادر كافية أو يحتاج البحث الى بحث متقدم من نوع آخر ، وهنا تأتي خدمة "فتح الأبواب المغلقة" لتفتح ابواباً آخرى من البحث عند رغبة (أمين السجل/العميل) في ذلك .</p>
                </div>

                <div className="bg-brand-50 rounded-2xl p-6 border border-brand-200">
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">خدمة فتح الأبواب المغلقة:</h3>
                  <p>خدمة اختيارية تُقدَّم بعد تثبيت الأصل، وتهدف إلى تعميق التوثيق عبر أدوات بحث متقدمة، تُفعّل جزئيًا أو كليًا حسب مقتضيات البحث العلمي .</p>
                  <h4 className="font-bold text-brand-900 mt-6 mb-2">كيف تعمل خدمة فتح الأبواب المغلقة</h4>
                  <p>بعد الإنتهاء من مرحلة إصدار السجل الأساسي والذي فيه يتم تثبيت الأصل ، يتم — عند الرغبة — فتح الأبواب المغلقة للبحث المتقدم.</p>
                  <p className="mt-4 font-bold text-brand-900">تشمل خدمة "فتح الأبواب المغلقة" على انواع من البحوث المتخصصة والمعمقة ، من أجل فتح بعض الأبواب المغلقة والتي ابرزها الأصدار الأساسي للسجل ، وقد تكون على سبيل المثال أحد هذه الأنواع من الأعمال البحثية:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2 pr-4">
                    <li>البحث في الوثائق والسجلات الرسمية.</li>
                    <li>البحث في الأراشيف الحكومية التاريخية.</li>
                    <li>تفسير نتائج الحمض النووي وربطها بالسياق النسبي</li>
                  </ul>
                  <div className="mt-4 p-4 bg-white rounded-xl border border-brand-100 text-sm">
                    <strong>ملحوظة:</strong> سيتم تقديم توصيات علمية من فريق البحث حول إمكانية توسيع البحث المتقدم وذلك عبر المنصة بعد صدور سجل تراث العائلة – السجل الأساسي الخاص بكم .
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">الإدراج الإختياري:</h3>
                  <p>قسم الإدراج الإختياري هو القسم الذي يقدمه (أمين السجل / العميل) – عند رغبته – ليكون أحد أقسام السجل الأساسي ويسمى هذا القسم (بين يدي السجل ) من أجل جعل السجل أكثر خصوصية للعائلة والذي قد يشمل على سبيل المثال مايلي:</p>
                  <ul className="space-y-3 mt-4 pr-4">
                    <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2 rounded-full bg-brand-400 shrink-0"></div> <strong>كلمة لأمين السجل / العميل.</strong></li>
                    <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2 rounded-full bg-brand-400 shrink-0"></div> <strong>نبذة تاريخية عن العائلة.</strong></li>
                    <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2 rounded-full bg-brand-400 shrink-0"></div> <strong>مشجر الأحياء:</strong> ويقصد بها المشجرة التي يقوم (امين السجل / العميل ) بإدراجها عبر المنصة ، وينحصر التشجير في ذرية أمين السجل /العميل أو والده أو الجد المباشر فقط ولايشمل تشجير ذرية الأعمام .</li>
                    <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2 rounded-full bg-brand-400 shrink-0"></div> <strong>الصور:</strong> يمكن لأمين السجل /العميل إدراج صور لأفراد العائلة مثل ( صور الأشخاص المدرجين ضمن مشجر الأحياء ، او صور بقية الأشخاص في عمود النسب الصاعد فقط .</li>
                    <li className="flex gap-3 items-start"><div className="w-2 h-2 mt-2 rounded-full bg-brand-400 shrink-0"></div> <strong>الوثائق:</strong> يمكن ادراج اي وثائق يرغب أمين السجل / العميل في ادراجها.</li>
                  </ul>
                  <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100 text-sm">
                    <strong>ملحوظة:</strong> يتعين أن تكون الصور والوثائق المدرجة ذات علاقة بالسجل ويتم إدراجها على مسؤلية أمين السجل / العميل الخاصة ، كما هو منصوص عليه في عقد تقديم الخدمة .
                  </div>
                  <div className="mt-4 p-4 bg-white shadow-sm rounded-xl border border-brand-100">
                    <strong className="text-brand-900 block mb-2">الخصوصية:</strong>
                    <p className="text-sm">جميع الإدراجات المقدمة من أمين السجل / العميل يتم التعامل معها بخصوصية وسرية تامة ، عبر المنصة ، والتي تحضى بأعلى معايير الأمان التقني والتشفير ، كما اننا نأخذ مسائل الخصوصية والإمتثال للقوانين الخاصة بالخصوصية وسرية البيانات بجدية تامة وتخضع أعمالنا البحثية لمعايير حماية الخصوصية وسرية البيانات كما تنص عليه القوانين الأمريكية ، وقوانين الخصوصية وسرية البيانات (GDPR ) الأوربية ، والقوانين المحلية الأخرى المرعية في معالجة البيانات.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-brand-100">
                  <div className="bg-white p-6 rounded-2xl border border-brand-200">
                    <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">مدة العمل:</h3>
                    <p>يتم عمل البحث خلال مدة لاتتجاوز 90 يوماً تبدأ من تاريخ الإشتراك في الباقة ، وحسب ما تنص عليه شروط وأحكام عقد تقديم الخدمة.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-brand-200">
                    <h3 className="font-serif text-xl font-bold text-brand-900 mb-3">شروط وأحكام الخدمة:</h3>
                    <p>يتضمن عقد الخدمة الموقع من قبل العميل شروط وأحكام الخدمة بالتفصيل ، ويعتبر العقد هو المرجع في تقديم هذه الخدمة ، وننصح العميل بقراءة الشروط والأحكام بعناية .</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-6">ما الذي يشمله السجل الأساسي / وما الذي لا يشمله؟</h3>
                  
                  <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 mb-6">
                    <h4 className="font-bold text-green-800 text-xl mb-4">مايشتمل عليه السجل الأساسي:</h4>
                    <p className="mb-4">لا يُقاس السجل بما يستوعبه، بل بما يُحسن تنظيمه، لذلك، يركّز هذا العمل على ما يمكن تثبيته ضمن المسار المعتمد، ويُبقي ما عدا ذلك خارج نطاق الإصدار الأساسي، وهذا السجل الأساسي يشمل الأعمال والمخرجات التالية:</p>
                    <ul className="space-y-3 pr-4 text-green-900">
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> عمل البحث العلمي والتاريخي المتخصص .</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> توثيق خط نسب أمين السجل /العميل "عمود النسب ".</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> توثيق المصادر والمراجع للعُقَد النسبية .</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> توثيق المصادر والمراجع لتراجم الأعلام "السير الذاتية".</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> تنسيق وموائمة مواد قسم الإدراج الإختياري الخاص بأمين السجل / العميل ، مع بقية الأقسام.</li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> أعمال التصميم والإخراج الفني المحترف.</li>
                      <li className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> 
                        <div>
                          <strong>تسليم العمل "سجل تراث العائلة" على شكل المخرجات التالية:</strong>
                          <ul className="list-disc list-inside mt-2 pr-4 space-y-1">
                            <li>نسخة رقمية "الكترونية"</li>
                            <li>عدد 10 نسخ ورقية مطبوعة بشكل أنيق .</li>
                            <li>بوستر مشجر عمود النسب الشامل .</li>
                          </ul>
                        </div>
                      </li>
                      <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> تكاليف الشحن للباقة .</li>
                    </ul>
                  </div>

                  <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-red-800 text-xl mb-4">مالايشتمل عليه السجل:</h4>
                    <p className="text-red-900 leading-relaxed mb-4">لاتشمل أعمال السجل الأساسي أي اعمال خارج النطاق المذكور اعلاه ، لايمكن توسعة البحث خارج النطاق المتعاقد عليه ، لايشمل تشجير العائلة او اي طبقة من طبقات النسب ، لايشمل اعمال فحص او تفسير الحمض النووي ، او البحوث المتقدمة في الأراشيف الحكومية او غيرها .</p>
                    <div className="bg-white p-4 rounded-xl border border-red-200 text-sm text-brand-800">
                      <strong>ملحوظة:</strong> عند حاجة العمل الي اي من الأعمال البحثية المتقدمة ، فسوف يقترح ويوصي فريق البحث بما هو مفيد ومنتج لعمل بحث متقدم عبر خدمة "فتح الأبواب المغلقة" لكن بعد صدور السجل الأساسي الذي هو القاعدة الأساسية لأي اعمال بحث موسع ومتقدم .
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 5 */}
            <section id="role" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-brand-500" />
                دور أمين السجل / العميل
              </h2>
              <div className="text-brand-800 leading-relaxed font-light text-lg space-y-4">
                <p>في السجلات، لا تُبنى المعرفة على تعدد الأصوات، بل على وضوح المرجع. لهذا، يُعتمد في هذا العمل أمين سجل واحد، يكون نقطة البدء في عمود النسب، والمرجع المسؤول عن تقديم البيانات والتواصل ويعني أن العمل يُدار عبر قناة واضحة، تحفظ دقة المعلومات واستقرار مسار التوثيق.</p>
                <div className="bg-brand-50 p-6 rounded-2xl mt-6 border border-brand-100">
                  <h3 className="font-bold text-brand-900 mb-3 text-xl">مسؤلية أمين السجل / العميل:</h3>
                  <p>سيكون أمين السجل / العميل مسؤلاً عن التعاقد مع شركتنا ، وسيكون المصدر الوحيد المخول بتقديم البيانات عبر المنصة الكترونياً وحصرياً ، والتي تتيح له رفع وتبادل البيانات بخصوصية وسرية تامة ، وسيكون مسؤلاً عن صحة البيانات المقدمة من قبله وعن مراعاته للحقوق والخصوصية وسرية البيانات للأشخاص الذين يريد إدراجهم في السجل ، وفق ما ينص عليه عقد تقديم الخدمة .</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="contents" className="scroll-mt-32 border-t border-brand-100 pt-16">
              <h2 className="font-serif text-3xl font-bold text-brand-900 mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-brand-500" />
                محتويات السجل
              </h2>
              <p className="text-brand-800 leading-relaxed font-light text-lg mb-8">
                يخرج السجل الأساسي " سجل تراث العائلة" على شكل كتاب أنيق ، فيه توثيق لعمود النسب بالاضافة الى تاريخ ومآثر العائلة ، مقسم الي عدة أقسام كمايلي:
              </p>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-200 text-brand-500 flex items-center justify-center font-serif text-xl font-bold shrink-0 mt-1">1</div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-900 mb-2">تقديم عام</h3>
                    <p className="text-brand-700 leading-relaxed text-lg font-light">عبارة عن مقدمه عامة يتم فيها إستهلال سجل تراث عائلتكم ، وتحديد نقطة بدء عمود نسبكم والإنتساب الذي ينتمي اليه أمين السجل / العميل.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-200 text-brand-500 flex items-center justify-center font-serif text-xl font-bold shrink-0 mt-1">2</div>
                  <div className="w-full">
                    <h3 className="font-serif text-2xl font-bold text-brand-900 mb-4">السجل النسبي</h3>
                    <p className="text-brand-700 leading-relaxed text-lg font-light mb-4">هنا يكمن البحث العلمي والعمود الفقري لسجل تراث العائلة ، حيث يتم توثيق الإنتساب وتشجير توثيق عمود نسب أمين السجل ، بالتفصيل وعبر البحث العميق ، سيتم فيه عرض مايلي :</p>
                    <ul className="list-disc list-inside space-y-2 pr-4 text-brand-800 font-medium mb-6">
                      <li>مفاتيح السجل النسبي.</li>
                      <li>فروع العائلة الرئيسية .</li>
                      <li>قسم الإنتساب الموروث (الإلتقاء النسبي).</li>
                      <li>قسم عمود النسب الموروث (العمود، وتراجم العقد النسبية).</li>
                      <li>قسم عمود النسب التراثي (العمود، وتراجم العقد النسبية).</li>
                      <li>قسم عمود النسب التاريخي القديم (العمود، وتراجم العقد النسبية).</li>
                      <li>توثيق المصادر والمراجع المعتمدة (مصادر العقد، منابع التراجم، والوثائق).</li>
                      <li>بوستر مشجر توثيق عمود نسب أمين سجل العائلة .</li>
                    </ul>
                    <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 text-sm text-brand-700">
                      <strong>ملحوظة:</strong> قد تتغير نقاط ومحتويات السجل النسبي من سجل لآخر بناءا على توفر المصادر ونتائج البحث .
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-200 text-brand-500 flex items-center justify-center font-serif text-xl font-bold shrink-0 mt-1">3</div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-900 mb-2">ابق سجلك حياً</h3>
                    <p className="text-brand-700 leading-relaxed text-lg font-light">في هذا القسم كل ماتحتاجه لجعل سجلك حياً ، حيث ستتعرف فيه على طريقة الحصول على سجلك بصيغة رقمية ، وربط السجل برمز استجابة سريع (QR Code) لتسهيل قراءته الكترونياً أو طباعة نسخ إضافية أخرى ، بالاضافة الى معرفة طريقة التصويبات والتحديثات ليكون سجلك دائماً محدثاً وحياً بكل يسر وسهولة.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-200 text-brand-500 flex items-center justify-center font-serif text-xl font-bold shrink-0 mt-1">4</div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-900 mb-2">مساحة الإدراج الإختياري الخاصة بكم</h3>
                    <p className="text-brand-500 font-medium mb-3">تحت مسمى "بين يدي السجل" ( من إعداد أمين السجل / العميل)</p>
                    <p className="text-brand-700 leading-relaxed text-lg font-light mb-4">هذا القسم يعتبر مساحة خاصة بكم ، يقوم فيها (أمين السجل/العميل) - عند رغبته - بكتابة أو إدراج مايرغب في اضافته للسجل ، وعلى سبيل المثال : يمكن لأمين السجل/العميل ؛ كتابة مقدمة يخاطب فيها عائلته ، وكذلك يمكنه اضافة نبذة تاريخية قصيرة عن العائلة وايراد بعض القصص عن العائلة يتحدث فيها عن عادات ومآثر العائلة ؛ او عن سير اي شخصيات بارزة فيها ؛ كما يمكنه اضافة اي وثائق او صور لأفراد العائلة والشهادات التاريخية وغيرها، كل ذلك بخصوصية وموثوقية عبر حسابه المنشأ في المنصة .</p>
                    <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 text-sm text-brand-700">
                      <strong>ملحوظة:</strong> هذا القسم إختياري ( ننصح به لجعل سجلكم أكثر غنىً وثراءاً ، تنطبق الشروط والأحكام الواردة في عقد تقديم الخدمة على مساحة الإدراج الإختياري ).
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Box CTA */}
            <div className="mt-16 pt-16 border-t border-brand-100">
              <div className="bg-brand-950 text-white rounded-[2rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://i.postimg.cc/wMpkC5mC/Pic-Pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold mb-4">باقة السجل الأساسي</h3>
                  <div className="flex flex-col items-center justify-center gap-2 mb-4">
                    <div className="text-5xl font-bold text-brand-400 font-mono">$1780 <span className="text-xl text-brand-300 font-sans font-normal">(دفع كامل)</span></div>
                    <div className="text-2xl font-bold text-brand-200 font-mono">أو 3 دفعات ميسرة <span className="text-lg text-brand-300 font-sans font-normal">(إجمالي 1980$)</span></div>
                  </div>
                  <p className="text-brand-200 text-lg mb-8 max-w-lg mx-auto">للقيمة الأساسية للإصدار الرقمي، يقدم حالياً متضمناً طباعة 10 نسخ ورقية أنيقة + بوستر مشجر عمود النسب.</p>
                  
                  <div className="bg-brand-900/50 rounded-2xl p-6 border border-brand-800 text-right max-w-xl mx-auto mb-10">
                    <h4 className="font-bold text-xl mb-4 font-serif text-brand-300 border-b border-brand-800 pb-3">في "سجل تراث العائلة" تحصل على:</h4>
                    <ul className="space-y-3 text-brand-100">
                      <li>✓ بحث علمي وتاريخي</li>
                      <li>✓ توثيق خط نسب محدد "عمود النسب"</li>
                      <li>✓ توثيق المصادر والمراجع للعقد النسبية والسير الذاتية</li>
                      <li>✓ بوستر مشجر عمود النسب</li>
                      <li>✓ تصدر في نسخة رقمية وورقية أنيقة</li>
                      <li>✓ مدة الإنجاز والتسليم: خلال 90 يوماً</li>
                      <li className="text-brand-400 text-sm font-light mt-4">- تنطبق الشروط والأحكام على الخدمة.</li>
                    </ul>
                  </div>

                  <Link to="/order" className="inline-block bg-brand-500 hover:bg-brand-400 text-white text-xl px-12 py-5 rounded-xl font-bold transition shadow-xl hover:shadow-brand-500/20 hover:-translate-y-1">
                    إبدأ رحلة توثيق سجل تراثك
                  </Link>
                </div>
              </div>
            </div>

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

