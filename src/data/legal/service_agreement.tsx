import React from 'react';
import { LegalDocument } from '../../pages/Legal';
import { arabicContractText } from '../arabicContract';

export const serviceAgreementAr: LegalDocument = {
  title: 'عقد تقديم خدمة توثيق عمود النسب واصدار سجل تراث العائلة',
  version: '1.0',
  effectiveDate: '2024-06-01',
  lastUpdated: '2024-06-01',
  sections: [
    {
      id: 'full_contract',
      title: 'النص الكامل للعقد',
      content: (
        <div className="prose prose-brand max-w-none text-brand-800 font-sans whitespace-pre-wrap leading-relaxed">
          {arabicContractText}
        </div>
      )
    }
  ]
};

export const serviceAgreementEn: LegalDocument = {
  title: 'Service Agreement',
  version: '1.0',
  effectiveDate: '2024-06-01',
  lastUpdated: '2024-06-01',
  sections: [
    {
      id: 'full_contract',
      title: 'Full Contract Text',
      content: (
        <div className="prose prose-brand max-w-none text-brand-800 font-sans whitespace-pre-wrap leading-relaxed">
          {arabicContractText}
        </div>
      )
    }
  ]
};
