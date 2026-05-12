import { LegalDocument } from "../../pages/Legal";

export const refundAr: LegalDocument = {
  title: "سياسة الإلغاء وعدم الاسترجاع",
  version: "1.0",
  effectiveDate: "11 مايو 2026",
  lastUpdated: "11 مايو 2026",
  sections: [
    {
      id: "intro",
      title: "المقدمة",
      content: (
        <div className="space-y-4">
          <p>تنظم سياسة الإلغاء والاسترداد وعدم الاسترجاع هذه (“السياسة”) الأحكام والضوابط المتعلقة بـ:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>إلغاء الطلبات أو الخدمات.</li>
            <li>والاسترداد أو عدم الاسترداد.</li>
            <li>والمدفوعات والرسوم والمعاملات المالية.</li>
            <li>والخدمات الرقمية أو البحثية أو التوثيقية المقدمة عبر منصة TheFamilyLegacyRoots.com.</li>
          </ul>
          <p>وتُعد هذه السياسة جزءًا لا يتجزأ من:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>شروط استخدام الموقع والمنصة.</li>
            <li>وعقد تقديم خدمة توثيق عمود النسب وإصدار سجل تراث العائلة.</li>
            <li>وأي اتفاقيات أو نماذج طلب أو سياسات مرتبطة بالخدمات أو المعاملات الرقمية.</li>
          </ul>
          <p>وباستخدام الموقع أو المنصة أو الخدمات، أو بإجراء أي عملية دفع أو طلب أو توقيع إلكتروني، فإن العميل يقر بأنه قرأ هذه السياسة بالكامل، وفهم طبيعة الخدمات، ووافق على أحكامها.</p>
        </div>
      )
    },
    {
      id: "article-1",
      title: "المادة (1): طبيعة الخدمات وتأثيرها على الاسترداد",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">1.1 الطبيعة المخصصة للخدمات</h3>
          <p>يقر العميل بأن الخدمات المقدمة عبر المنصة تُعد خدمات لعمل رقمي وبحثي وتوثيقي مخصص، تعتمد على العمل الفكري والبحث والتحليل، ويتم تنفيذها بناءً على بيانات العميل. وبالتالي هي تختلف عن المنتجات المادية التقليدية القابلة للإرجاع.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">1.2 بدء العمل واكتساب الرسوم</h3>
          <p>يقر العميل بأنه بمجرد بدء أعمال البحث أو التوثيق أو التشغيل، أو تخصيص الموارد أو الفرق لتنفيذ الطلب، فإن جزءًا من الرسوم أو كاملها يصبح <strong>غير قابل للاسترداد</strong> نظراً لبدء استهلاك الوقت والموارد.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">1.3 الطبيعة غير القابلة للإرجاع للمخرجات الرقمية</h3>
          <p>السجلات والملفات والمخرجات الرقمية لا يمكن "إرجاعها" بمجرد تسليمها أو إتاحتها للتحميل والتنزيل أو تمكين العميل من الاطلاع عليها.</p>
        </div>
      )
    },
    {
      id: "article-2",
      title: "المادة (2): نهائية الطلبات وعدم قابلية الإلغاء",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">2.1 الطبيعة النهائية للطلبات</h3>
          <p>الطلبات المقدمة نهائية وملزمة وغير قابلة للإلغاء بمجرد تأكيد الطلب أو إتمام الدفع أو الموافقة الإلكترونية.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">2.2 بدء التخصيص والتجهيز</h3>
          <p>بمجرد إتمام الدفع، تبدأ الشركة فوراً بتخصيص الموارد والجدولة. وبالتالي تعتبر الطلبات والمدفوعات <strong>غير قابلة للإلغاء أو السحب</strong>.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">2.3 عدم وجود حق تلقائي في العدول والانهاء</h3>
          <p>العميل لا يملك حقاً تلقائياً في إلغاء أو عدول أو استرداد، والاستثناءات التقديرية تخضع لتقدير الشركة المنفرد.</p>
        </div>
      )
    },
    {
      id: "article-3",
      title: "المادة (3): عدم الاسترداد بعد بدء العمل",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">3.1 بدء التنفيذ</h3>
          <p>بمجرد بدء أي جزء من أعمال البحث أو التوثيق، فإن الرسوم المدفوعة تصبح غير قابلة للاسترداد بالقدر الذي يعكس الأعمال المنجزة والموارد المستهلكة.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">3.2 الأعمال الجزئية</h3>
          <p>يجوز للشركة الاحتفاظ بجزء من الرسوم يتناسب مع الأعمال المنفذة، أو إصدار استرداد جزئي وفق تقديرها المعقول للمرحلة المنجزة.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">3.3 عدم الرضا الشخصي أو الاجتماعي</h3>
          <p>عدم الرضا عن الروايات، أو وجود خلافات عائلية أو اختلاف التوقعات، لا يُعد سبباً تلقائياً للاسترداد.</p>
        </div>
      )
    },
    {
      id: "article-4-5",
      title: "المادة (4) و (5): التسليم الإلكتروني والخدمات الاختيارية",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (4): المخرجات الرقمية والتسليم الإلكتروني</h3>
          <p>تُعد الخدمة مُنفذة بمجرد إرسال الروابط أو الملفات أو إتاحة الوصول. بعد التسليم، تصبح الرسوم والخدمات <strong>غير قابلة للاسترداد</strong>.</p>
          <p>لا تتحمل الشركة مسؤولية فقدان العميل للملفات أو عدم تنزيلها في الوقت المتاح.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (5): الخدمات الاختيارية والأبواب المغلقة</h3>
          <p>خدمات فتح الأبواب المغلقة والبحوث المتقدمة لا تضمن الوصول لنتائج أو وثائق معينة. عدم الوصول للنتيجة المرجوة لا يُعد سبباً للاسترداد. بمجرد بدء العمل، تصبح الرسوم غير قابلة للاسترداد.</p>
        </div>
      )
    },
    {
      id: "article-6-7",
      title: "المادة (6) و (7): المطبوعات والتكاليف المالية",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (6): المنتجات المطبوعة والشحن</h3>
          <p>بمجرد بدء الطباعة أو الإنتاج والشحن للنسخ الورقية أو الملحقات، تصبح الرسوم المرتبطة بها غير قابلة للاسترداد. الشركة غير مسؤولة عن التعطل أو التأخير من قبل شركات الشحن أو الجمارك.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (7): المدفوعات ورسوم المعالجة والضرائب</h3>
          <p>المبالغ غير القابلة للاسترداد تشمل رسوم المعالجة والتحويل والبوابات البنكية أو التقنية والإدارية. ويتحمل العميل أي رسوم ضرائب أو جمارك مرتبطة بالخدمات والمطبوعات.</p>
        </div>
      )
    },
    {
      id: "article-8",
      title: "المادة (8): النزاعات المالية وطلبات الاسترجاع البنكي (Chargebacks)",
      content: (
        <div className="space-y-4">
          <p>يوافق العميل على التواصل مع الشركة لمحاولة معالجة أي استفسار أو اعتراض قبل فتح نزاع مالي أو طلب استرجاع بنكي (Chargeback).</p>
          <p>إذا ثبت تقديم طلب استرجاع بصورة تعسفية أو احتيالية، يحق للشركة تعليق الحسابات، تقديم السجلات كدليل للجهات المختصة، واتخاذ الإجراءات القانونية لحماية حقوقها.</p>
          <p>سجلات الدخول والتحميل وسجلات التدقيق (Audit Trails) وشهادات الإكمال تعتبر وسائل إثبات معتمدة قانوناً.</p>
        </div>
      )
    },
    {
      id: "article-9",
      title: "المادة (9): حالات عدم الاسترداد",
      content: (
        <div className="space-y-4">
          <p><strong>لا يحق للعميل المطالبة بالاسترداد في الحالات التالية:</strong></p>
          <ul className="list-disc pr-6 space-y-2">
            <li>بعد بدء التصميم أو البحث أو التشغيل.</li>
            <li>بعد إتاحة أو تسليم رقمي للمخرجات.</li>
            <li>عدم الرضا عن الرواية أو اختلاف وجهات النظر العائلية.</li>
            <li>بعد بدء إنتاج أو طباعة السجل.</li>
            <li>تأخر العميل نفسه في تقديم أية مستندات أو تعاون في التنفيذ.</li>
          </ul>
        </div>
      )
    },
    {
      id: "article-10-13",
      title: "المواد من (10) إلى (13): أحكام عامة",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (10): القوة القاهرة</h3>
          <p>تأخير تنفيذ الخدمات لتأثيرات ظروف خارجة عن إرادة الشركة (أوبئة، حروب، سيبرانية) لا يتيح ولا يُعطى للعميل حق بالإلغاء والاسترداد التام أو الجزئي تلقائياً.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (11) व (12): التعديل والقانون الحاكم</h3>
          <p>يحق للشركة تعديل السياسة ونشرها ويكون استمرار الاستخدام بمثابة قبول بها. وتخضع وتُفسر السياسة لقوانين ولاية وايومنغ وتقام تسويات النزاعات استناداً لنصوص التحكيم الواردة في عقد المنصة.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (13): التواصل معنا</h3>
          <p>GeneaLab LLC</p>
          <p>info@thefamilylegacyroots.com</p>
        </div>
      )
    }
  ]
};

export const refundEn: LegalDocument = {
  title: "Cancellation & Non-Refund Policy",
  version: "1.0",
  effectiveDate: "May 11, 2026",
  lastUpdated: "May 11, 2026",
  sections: [
    {
      id: "intro-en",
      title: "Introduction",
      content: (
        <div className="space-y-4">
          <p>This Cancellation, Refund & Non-Refund Policy (“Policy”) governs the terms and conditions relating to cancellations of services or orders; refunds and non-refundable payments; billing, financial transactions, and payment-related matters; and the digital, research, documentation, and genealogy-related services provided through TheFamilyLegacyRoots.com platform.</p>
          <p>This Policy forms an integral part of the Website & Platform Terms of Use; the Lineage Documentation & Family Legacy Record Service Agreement; and any related agreements or operational policies.</p>
          <p>By using the Website, Platform, or services, or by completing any payment or transaction, the customer acknowledges and agrees that they have read this Policy in full and agreed to be legally bound by all provisions herein.</p>
        </div>
      )
    },
    {
      id: "section-1-en",
      title: "Section 1: Nature of the Services and Impact on Refund Eligibility",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">1.1 Customized and Digital Nature</h3>
          <p>The services provided constitute customized digital, research, genealogical, and documentation services involving intellectual work. They differ fundamentally from mass-produced physical goods and are not capable of return or resale.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">1.2 Allocation of Resources</h3>
          <p>Upon order confirmation or payment completion, the Company may promptly allocate resources, reserve time, or begin work. Accordingly, orders and payments become final and non-cancellable.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">1.3 Digital Deliverables Are Non-Returnable</h3>
          <p>Digital records, electronic files, and deliverables cannot be “returned” once delivered, downloaded, accessed, or made available.</p>
        </div>
      )
    },
    {
      id: "section-2-en",
      title: "Section 2: Non-Refundability Following Commencement of Services",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">2.1 Commencement of Work</h3>
          <p>Once research, analysis, documentation, design, or technical processing has commenced, the corresponding fees become non-refundable to the extent reflecting the resources utilized.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">2.2 Partially Completed Services</h3>
          <p>Where services are partially performed, the Company may retain amounts proportionate to the work completed and resources allocated.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">2.3 Subjective Dissatisfaction</h3>
          <p>Dissatisfaction with research findings, family disagreements, or differences in expectations shall not constitute automatic grounds for cancellation or refund.</p>
        </div>
      )
    },
    {
      id: "section-3-5-en",
      title: "Sections 3 to 5: Delivery, Optional Services & Printing",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 3: Digital Delivery</h3>
          <p>Services are fulfilled upon digital transmission or provision of access (eg. download links). Post-delivery, fees are strictly non-refundable and non-reversible.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 4: Optional & Advanced Services</h3>
          <p>Advanced services ("Closed Doors") are independent. The Company cannot guarantee specific historical discoveries; therefore, failure to achieve a desired outcome does not create a refund entitlement.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 5: Printed Materials and Shipping</h3>
          <p>Once printing, production, or shipping processing has commenced, related fees become non-refundable. The Company is not responsible for logistics or customs delays beyond its control.</p>
        </div>
      )
    },
    {
      id: "section-6-7-en",
      title: "Sections 6 & 7: Payments and Chargebacks",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 6: Payments & Fees</h3>
          <p>Non-refundable fees may include processing charges, banking fees, and allocated resources. Customers are solely responsible for corresponding taxes and governmental charges.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 7: Financial Disputes and Chargebacks</h3>
          <p>Customers must attempt resolution with the Company prior to initiating chargebacks. Abusive chargebacks will result in account termination, and the Company will present audit trails, platform records, and electronic signatures as binding evidence to payment processors.</p>
        </div>
      )
    },
    {
      id: "section-8-en",
      title: "Section 8: Circumstances Where Refunds Are Not Available",
      content: (
        <div className="space-y-4">
          <p>Refunds shall <strong>not</strong> be available in circumstances including, but not limited to:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">
            <li>After research or design has commenced.</li>
            <li>After digital deliverables have been provided.</li>
            <li>Dissatisfaction relating to narratives or interpretations.</li>
            <li>After printing or shipping has begun.</li>
            <li>Due to customer delay or lack of cooperation.</li>
          </ul>
        </div>
      )
    },
    {
      id: "section-9-12-en",
      title: "Sections 9 to 12: General Provisions",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 9: Force Majeure</h3>
          <p>Operational delays caused by force majeure events (e.g. pandemics, cyberattacks, natural disasters) shall not automatically entitle the customer to refunds or cancellations.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 10 & 11: Amendments and Governing Law</h3>
          <p>The Company reserves the right to modify this Policy. It shall be governed by the laws of the State of Wyoming, subject to arbitration as outlined in the Terms of Use.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 12: Contact Information</h3>
          <p>GeneaLab LLC</p>
          <p>info@thefamilylegacyroots.com</p>
        </div>
      )
    }
  ]
};
