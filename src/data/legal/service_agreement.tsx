import React from 'react';
import { LegalDocument } from '../../pages/Legal';

export const serviceAgreementAr: LegalDocument = {
  title: 'عقد تقديم الخدمة (النسخة القياسية والدولية)',
  version: '1.0',
  effectiveDate: '2024-06-01',
  lastUpdated: '2024-06-01',
  sections: [
    {
      id: 'preamble',
      title: 'مقدمة العقد والأطراف',
      content: (
        <div className="prose prose-brand max-w-none text-brand-800">
          <p>
            تُبرم هذه الاتفاقية بين المنصة (المشار إليها بـ "مقدم الخدمة") والمستخدم (المشار إليه بـ "طالب الخدمة" أو "العميل") بناءً على طلبه لتقديم الخدمات المدرجة في منصتنا الرقمية.
          </p>
          <p>
            يعتبر طلب الخدمة وموافقة العميل وتوقيعه (الإلكتروني أو الضمني) بمثابة قبول تام لكافة شروط وأحكام هذا العقد.
          </p>
        </div>
      )
    },
    {
      id: 'scope',
      title: 'نطاق تقديم الخدمات',
      content: (
        <div className="space-y-4 text-brand-800">
          <p>يلتزم مقدم الخدمة بتقديم الخدمات المطلوبة والمسددة الرسوم، وذلك بالأسس التي حددها في الباقة المختارة.</p>
          <ul className="list-disc pr-5 marker:text-brand-400 space-y-2">
            <li>يلتزم مقدم الخدمة بأعلى معايير الجودة المتاحة.</li>
            <li>يخضع تقديم الخدمات لمعايير الشفافية والتحديث المستمر للمهلة الزمنية.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'obligations',
      title: 'التزامات العميل',
      content: (
        <div className="text-brand-800">
          <p>
            يقر طالب الخدمة بأن جميع المعلومات والبيانات التي يقدمها لمقدم الخدمة صحيحة ودقيقة وخالية من التزييف، ويتحمل كامل المسؤولية القانونية في حال ثبوت عكس ذلك. كم يلتزم التزاماً تاماً بالسداد وفقاً للخطط المتفق عليها.
          </p>
        </div>
      )
    },
    {
      id: 'confidentiality',
      title: 'السرية وحفظ البيانات (NDA)',
      content: (
        <div className="text-brand-800">
          <p>
            يقر مقدم الخدمة بحفظ سرية جميع معلومات طالب الخدمة وعدم نشرها أو مشاركتها إلا بناءً على أمر قضائي أو وفق ما تقتضيه القوانين المعمول بها وحسب ما تم التصريح به في سياسة الخصوصية.
          </p>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'حدود المسؤولية وإخلاء الطرف',
      content: (
        <div className="text-brand-800">
          <p>
            لا يتحمل مقدم الخدمة أية مسؤولية عن الأضرار غير المباشرة أو التبعية الناتجة عن استخدام الخدمات أو تأخرها لأسباب قاهرة خارجة عن إرادته.
          </p>
        </div>
      )
    },
    {
        id: 'governing-law',
        title: 'القانون الواجب التطبيق والاختصاص القضائي',
        content: (
          <div className="text-brand-800">
            <p>
              يخضع هذا العقد للقوانين والأنظمة المعمول بها دولياً ومحلياً حسب مقر عمل مقدم الخدمة، ويتم إحالة أية نزاعات تنشأ عن تفسير أو تنفيذ هذا العقد إلى المحاكم المختصة بذلك المقر.
            </p>
          </div>
        )
      }
  ]
};

export const serviceAgreementEn: LegalDocument = {
  title: 'Service Agreement (Standard & International)',
  version: '1.0',
  effectiveDate: '2024-06-01',
  lastUpdated: '2024-06-01',
  sections: [
    {
      id: 'preamble',
      title: 'Preamble and Parties',
      content: (
        <div className="prose prose-brand max-w-none text-brand-800">
          <p>
            This agreement is entered into between the platform ("Service Provider") and the user ("Client"), based on their request to provide the services listed on our digital platform.
          </p>
          <p>
            The request for service, client's approval, and (electronic or implicit) signature constitute full acceptance of all terms and conditions of this contract.
          </p>
        </div>
      )
    },
    {
      id: 'scope',
      title: 'Scope of Services',
      content: (
        <div className="space-y-4 text-brand-800">
          <p>The Service Provider is committed to providing the requested and paid-for services, based on the selected package.</p>
          <ul className="list-disc pl-5 marker:text-brand-400 space-y-2">
            <li>The Service Provider adheres to the highest available quality standards.</li>
            <li>The provision of services is subject to transparency standards and continuous timeline updates.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'obligations',
      title: 'Client Obligations',
      content: (
        <div className="text-brand-800">
          <p>
            The Client acknowledges that all information and data provided to the Service Provider are true, accurate, and free of forgery, assuming full legal responsibility otherwise. The Client is fully committed to payment according to the agreed-upon plans.
          </p>
        </div>
      )
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality and Data Protection (NDA)',
      content: (
        <div className="text-brand-800">
          <p>
            The Service Provider acknowledges maintaining the confidentiality of all Client information and not publishing or sharing it except by a court order, applicable laws, or as stated in the Privacy Policy.
          </p>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: (
        <div className="text-brand-800">
          <p>
            The Service Provider is not liable for any indirect or consequential damages resulting from the use of services or delays due to force majeure beyond their control.
          </p>
        </div>
      )
    },
    {
        id: 'governing-law',
        title: 'Governing Law and Jurisdiction',
        content: (
          <div className="text-brand-800">
            <p>
              This contract is governed by the laws and regulations internationally and locally based on the Service Provider's location. Any disputes arising from the interpretation or execution of this contract shall be referred to the competent courts of that jurisdiction.
            </p>
          </div>
        )
      }
  ]
};
