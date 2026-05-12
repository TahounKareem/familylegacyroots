import { ShieldCheck, EyeOff } from "lucide-react";
import { LegalDocument } from "../../pages/Legal";

export const privacyAr: LegalDocument = {
  title: "سياسة الخصوصية وسرية البيانات",
  version: "1.0",
  effectiveDate: "11 مايو 2026",
  lastUpdated: "11 مايو 2026",
  sections: [
    {
      id: "assurance-1",
      title: "خصوصيتك في أمان… وثقتك مسؤوليتنا",
      content: (
        <div className="space-y-4 bg-brand-50 p-6 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
          <ShieldCheck className="w-16 h-16 text-brand-600 mb-2" />
          <p className="text-brand-800 leading-relaxed">
            نعرف أن تفاصيل العائلة والأنساب ليست مجرد بيانات… إنها حكايات وذكريات وروابط عزيزة. لذلك نتعامل مع كل ما تشاركه معنا من معلومات أو صور أو وثائق على أنه أمانة نعتز بها، ونحرص أن تبقى في مساحة آمنة تُصان فيها الخصوصية وتُحترم فيها الثقة.
          </p>
          <p className="text-brand-800 leading-relaxed">
            نأخذ السرية والخصوصية بجدية تامة، ونطبّق إجراءات علمية وأخلاقية صارمة لحماية المحتوى من أي وصول غير مصرح به أو استخدام غير ملائم. نعتمد مبدأ «الحد الأدنى الضروري» في التعامل مع البيانات، ونراجع ضوابطنا باستمرار ونطوّرها خطوة بخطوة. نريدك أن تشعر بالاطمئنان وأنت تبني شجرة عائلتك معنا، وأن تعرف أن ما يخصك سيبقى محفوظًا بعناية واحترام تماماً كما نحب أن تُحفظ قصص عائلاتنا.
          </p>
          <p className="text-brand-800 leading-relaxed font-semibold">
            هدفنا أن تستخدم منصتنا بثقة واطمئنان، وأن تبقى بياناتك ومحتواك تحت مظلة من العناية والسرية التي تستحقها.
          </p>
        </div>
      )
    },
    {
      id: "assurance-2",
      title: "أنت من يقرر ما يُدرج… ومن يمكنه الاطّلاع",
      content: (
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <EyeOff className="w-16 h-16 text-brand-600 mb-2" />
          <p className="text-gray-700 leading-relaxed">
            عند اشتراكك في منتج "سجل تراث العائلة" عبر منصتنا، تبقى أنت المتحكّم الكامل في ما تختار إدراجه في سجل عائلتك من معلومات أو صور أو وثائق. يتم الإدراج بشكل اختياري وبحسب رغبتك، وأنت من يحدد من يطّلع على السجل بعد إصداره وتسليمه لك، سواءً في نسخته الرقمية أو الورقية.
          </p>
          <p className="text-gray-700 leading-relaxed">
            نحن نوفر بيئة آمنة لحفظ محتواك، ونعتمد وسائل حماية وتقنيات تشفير متقدمة للحد من أي وصول غير مصرح به. ويمكنك في أي وقت تحديث ما أدرجته، أو حذف ما لا ترغب ببقائه، بما يتوافق مع اختيارك وراحتك.
          </p>
        </div>
      )
    },
    {
      id: "intro",
      title: "مقدمة سياسة الخصوصية",
      content: (
        <div className="space-y-4">
          <p>ترحب بكم منصة وموقع TheFamilyLegacyRoots.com المملوكان والمداران بواسطة GeneaLab LLC في ولاية وايومنغ بالولايات المتحدة الأمريكية.</p>
          <p>توضح سياسة الخصوصية هذه الكيفية التي تقوم بها الشركة بجمع البيانات والمعلومات ومعالجتها واستخدامها وتخزينها وحمايتها ومشاركتها عند زيارة الموقع أو استخدامه، أو التفاعل مع الخدمات والأنظمة التابعة.</p>
          <p>كما توضح هذه السياسة حقوق المستخدمين المتعلقة ببياناتهم، والأسس القانونية لمعالجة البيانات، وآليات الحماية والنقل الدولي والتخزين.</p>
          <p>يرجى قراءة هذه السياسة بعناية، حيث إن استخدام الموقع أو المنصة يُعد موافقة على الممارسات الموضحة في هذه السياسة.</p>
        </div>
      )
    },
    {
      id: "article-1-3",
      title: "المواد (1) إلى (3): نطاق السياسة وجمع البيانات",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (1): نطاق السياسة وطبيعة العلاقة</h3>
          <p>تنطبق هذه السياسة على عمليات جمع البيانات ومعالجتها وتخزينها واستخدامها المرتبطة بالموقع. وتُقرأ جنبًا إلى جنب مع شروط استخدام المنصة وعقد تقديم الخدمة. يقر المستخدم بالطبيعة الدولية للخدمات ونقل البيانات المرتبط بها.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (2): أنواع البيانات التي نقوم بجمعها</h3>
          <p>قد نقوم بجمع بيانات تعريفية (الاسم، البريد، الهاتف)، وبيانات عائلية ونسبية (أسماء أفراد العائلة والصور والمشجرات)، وبيانات مقدمة من المستخدم مباشرة، وبيانات تقنية وتشغيلية (IP Address وأنظمة التشغيل)، وبيانات المعاملات، وبيانات التوقيع الإلكتروني.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (3): كيفية جمع البيانات</h3>
          <p>نجمع البيانات التي يقدمها المستخدم مباشرة عند التسجيل أو طلب الخدمة، وتلك التي تُجمع تلقائيًا كالكوكيز أو من أطراف ثالثة كمزودي الدفع لتمكين معاملات أو تحليل أداء.</p>
        </div>
      )
    },
    {
      id: "article-4-6",
      title: "المواد (4) إلى (6): الأسس والاستخدام والمشاركة",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (4): الأسس القانونية لمعالجة البيانات</h3>
          <p>نعمل على معالجة البيانات لتنفيذ الخدمات والعقود، أو عبر موافقة مستخدم للوثائق والكوكيز، أو لتحقيق مصالح الشركة لتشغيل المنصة باحترافية وأمان، أو للامتثال القانوني.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (5): كيفية استخدام البيانات</h3>
          <p>تُستخدم البيانات لتشغيل الخدمات، الأمان وإدارة المخاطر، تحسين الأداء والإحصاءات، وعمليات التواصل مع المستخدم، ومواجهة أية التزامات قانونية.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (6): مشاركة البيانات والإفصاح عنها</h3>
          <p>تتم المشاركة فقط بالقدر اللازم لتشغيل المنصة مع مزودي الاستضافة أو التوقيع الإلكتروني أو بوابات الدفع. يجوز الإفصاح للامتثال للقانون أو أثناء معاملات مؤسسية. ويقر المستخدم بمسؤوليته عن نشر البيانات خارج نطاق المنصة.</p>
        </div>
      )
    },
    {
      id: "article-7-9",
      title: "المواد (7) إلى (9): البيانات العائلية، الاحتفاظ، والنقل الدولي",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (7): البيانات العائلية والبيانات الحساسة</h3>
          <p>بسبب طبيعة الخدمات، قد تعالج المنصة بيانات أفراد أحياء. يتحمل المستخدم مسؤولية أخذ موافقاتهم وتتخلى الشركة مسؤوليتها عن أية نزاعات عائلية تنتج عن ذلك.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (8): الاحتفاظ بالبيانات والسجلات</h3>
          <p>نحتفظ بالبيانات للمدة اللازمة قانونياً أو تشغيلياً لتنفيذها مع الاحتفاظ بسجلات التدقيق أو التوقيع للضمانات المؤسسية. وتُخزن ضمن بيئات وتقنيات حماية آمنة لأطول فترة ضرورية.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (9): النقل الدولي للبيانات</h3>
          <p>بنية الخدمات الرقمية تعتمد على النقل الدولي للبيانات داخل الولايات المتحدة أو غيرها لغرض التشغيل الآمن للخدمات. ويوافق العميل صراحةً على التدابير المطبقة.</p>
        </div>
      )
    },
    {
      id: "article-10-12",
      title: "المواد (10) إلى (12): الحماية، الكوكيز، والأطراف الثالثة",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (10): أمن المعلومات والحماية التقنية</h3>
          <p>تتخذ الشركة تدابير تقنية لتقليل وصول غير مصرح، وعلى الرغم من ذلك لا ضمان مطلق لحماية 100% ويتحمل العميل كذلك حماية حسابه.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (11) و (12): الكوكيز والروابط والأطراف الثالثة</h3>
          <p>تستخدم المنصة الكوكيز لإدارة الجلسة وأدائها وتحليلاتها وتخصيص تجربة المستخدم وحفظها بأمان، وتعتمد المنصة على مزودي خدمات خارجيين يخضعون لشروط الخصوصية الخاصة بهم ولسنا مسؤولين عن دقة محتواهم.</p>
        </div>
      )
    },
    {
      id: "article-13-18",
      title: "المواد (13) إلى (18): حقوق الاستخدام، الأحكام والتواصل",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المرتكزات القانونية والأحكام الختامية</h3>
          <p><strong>حقوق المستخدمين وعدم توجيه للأطفال:</strong> يمكن طلب حذف البيانات أو تصحيحها لدرجة معينة حسب متطلبات التعاقد وعدم تعارضها مع حفظ السجلات. المنصة لا تستهدف القُصّر ويتحمل المستخدم أية تبعات تخص البيانات العائلية لهم ضمن قوانين دولته.</p>
          <p><strong>الذكاء الاصطناعي والتعديلات:</strong> قد نستخدم أدوات تحليل آلي لم تتضمن أي إرشادات تخص الجزم بحقائق قانونية للأنساب، ونحتفظ بالحق لتعديل السياسة مع الاستمرار بمثابة إشعار ونفاذ.</p>
          <p><strong>القانون الحاكم والتواصل:</strong> تخضع الأحكام لقوانين وايومنغ. عند الرغبة بالمراسلة للإبلاغ أو طلب البيانات يمكنكم استخدام البريد: info@thefamilylegacyroots.com</p>
        </div>
      )
    }
  ]
};

export const privacyEn: LegalDocument = {
  title: "Privacy & Data Security Policy",
  version: "1.0",
  effectiveDate: "May 11, 2026",
  lastUpdated: "May 11, 2026",
  sections: [
    {
      id: "assurance-1-en",
      title: "Your Privacy, Protected—Your Trust, Earned Every Day",
      content: (
        <div className="space-y-4 bg-brand-50 p-6 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
          <ShieldCheck className="w-16 h-16 text-brand-600 mb-2" />
          <p className="text-brand-800 leading-relaxed">
            Family names, dates, and photos aren’t “just information”—they’re your legacy. Every detail you share helps preserve a story worth keeping, so we treat your content with the care it deserves. From the moment you upload a document or image, we keep it in a protected space designed to honor your privacy and safeguard your trust.
          </p>
          <p className="text-brand-800 leading-relaxed">
            Privacy isn’t a feature—it’s a promise. We use strong safeguards and responsible practices to help prevent unauthorized access or misuse. We collect and use only what’s necessary, and we continuously strengthen our protections so you can focus on what matters: building your family tree with confidence, clarity, and complete peace of mind.
          </p>
          <p className="text-brand-800 leading-relaxed font-semibold">
            Our goal is simple: help you preserve your family heritage with total confidence—knowing your data is handled with care, protected with strong security, and respected at every step.
          </p>
        </div>
      )
    },
    {
      id: "assurance-2-en",
      title: "You’re in Control—Choose What to Share and Who Sees It",
      content: (
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <EyeOff className="w-16 h-16 text-brand-600 mb-2" />
          <p className="text-gray-700 leading-relaxed">
            With the “Family Heritage Record” subscription, you stay in the driver’s seat. Add as much—or as little—as you like: information, photos, and documents are always optional and completely up to you. Once your record is issued and delivered, you decide who can access it—whether you choose the digital version, the printed edition, or both.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your content is stored in a secure environment backed by protective safeguards and advanced encryption—helping keep your family memories safe and accessible only to the people you choose.
          </p>
        </div>
      )
    },
    {
      id: "intro-en",
      title: "Introduction",
      content: (
        <div className="space-y-4">
          <p>Welcome to TheFamilyLegacyRoots.com owned and operated by GeneaLab LLC, located in the State of Wyoming, USA (“Company,” “we,” “our,” or “us”).</p>
          <p>This Privacy Policy (“Policy”) explains how the Company collects, processes, uses, stores, protects, transfers, and discloses information and data when users access or use the Website, Platform, or create accounts.</p>
          <p>This Policy also details users' rights, the legal bases for processing information, and cross-border data transfer structures.</p>
          <p>By accessing or using the Website or submitting information, you acknowledge and agree to the practices described in this Policy.</p>
        </div>
      )
    },
    {
      id: "section-1-3-en",
      title: "Sections 1 to 3: Scope and Information Collected",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 1: Scope of Application</h3>
          <p>This Policy governs all data processing activities. It is supplementary to the Website Terms of Use and specific Services Agreements.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 2: Categories of Information</h3>
          <p>We may collect identifying records (name, email), genealogical family material and histories, user-submitted content (photos, trees), technical parameters (IP addresses, Cookies, and logs), and necessary transactional and e-signature records.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 3: How Information Is Collected</h3>
          <p>Data is primarily collected directly from the customer. Technical metadata is assessed automatically by tracking methodologies or obtained from affiliated third-party service providers executing transactions.</p>
        </div>
      )
    },
    {
      id: "section-4-6-en",
      title: "Sections 4 to 6: Legal Bases, Usage, and Sharing",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 4: Legal Bases for Processing</h3>
          <p>Information is utilized to conduct contractual necessities, explicit consent regarding document ingestion, legit operational interests for safety and optimizations, and required legal compliance obligations.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 5: How Information Is Used</h3>
          <p>The company analyzes this data for operations management, ensuring safety/security risk mitigation, general analytics and system improvement, and direct operational communications with you.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 6: Sharing and Disclosure</h3>
          <p>We only share necessary info with required infrastructure operators (cloud networks, e-signatures, analytics). The Company is not legally liable for information a user freely distributes externally on independent networks or third-party scopes outlining our environment.</p>
        </div>
      )
    },
    {
      id: "section-7-9-en",
      title: "Sections 7 to 9: Sensitive Info, Retention, and International Transfers",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 7: Family and Sensitive Information</h3>
          <p>Lineage data often references third-party family members. The liability strictly lays upon the user in obtaining legitimate permission to record these histories without invoking unwarranted familial disputes directed back toward us.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 8: Data Retention</h3>
          <p>Archived databases log audit trails and e-signature files permanently where legally adequate to confront future disputes. Standard storage persists until practical reasons mandate removal or termination phases correctly finalize.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 9: International Transfers</h3>
          <p>System infrastructure resides internationally, generally spanning across US jurisdictions—thus processing routines consent heavily to transnational compliance thresholds and protocols.</p>
        </div>
      )
    },
    {
      id: "section-10-12-en",
      title: "Sections 10 to 12: Security, Cookies, and Third Parties",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 10: Information Security</h3>
          <p>While logical mitigations and encryptions secure the platform framework, total internet invincibility is unguaranteed; protecting personal credentials remains a primary customer obligation.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Sections 11 & 12: Cookies and Third Parties</h3>
          <p>The Site incorporates Cookies tracking essential performances and analytic assessments per session. Associated external providers execute independent data agreements outside our unilateral jurisdictions, rendering them non-liable from our boundaries of enforcement.</p>
        </div>
      )
    },
    {
      id: "section-13-18-en",
      title: "Sections 13 to 18: Rights, AI, Law, and Contact",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">General Policies and Final Provisions</h3>
          <p><strong>Rights and Children:</strong> Users reserve basic legislative capacities regarding rectifications matching regional parameters while averting conflicting documentation obligations. The interface strictly rejects independently managing legal affairs or engaging minors purposely.</p>
          <p><strong>AI & Revisions:</strong> Employed AI mechanisms expedite operational metrics without supplying legal verifications or absolute precision. Revisions to these policies occur at will sequentially enforcing continuity upon republication.</p>
          <p><strong>Governing Law and Contact:</strong> Administered under the scope of Wyoming legislations. Support interfaces with all privacy notices handled appropriately via info@thefamilylegacyroots.com</p>
        </div>
      )
    }
  ]
};
