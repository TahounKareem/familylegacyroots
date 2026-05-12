import { LegalDocument } from "../../pages/Legal";

export const paymentsAr: LegalDocument = {
  title: "سياسة الدفع والفوترة والمعاملات المالية",
  version: "1.0",
  effectiveDate: "11 مايو 2026",
  lastUpdated: "11 مايو 2026",
  sections: [
    {
      id: "intro",
      title: "المقدمة",
      content: (
        <div className="space-y-4">
          <p>تنظم سياسة الدفع والفوترة والمعاملات المالية هذه (“السياسة”) الأحكام والشروط المتعلقة بـ:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>المدفوعات والفواتير والمعاملات المالية.</li>
            <li>ووسائل الدفع والمعالجة المالية والإلكترونية.</li>
            <li>والرسوم والتكاليف والضرائب والتحويلات.</li>
            <li>والخدمات الرقمية أو البحثية أو التوثيقية المقدمة عبر منصة TheFamilyLegacyRoots.com.</li>
          </ul>
          <p>وتُعد هذه السياسة جزءًا لا يتجزأ من شروط استخدام الموقع والمنصة، عقد تقديم خدمة توثيق عمود النسب، سياسة الإلغاء والاسترداد وعدم الاسترجاع، وأي اتفاقيات مرتبطة بالخدمات.</p>
          <p>وباستخدام الموقع أو المنصة أو الخدمات، أو بإجراء أي عملية دفع أو معاملة، فإن العميل يقر بأنه قرأ هذه السياسة بالكامل، وفهم طبيعة المعاملات، ووافق على جميع أحكام الدفع والفوترة.</p>
        </div>
      )
    },
    {
      id: "article-1-3",
      title: "المواد (1) إلى (3): طبيعة الخدمات والمدفوعات والعملات",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (1): طبيعة الخدمات والمعاملات المالية</h3>
          <p>تُعد الخدمات مخصصة رقمية وتعتمد على العمل الفكري والبحثي. وبالتالي فإن الرسوم تمثل مقابلًا لخدمات مهنية وتشغيلية مخصصة وليست شراء لسلعة مادية تقليدية.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (2): وسائل الدفع والمعالجة المالية</h3>
          <p>تقبل الشركة المدفوعات من خلال بطاقات الائتمان وبوابات الدفع الإلكتروني والتحويلات البنكية. وقد تتم المعالجة عبر مزودي خدمات دفع يخضعون لسياسات مستقلة، ويفوض العميل الشركة ومزودي خدماتها بخصم المبالغ المستحقة.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (3): العملات والأسعار والرسوم</h3>
          <p>تخضع المعاملات لفروقات الصرف ورسوم التحويل، ولا تتحمل الشركة مسؤولية الرسوم الإضافية التي يفرضها البنك الخاص بالعميل. وتحتفظ الشركة بحقها في تعديل الأسعار، دون تأثير ذلك على الطلبات المؤكدة.</p>
        </div>
      )
    },
    {
      id: "article-4-5",
      title: "المواد (4) و (5): الضرائب الحكومية والتحقق",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (4): الضرائب والرسوم الحكومية</h3>
          <p>يتحمل العميل كافة الضرائب والتكاليف الجمركية أو المصرفية. وقد تقوم الشركة بتقييد الخدمات لأسباب تتعلق بالضرائب والامتثال، خصوصاً للعملاء داخل الولايات المتحدة لأسباب إدارة المخاطر التنظيمية.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (5): التحقق من الهوية والمعاملات</h3>
          <p>يجوز للشركة أو مزودات الدفع طلب معلومات إضافية للتحقق والمصادقة، ويجوز رفض المعاملات المشبوهة أو التي تتضمن عمليات احتيال.</p>
        </div>
      )
    },
    {
      id: "article-6-7",
      title: "المواد (6) و (7): الفواتير والتأخير أو الفشل",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (6): الفوترة والإيصالات والسجلات</h3>
          <p>تصدر الشركة فواتير وتأكيدات إلكترونية ويوافق العميل على استلامها رقمياً، وتُعد السجلات وسيلة إثبات معتمدة دون الحاجة لأي أصل ورقي.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (7): التأخير أو فشل الدفع</h3>
          <p>إذا تعذر تحصيل المبالغ المستحقة أو فشلت المعاملة، يجوز تعطيل الخدمات أو إلغاؤها، وقد يتم تحميل العميل أية رسوم نتجت حول فشل المعاملات والاسترجاعات.</p>
        </div>
      )
    },
    {
      id: "article-8-9",
      title: "المواد (8) و (9): النزاعات المالية والعروض",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (8): النزاعات المالية وطلبات الاسترجاع البنكي</h3>
          <p>يوافق العميل على التواصل المباشر لحل المشكلات قبل اللجوء للاسترجاع البنكي. وإذا تبين إساءة في استخدام ذلك للمطالبة التعسفية يحق للشركة تعليق الخدمات واستخدام سجلاتها للدفاع عن حقوقها.</p>
          
          <h3 className="font-bold text-lg text-brand-900 mt-6">المادة (9): العروض والخصومات والباقات الترويجية</h3>
          <p>يجوز للشركة تقديم عروض مؤقتة للخصومات والباقات تخضع لمدد معينة وألا يتم دمجها مع باقات أخرى ما لم يذكر، ويمكن إيقافها لحين ثبوت إساءة استخدام.</p>
        </div>
      )
    },
    {
      id: "article-10-14",
      title: "المواد (10) إلى (14): مكافحة الاحتيال وتعديلات السياسة",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">المادة (10) و (11): المستقبل ومكافحة الاحتيال</h3>
          <p>يحق للشركة إرفاق وإطلاق خدمات مستقبلية بمبالغ ونماذج متكررة، وتأخذ الشركة ومزودو الدفع التدابير لتقليل الاحتيال عبر إجراءات التحقق الإضافية.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">المواد (12-14)</h3>
          <p><strong>التعديلات:</strong> يحق للشركة التعديل لأي أسباب قانونية أو تشغيلية.</p>
          <p><strong>القانون الحاكم:</strong> تخضع الأحكام لقوانين ولاية وايومنغ وللتحكيم الوارد في العقد الرئيسي.</p>
          <p><strong>التواصل:</strong> يمكن التواصل معنا عبر info@thefamilylegacyroots.com</p>
        </div>
      )
    }
  ]
};

export const paymentsEn: LegalDocument = {
  title: "Payment Terms & Billing Policy",
  version: "1.0",
  effectiveDate: "May 11, 2026",
  lastUpdated: "May 11, 2026",
  sections: [
    {
      id: "intro-en",
      title: "Introduction",
      content: (
        <div className="space-y-4">
          <p>This Payment Terms & Billing Policy (“Policy”) governs the terms and conditions relating to payments, billing, electronic financial processing, fees, charges, taxes, and the digital research and documentation services provided through TheFamilyLegacyRoots.com platform.</p>
          <p>This Policy forms an integral part of the Website & Platform Terms of Use, the Service Agreement, and the Cancellation & Refund Policy.</p>
          <p>By using the website or submitting any payment, the customer acknowledges they have read, understood, and agreed to be bound by all financial processing terms contained herein.</p>
        </div>
      )
    },
    {
      id: "section-1-3-en",
      title: "Sections 1 to 3: Services, Payments, and Currencies",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 1: Nature of Services</h3>
          <p>Payments do not represent the purchase of a traditional physical product, but rather compensation for customized professional, technical, and digital services.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 2: Payment Methods</h3>
          <p>The Company may accept payments through credit cards, gateways, bank transfers, or digital wallets. The customer authorizes the Company and its payment providers to charge the applicable fees and conduct necessary verifications.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 3: Currency & Pricing</h3>
          <p>Transactions may be subject to currency exchange fluctuations and banking fees. The Company reserves the right to modify prices at any time, but modifications will not affect confirmed orders.</p>
        </div>
      )
    },
    {
      id: "section-4-5-en",
      title: "Sections 4 & 5: Taxes and Verifications",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 4: Taxes and Governmental Charges</h3>
          <p>The customer is responsible for any applicable taxes, duties, and customs fees. Certain services may involve geographic, tax or regulatory restrictions, namely concerning U.S. residents.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 5: Verification and Transaction Review</h3>
          <p>The Company or its payment processors may screen transactions for identity verification, compliance, and fraud detection. Suspicious transactions might be suspended or rejected.</p>
        </div>
      )
    },
    {
      id: "section-6-7-en",
      title: "Sections 6 & 7: Billing, Delays, and Failed Payments",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 6: Billing, Receipts, and Electronic Records</h3>
          <p>The Company may issue electronic invoices and confirms that electronic records have full legal validity—no paper original shall be required.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 7: Failed Payments</h3>
          <p>If a payment fails or is reverted, the Company may suspend or terminate services. Customers may be liable for resulting chargeback fees, conversion costs, or other processing expenses.</p>
        </div>
      )
    },
    {
      id: "section-8-9-en",
      title: "Sections 8 & 9: Disputes and Promotions",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Section 8: Financial Disputes and Chargebacks</h3>
          <p>Customers agree to contact the Company before initiating a chargeback. Fraudulent or abusive chargebacks may result in account termination, and electronic logs will be treated as valid evidence.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Section 9: Promotions and Discounts</h3>
          <p>Promotional offers are temporary, subject to modification, and cannot be redeemed for cash or combined unapprovedly and might be revoked upon abuse suspicion.</p>
        </div>
      )
    },
    {
      id: "section-10-14-en",
      title: "Sections 10 to 14: Subscriptions, Fraud Prevention, and General Provisions",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-brand-900">Sections 10 & 11: Future Services and Fraud Prevention</h3>
          <p>Future subscription services may apply, subject to additional terms. The platform retains the right to employ further authentication steps to mitigate fraud risks and comply with financial regulations.</p>

          <h3 className="font-bold text-lg text-brand-900 mt-6">Sections 12 to 14: General Provisions</h3>
          <p>The Policy is subject to changes per the Company's discretion. All provisions are governed by the laws of Wyoming, subject to binding arbitration.</p>
          <p>Contact: info@thefamilylegacyroots.com</p>
        </div>
      )
    }
  ]
};
