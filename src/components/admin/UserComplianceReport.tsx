import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Shield, X, FileText, CheckCircle, Clock } from 'lucide-react';

export function UserComplianceReport({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [consents, setConsents] = useState<any[]>([]);
  const [evidences, setEvidences] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const consentsQ = query(collection(db, 'legal_consents'), where('userId', '==', userId));
        const consentsSnap = await getDocs(consentsQ);
        const consentsData = consentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Manually sort since we don't have composite index for orderBy right now
        consentsData.sort((a, b) => (b.acceptedAt?.toMillis() || 0) - (a.acceptedAt?.toMillis() || 0));
        setConsents(consentsData);

        const evidenceQ = query(collection(db, 'order_evidence'), where('userId', '==', userId));
        const evidenceSnap = await getDocs(evidenceQ);
        const evidenceData = evidenceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        evidenceData.sort((a, b) => (b.generatedAt?.toMillis() || 0) - (a.generatedAt?.toMillis() || 0));
        setEvidences(evidenceData);
      } catch (e) {
        console.error("Failed to fetch compliance report data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 bg-brand-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-brand-100 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-brand-900">تقرير الإمتثال التفصيلي</h2>
              <p className="text-xs text-brand-600 font-mono" dir="ltr">User ID: {userId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-brand-600 font-medium animate-pulse">جاري سحب السجلات القانونية...</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Consents Section */}
              <section className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
                <h3 className="font-bold text-lg text-brand-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600"/> 
                  الإقرارات والموافقات القانونية (Legal Consents)
                </h3>
                {consents.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">لم يتم العثور على إقرارات قانونية لهذا المستخدم.</p>
                ) : (
                  <div className="space-y-4">
                    {consents.map(consent => (
                      <div key={consent.id} className="bg-brand-50 p-4 rounded-xl border border-brand-100 flex flex-col gap-2">
                         <div className="flex justify-between items-start">
                           <span className="font-bold text-brand-900 text-sm bg-white px-3 py-1 rounded-full border border-brand-200">
                             {consent.consentType || "موافقة"}
                           </span>
                           <span className="text-xs text-brand-600 flex items-center gap-1" dir="ltr">
                             <Clock className="w-3 h-3"/>
                             {consent.acceptedAt ? new Date(consent.acceptedAt.toMillis()).toLocaleString('en-GB') : "N/A"}
                           </span>
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                           <div>
                             <p className="text-xs text-brand-500 mb-1">نسخة الوثيقة</p>
                             <p className="font-mono text-sm">{consent.consentVersion || "v1.0"}</p>
                           </div>
                           <div>
                             <p className="text-xs text-brand-500 mb-1">IP Address</p>
                             <p className="font-mono text-sm" dir="ltr">{consent.ipAddress || consent.ipHash || "N/A"}</p>
                           </div>
                           <div className="col-span-2">
                             <p className="text-xs text-brand-500 mb-1">تفضيلات (Preferences)</p>
                             <div className="flex gap-2">
                               {consent.preferences ? Object.entries(consent.preferences).map(([k, v]) => (
                                 <span key={k} className={`text-xs px-2 py-0.5 rounded ${v ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                   {k}: {v ? 'نعم' : 'لا'}
                                 </span>
                               )) : <span className="text-xs text-gray-500">غير متوفر</span>}
                             </div>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Evidence Section */}
              <section className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
                <h3 className="font-bold text-lg text-brand-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600"/> 
                  أدلة إبرام العقود والطلبات (Order Evidence)
                </h3>
                {evidences.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">لم يتم العثور على أية سجلات عقود لهذا المستخدم.</p>
                ) : (
                  <div className="space-y-4">
                    {evidences.map(evidence => (
                      <div key={evidence.id} className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col gap-2">
                         <div className="flex justify-between items-start">
                           <span className="font-bold text-blue-900 text-sm bg-white px-3 py-1 rounded-full border border-blue-200">
                             عقد: {evidence.contractId || "غير مرتبط"}
                           </span>
                           <span className="text-xs text-blue-600 flex items-center gap-1" dir="ltr">
                             <Clock className="w-3 h-3"/>
                             {evidence.generatedAt ? new Date(evidence.generatedAt.toMillis()).toLocaleString('en-GB') : "N/A"}
                           </span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           <div>
                             <p className="text-xs text-blue-500 mb-1">معرف الطلب (Order ID)</p>
                             <p className="font-mono text-sm">{evidence.orderId || "N/A"}</p>
                           </div>
                           <div>
                             <p className="text-xs text-blue-500 mb-1">تفاصيل الأدلة</p>
                             <div className="max-h-24 overflow-y-auto bg-white p-2 rounded border border-blue-100 text-xs font-mono" dir="ltr">
                               <pre>{JSON.stringify(evidence.orderDetailsSnapshot || {}, null, 2)}</pre>
                             </div>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
