import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate, useLocation } from "react-router";
import { Shield, Lock, FileCheck, CheckCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { termsAr, termsEn } from "../data/legal/terms";
import { cookiesAr, cookiesEn } from "../data/legal/cookies";
import { refundAr, refundEn } from "../data/legal/refund";
import { paymentsAr, paymentsEn } from "../data/legal/payments";
import { privacyAr, privacyEn } from "../data/legal/privacy";
import { serviceAgreementAr, serviceAgreementEn } from "../data/legal/service_agreement";

export type DocId = 'terms' | 'privacy' | 'cookies' | 'refund' | 'payments' | 'service_agreement';
export type Lang = 'ar' | 'en';

export interface LegalSection {
  id: string;
  title: string;
  content?: React.ReactNode;
  html?: string;
}

export interface LegalDocument {
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const legalContent: Record<DocId, Record<Lang, LegalDocument>> = {
  terms: {
    ar: termsAr,
    en: termsEn,
  },
  privacy: {
    ar: privacyAr,
    en: privacyEn,
  },
  cookies: {
    ar: cookiesAr,
    en: cookiesEn,
  },
  refund: {
    ar: refundAr,
    en: refundEn,
  },
  payments: {
    ar: paymentsAr,
    en: paymentsEn,
  },
  service_agreement: {
    ar: serviceAgreementAr,
    en: serviceAgreementEn,
  }
};

export function Legal() {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [remoteDoc, setRemoteDoc] = useState<LegalDocument | null>(null);

  const lang = (searchParams.get('lang') as Lang) === 'en' ? 'en' : 'ar';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [documentId, lang]);

  useEffect(() => {
    async function fetchRemoteDoc() {
      if (!documentId) return;
      try {
        const docRef = doc(db, "legal_documents", documentId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data().latestVersion;
          if (data) {
             setRemoteDoc({
               title: data.title || "وثيقة قانونية",
               version: data.version || "1.0",
               effectiveDate: data.effectiveDate || "N/A",
               lastUpdated: data.lastUpdated || "N/A",
               sections: data.sections || [
                 {
                   id: 'remote-content',
                   title: 'المحتويات',
                   content: (
                     <div className="prose prose-brand max-w-none font-light leading-relaxed">
                       <ReactMarkdown>{data.content || ""}</ReactMarkdown>
                     </div>
                   )
                 }
               ]
             });
             return;
          }
        }
      } catch (err) {
        console.error("Failed to load remote legal doc:", err);
      }
      setRemoteDoc(null);
    }
    fetchRemoteDoc();
  }, [documentId]);

  const isValidDocId = (id: string | undefined): id is DocId => {
    return !!id && id in legalContent;
  };

  if (!isValidDocId(documentId)) {
    return <Navigate to="/legal/terms" replace />;
  }

  // Use remote doc if it exists and language is arabic (since our admin tool only inputs arabic)
  // Otherwise fallback to static translated files
  const docData = (remoteDoc && lang === 'ar') ? remoteDoc : legalContent[documentId][lang];
  const isRTL = lang === 'ar';
  const isPrivacyPage = documentId === 'privacy';

  const toggleLanguage = () => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (lang === 'ar') {
        newParams.set('lang', 'en');
      } else {
        newParams.delete('lang');
      }
      return newParams;
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={toggleLanguage}
          className="inline-flex items-center gap-2 bg-white border border-brand-200 px-4 py-2 rounded-full text-sm font-semibold text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition shadow-sm"
        >
          {lang === 'ar' ? 'Read in English' : 'قراءة باللغة العربية'}
        </button>
      </div>

      {/* Header */}
      <header className="mb-12 bg-white rounded-3xl p-8 md:p-12 border border-brand-100 shadow-sm text-center">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-900 mb-6">{docData.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-brand-600 font-medium">
          <span className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            {isRTL ? 'الإصدار: ' : 'Version: '} {docData.version}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-300"></span>
          <span>{isRTL ? 'تاريخ السريان: ' : 'Effective Date: '} {docData.effectiveDate}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-300"></span>
          <span>{isRTL ? 'آخر تحديث: ' : 'Last Updated: '} {docData.lastUpdated}</span>
        </div>
      </header>

      {/* Trust Cards (Privacy Only) */}
      {isPrivacyPage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-600 mb-4 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-brand-900 mb-2">{isRTL ? 'حماية عالية' : 'High Protection'}</h3>
            <p className="text-sm text-brand-700">{isRTL ? 'نحمي بيانات عائلتك عبر أنظمة مشفرة وآمنة' : 'We protect your family data using secure and encrypted systems'}</p>
          </div>
          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-600 mb-4 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-brand-900 mb-2">{isRTL ? 'الخصوصية أولاً' : 'Privacy First'}</h3>
            <p className="text-sm text-brand-700">{isRTL ? 'لا نشارك الوثائق أو الصور مع أي أطراف ثالثة' : 'We never share documents or photos with third parties'}</p>
          </div>
          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-600 mb-4 shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-brand-900 mb-2">{isRTL ? 'امتثال كامل' : 'Full Compliance'}</h3>
            <p className="text-sm text-brand-700">{isRTL ? 'نلتزم بكافة قوانين تنظيم البيانات والخصوصية' : 'We adhere to all privacy and data regulations'}</p>
          </div>
        </div>
      )}

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Table of Contents sidebar */}
        <div className="lg:w-1/4">
          <div className="sticky top-24 bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
            <h3 className="text-lg font-bold text-brand-900 mb-4 pb-4 border-b border-brand-100">
              {isRTL ? 'جدول المحتويات' : 'Table of Contents'}
            </h3>
            <nav className="space-y-1">
              {docData.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-${isRTL ? 'right' : 'left'} px-3 py-2 text-sm text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-colors`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="lg:w-3/4 space-y-12">
          {docData.sections.map((section) => (
            <section 
              key={section.id} 
              id={section.id} 
              className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm scroll-mt-24"
            >
              <h2 className="font-serif text-2xl font-bold text-brand-900 mb-6 pb-4 border-b border-brand-50">
                {section.title}
              </h2>
              <div className="text-brand-800">
                {section.html ? (
                  <div className="prose prose-brand max-w-none font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: section.html }} />
                ) : (
                  section.content
                )}
              </div>
            </section>
          ))}
          
          <div className="mt-12 pt-8 border-t border-brand-200 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-brand-50 p-8 rounded-2xl">
            <div>
              <strong className="block text-xl font-serif text-brand-900 mb-2">{isRTL ? 'شركة جيني لاب' : 'Genie Lab LLC'}</strong>
              <span dir="ltr" className={`block text-brand-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>30 N Gould St, STE R, Sheridan, WY 82801, USA</span>
            </div>
            <a href="mailto:info@TheFamilyLegacyRoots.com" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-brand-200 rounded-xl text-brand-700 font-bold hover:bg-brand-50 transition shadow-sm">
              info@TheFamilyLegacyRoots.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
