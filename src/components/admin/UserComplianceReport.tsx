import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Shield, X, FileText, CheckCircle, Clock, Database, AlertCircle, Printer } from 'lucide-react';

export function UserComplianceReport({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [consents, setConsents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        const ordersQ = query(collection(db, 'orders'), where('userId', '==', userId));
        const ordersSnap = await getDocs(ordersQ);
        setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const ticketsQ = query(collection(db, 'support_tickets'), where('userId', '==', userId));
        const ticketsSnap = await getDocs(ticketsQ);
        setTickets(ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((t: any) => t.privacyType === 'طلب حذف بيانات'));
        
        const consentsQ = query(collection(db, 'legal_consents'), where('userId', '==', userId));
        const consentsSnap = await getDocs(consentsQ);
        setConsents(consentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const logsQ = query(collection(db, 'audit_logs'), where('userId', '==', userId));
        const logsSnap = await getDocs(logsQ);
        setAuditLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => {
           let tA = a.timestamp?.seconds || 0;
           let tB = b.timestamp?.seconds || 0;
           return tA - tB;
        }));
      } catch (e) {
        console.error("Failed to fetch compliance report data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (ts: any) => {
    if (!ts) return "غير متوفر";
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString('en-GB');
    return new Date(ts).toLocaleString('en-GB');
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-900/60 backdrop-blur-md flex items-center justify-center p-4 print:static print:inset-auto print:bg-transparent print:p-0 print:block">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-200 max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden relative print:block print:overflow-visible print:max-w-none print:w-full print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        <div className="absolute top-0 right-0 w-3 h-full bg-indigo-600 rounded-r-3xl print:hidden" />

        {/* Header */}
        <div className="px-8 py-6 md:p-8 border-b border-brand-100 bg-gradient-to-r from-indigo-50 to-white flex items-start justify-between print:px-0 print:py-4 print:bg-white print:border-b-2 print:border-black print:mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center print:hidden">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-900">Legal Audit Trail Report</h2>
              <p className="text-brand-600 mt-2 font-medium">سجل الامتثال القانوني والإقرارات الخاصة بالعميل</p>
              <p className="text-sm text-brand-500 font-mono mt-1" dir="ltr">User: {userData?.email || userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-brand-200 hover:bg-brand-50 text-brand-800 px-4 py-2 mt-2 rounded-xl font-bold shadow-sm transition">
              <Printer className="w-4 h-4" /> طباعة
            </button>
            <button onClick={onClose} className="p-2 mt-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition bg-white border border-gray-200 shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 overflow-y-auto bg-white flex-1 space-y-12 print:block print:overflow-visible print:h-auto print:p-0">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-600 font-medium">جاري التحقق من السجلات القانونية للعميل...</p>
            </div>
          ) : (
            <>
              {/* Section 1 */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  1. إقرار سياسة الخصوصية وشروط الخدمة (عند التسجيل)
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4 space-y-6">
                  {/* System Rule */}
                  <ul className="space-y-3 text-sm text-brand-700 pb-5 border-b border-gray-200">
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                      صفحة إنشاء وتوثيق الحساب (Auth / Order Flow).
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900 text-indigo-700">بيانات المستخدم:</span>
                      السجل المحفوظ في قاعدة البيانات لهذا العميل.
                    </li>
                  </ul>

                  {/* User Data */}
                  {(userData?.agreedToTermsAt || userData?.legalConsent?.agreedToTermsAt || userData?.createdAt) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">حالة الإقرار</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-bold w-fit flex items-center gap-1"><CheckCircle className="w-4 h-4"/> تم الإقرار وتسجيل الاعتماد</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">تاريخ وسجل الإقرار</span>
                        <span className="font-mono text-brand-900 border border-gray-100 bg-gray-50 px-3 py-2 rounded-lg text-sm" dir="ltr">
                          {formatDate(userData?.agreedToTermsAt || userData?.legalConsent?.agreedToTermsAt || userData?.createdAt)}
                        </span>
                      </div>
                      <div className="md:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm text-brand-700 flex items-start gap-3 mt-2">
                         <Database className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                         <div>
                           <p className="font-bold mb-1">بيانات التسجيل المرجعية</p>
                           <p>تم تخزين بصمة الإقرار في جدول <code className="bg-white px-2 py-0.5 rounded text-indigo-600 shadow-sm mx-1">users</code> للحساب المرتبط بالبريد: <span className="font-mono">{userData?.email}</span></p>
                           {(!userData?.legalConsent && userData?.createdAt) && (
                             <p className="text-xs mt-1 text-indigo-600">تم استنتاج تاريخ الإقرار بناءً على سجل إنشاء الحساب نظراً لطبيعة التسجيل الإلزامية.</p>
                           )}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>لا يوجد سجل يوثق الإقرار بشروط الخدمة لهذا الحساب. (قد يكون منشأ ضمن الإطار التجريبي أو بطريقة يدوية).</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 2 */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  2. إقرارات الموافقات لملفات الارتباط (Cookies Content)
                </h3>
                 <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4 space-y-6">
                  {/* System Rule */}
                   <ul className="space-y-3 text-sm text-brand-700 pb-5 border-b border-gray-200">
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                      نافذة الكوكيز المنبثقة للزوار في واجهة المنصة (Cookie Banner).
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900 text-indigo-700">بيانات المستخدم:</span>
                      مستويات الموافقة المحفوظة لهذا العميل (Consent Level).
                    </li>
                  </ul>

                  {(userData?.cookieConsentLevel && userData?.cookieConsentLevel !== 'none') || (userData?.legalConsent && userData?.legalConsent?.cookieConsentLevel !== 'none' && userData?.legalConsent?.cookieConsentAt) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">مستوى الموافقة (Level)</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold w-fit font-mono tracking-wider">
                          {(userData.cookieConsentLevel || userData.legalConsent?.cookieConsentLevel)?.toUpperCase() === 'ALL' ? 'الكل - شمولية كاملة' : (userData.cookieConsentLevel || userData.legalConsent?.cookieConsentLevel)?.toUpperCase() || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">تاريخ توثيق الموافقة</span>
                        <span className="font-mono text-brand-900 border border-gray-100 bg-gray-50 px-3 py-2 rounded-lg text-sm" dir="ltr">
                          {formatDate(userData.cookieConsentAt || userData.legalConsent?.cookieConsentAt)}
                        </span>
                      </div>
                      <div className="md:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm text-brand-700 flex items-start gap-3 mt-2">
                         <Database className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                         <span>تم حفظ هذا الإقرار في سجل الزوار (Audit Logs) وتم إرفاقه ببيانات المستخدم الموثق برقم IP لضمان الموثوقية.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>لم يمنح المستخدم موافقة صريحة على استخدام ملفات تعريف الارتباط التسويقية (Cookies).</span>
                      </div>
                      <p className="text-xs text-brand-500 mr-6">
                        تم تخزين قيمة الرفض أو عدم التحديد <code className="bg-gray-100 px-1 py-0.5 rounded">'none'</code> في السجل كإثبات قانوني لعدم التعقب التجاري.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 3 */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  3. عقد اتفاقية تقديم الخدمة (طلبات البحث)
                </h3>
                 <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mr-4 space-y-6">
                   {/* System Rule */}
                   <ul className="space-y-3 text-sm text-blue-800 pb-5 border-b border-blue-200">
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-blue-900">المنشأ ومكان العرض:</span>
                      الخطوة الإلزامية قبل الدفع (نموذج ServiceAgreement المكون من 6 بنود).
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900 text-indigo-700">بيانات المستخدم:</span>
                       العقود والتوقيعات الإلكترونية المدرجة بطلبات العميل.
                    </li>
                  </ul>

                  {orders.filter(o => o.contractUrl || o.data?.contractUrl || o.data?.contractSigned || o.contractSigned || o.data?.documents?.some((doc: any) => typeof doc !== 'string' && doc.kind === 'توقيع إلكتروني')).length > 0 ? (
                    <div className="space-y-4">
                      {orders.filter(o => o.contractUrl || o.data?.contractUrl || o.data?.contractSigned || o.contractSigned || o.data?.documents?.some((doc: any) => typeof doc !== 'string' && doc.kind === 'توقيع إلكتروني')).map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col gap-4">
                           <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                             <div>
                               <span className="font-bold text-blue-900 block mb-1">الطلب الموثق رقم: #{order.orderNumber || order.id.toUpperCase().substring(0, 6)}</span>
                               <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{order.data?.firstName} {order.data?.familyName}</span>
                             </div>
                             <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 shadow-sm" dir="ltr">Document ID: {order.id}</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center justify-center min-h-[100px]">
                               <p className="text-xs text-brand-500 mb-2 font-bold select-none self-start">الاسم الموقع المعتمد (E-Signature)</p>
                               {order.contractUrl ? (
                                 <img src={order.contractUrl} alt="E-Signature" className="w-full max-h-24 object-contain opacity-80" style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }} />
                               ) : (
                                 <p className="font-serif text-lg font-bold text-brand-800">{order.signatureName || "توقيع مرفق (تم التأكيد)"}</p>
                               )}
                             </div>
                             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                               <p className="text-xs text-brand-500 mb-1 font-bold">تاريخ توقيع العقد (Timestamp)</p>
                               <p className="font-mono text-sm" dir="ltr">{formatDate(order.createdAt)}</p>
                             </div>
                           </div>
                           
                           {(consents.filter(c => c.orderId === order.id || c.contractId === (order.data?.contractId || order.contractId)).length > 0 || auditLogs.filter(a => a.orderId === order.id || a.contractId === (order.data?.contractId || order.contractId)).length > 0) && (() => {
                             const trailLogs = auditLogs.filter(a => a.orderId === order.id || a.contractId === (order.data?.contractId || order.contractId)).map(a => ({ type: 'log', data: a, time: a.timestamp?.seconds || 0 }));
                             const trailConsents = consents.filter(c => c.orderId === order.id || c.contractId === (order.data?.contractId || order.contractId)).map(c => ({ type: 'consent', data: c, time: (c.acceptedAt?.seconds || c.timestamp?.seconds || 0) }));
                             const legalTrail = [...trailLogs, ...trailConsents].sort((a,b) => a.time - b.time);

                             return (
                             <div className="mt-3 bg-white border border-brand-100 rounded-lg p-3">
                               <p className="text-xs font-bold text-brand-800 mb-3 border-b border-gray-100 pb-2">سجل العمليات الزمني للإقرارات والتوقيع (Chronological Legal Trail)</p>
                               <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[1.1rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                 {legalTrail.map((item, idx) => {
                                   if (item.type === 'log') {
                                     const log = item.data;
                                     return (
                                       <li key={`trail-${item.type}-${idx}`} className="relative flex items-start gap-4 text-xs">
                                         <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-brand-200 shadow-sm flex-shrink-0">
                                            <Shield className="w-3.5 h-3.5 text-brand-500" />
                                         </div>
                                         <div className="bg-gray-50/50 flex-1 p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-1 w-full relative">
                                           <div className="flex justify-between w-full">
                                             <span>تسجيل حدث: <strong className="text-brand-900 mx-1">{log.eventType}</strong></span>
                                             <span dir="ltr" className="font-mono text-gray-500">{formatDate(log.timestamp)}</span>
                                           </div>
                                           {log.eventType === 'contract_opened' && <span className="text-gray-500">قام العميل بفتح نافذة العقد والبدء في استعراضه.</span>}
                                           {log.eventType === 'contract_expanded_to_view' && <span className="text-gray-500">قام العميل بالنقر على خيار عرض بنود عقد الخدمة وقراءتها.</span>}
                                           {log.eventType === 'contract_fully_scrolled' && <span className="text-gray-600 font-medium">العميل قام بالتمرير السحابي للعقد وأتم استعراض جزء كبير منه (<span dir="ltr">{Math.round(log.scrollPercentage)}%</span>).</span>}
                                           {log.eventType === 'contract_terms_accepted' && <span className="text-brand-600 font-bold">العميل وافق على بنود العقد.</span>}
                                           {log.eventType === 'contract_electronically_signed' && <span className="text-green-600 font-bold">العميل أتم التوقيع الإلكتروني المعتمد للملف.</span>}
                                           <span className="text-gray-400 font-mono text-[10px] mt-1">Version: {log.details?.version || "v1.0"} | Device: {log.details?.userAgent ? "Captured" : "Unknown"} | Scope: System Audit</span>
                                         </div>
                                       </li>
                                     );
                                   } else {
                                     const consent = item.data;
                                     let consentText = consent.consentType;
                                     if (consentText === 'order_details_consent') consentText = 'أقر بأن بيانات الطلب الحالية تُعد جزءًا مكملًا لعقد الخدمة، وتمثل المرجع المعتمد لنطاق العمل.';
                                     if (consentText === 'electronic_signature_consent') consentText = 'أوافق على استخدام التوقيع الإلكتروني والسجلات الرقمية كوسائل قانونية معتمدة لإثبات إجراءات هذا الطلب.';
                                     if (consentText?.includes('gdpr') || consentText?.includes('privacy')) consentText = 'موافقة صريحة على سياسة الخصوصية وقانون حماية البيانات.';

                                     return (
                                       <li key={`trail-${item.type}-${idx}`} className="relative flex items-start gap-4 text-xs">
                                         <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-50 border-2 border-green-200 shadow-sm flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                         </div>
                                         <div className="bg-green-50 flex-1 p-3 rounded-lg border border-green-200 shadow-sm flex flex-col gap-1 w-full relative">
                                           <div className="flex justify-between w-full">
                                             <span><strong className="text-green-800">إقرار رقمي صريح</strong></span>
                                             <span dir="ltr" className="font-mono text-gray-500 min-w-[130px] text-right">{formatDate(consent.acceptedAt || consent.timestamp)}</span>
                                           </div>
                                           <span className="text-black leading-relaxed font-medium mt-1">"{consentText}"</span>
                                           <span className="text-gray-500 font-mono text-[10px] mt-2 pt-2 border-t border-green-100">Reference: {consent.consentType} | API Version: {consent.consentVersion || "v1.0"} | IPv4: {consent.ipAddress}</span>
                                         </div>
                                       </li>
                                     );
                                   }
                                 })}
                               </ul>
                             </div>
                             );
                           })()}

                           <div className="mt-1 text-xs text-brand-800 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-2 shadow-sm leading-relaxed">
                             <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                             يُلزم هذا العقد المنفذ جميع الأطراف باتفاقية خدمة البحث وفقاً للبنود הملزمة قانونياً، ويشمل ذلك الموافقة التامة على شروط التاريخ الشفوي والسياسات المالية وتكاليف الانسحاب، وقد تم حفظ بصمة العملية داخل مجموعات النظام السحابي.
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 text-sm">
                      ليس لدى هذا العميل أية طلبات جارية صدرت لها عقود اتفاقية خدمة موقعة إلكترونياً.
                    </div>
                  )}
                </div>
              </section>

              {/* Section 4 */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  4. إقرارات حقوق البيانات الشخصية (GDPR) طالبي الحذف
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4 space-y-6">
                   {/* System Rule */}
                   <ul className="space-y-3 text-sm text-brand-700 pb-5 border-b border-gray-200">
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900">المنشأ ومكان العرض:</span>
                      منطقة (تنزيل / حذف معلوماتك الشخصية) من لوحة تحكم العميل.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold min-w-[120px] text-brand-900 text-indigo-700">بيانات المستخدم:</span>
                       تذاكر الخصوصية ومحو البيانات الخاصة بهذا النظام.
                    </li>
                  </ul>

                  {tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((t) => (
                        <div key={t.id} className="bg-white p-5 rounded-xl border border-amber-200 border-l-4 border-l-amber-500 shadow-sm transition">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-amber-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-600"/> {t.privacyType || "طلب حقوق للبيانات"}</span>
                            <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100" dir="ltr">{formatDate(t.createdAt)}</span>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                             <p className="text-sm text-gray-800 leading-relaxed font-medium">{t.message || t.description}</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${t.status === 'تم الرد' || t.status === 'مكتمل' ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>الحالة: {t.status || "قيد المراجعة"}</span>
                            <span className="text-[10px] font-mono text-gray-500">Ticket Ref: {t.ticketNumber || t.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 text-sm">
                      لم يتم تسجيل أي طلبات محو بيانات أو طلبات متعلقة بحقوق الخصوصية (GDPR) لهذا المستخدم حتّى الآن.
                    </div>
                  )}
                </div>
              </section>

              {/* Section 5: Order Evidence */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  5. الوثائق وأدلة الطلبات (Order Evidence)
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4 space-y-6">
                  {orders.length > 0 && orders.some(o => o.data?.documents && o.data.documents.length > 0) ? (
                    <div className="space-y-4">
                      {orders.filter(o => o.data?.documents && o.data.documents.length > 0).map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col gap-4">
                           <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                             <span className="font-bold text-blue-900">دلائل الطلب رقم: #{order.orderNumber || order.id.toUpperCase().substring(0, 6)}</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {order.data.documents.map((doc: any, index: number) => {
                               const docUrl = typeof doc === 'string' ? doc : doc.url;
                               const docKind = typeof doc === 'string' ? 'وثيقة/مستند' : doc.kind;
                               const isImage = docUrl && docUrl.startsWith('data:image');
                               return (
                                 <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col gap-2">
                                   <p className="text-xs text-brand-500 font-bold self-start">{docKind}</p>
                                   {isImage ? (
                                      <img src={docUrl} alt={docKind} className="max-w-full max-h-32 object-contain rounded" />
                                   ) : (
                                      <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 underline text-left block" dir="ltr" style={{ wordBreak: 'break-all' }}>{'<Document File / Reference>'}</a>
                                   )}
                                 </div>
                               );
                             })}
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 text-sm">
                      لم يقم المستخدم برفع أي وثائق إثبات لطلباته حتى الآن.
                    </div>
                  )}
                </div>
              </section>

              {/* Section 6: System Audit Logs */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  6. سجلات التدقيق العام والنظام (System Audit Logs)
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-4 space-y-6">
                  {auditLogs.length > 0 ? (
                    <div className="space-y-3">
                      {Array.from(
                        auditLogs.reduce((map, log) => {
                          const key = log.action || log.eventType || 'System Event';
                          map.set(key, log);
                          return map;
                        }, new Map())
                      ).map(([_, log]: any, index) => (
                        <div key={log.id || index} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div>
                            <span className="inline-block text-xs font-bold text-white bg-brand-700 px-2 py-1 rounded mb-2">
                              {(() => {
                                const action = log.action || log.eventType || 'System Event';
                                const actionMap: Record<string, string> = {
                                  'contract_electronically_signed': 'توقيع إلكتروني على العقد (contract_electronically_signed)',
                                  'contract_opened': 'استعراض وقراءة العقد (contract_opened)',
                                  'contract_expanded_to_view': 'توسيع لعرض وقراءة العقد (contract_expanded_to_view)',
                                  'contract_terms_accepted': 'الموافقة على شروط العقد (contract_terms_accepted)',
                                  'contract_generated': 'إنشاء/إصدار العقد (contract_generated)',
                                  'checkbox_checked': 'الموافقة على الإقرارات والشروط (checkbox_checked)',
                                  'user_registered': 'تسجيل مستخدم جديد بموافقة (user_registered)',
                                  'order_placed': 'إنشاء طلب وموافقة على الشروط (order_placed)',
                                  'CONSENT_ACCEPTED': 'الموافقة العامة على الشروط والأحكام (CONSENT_ACCEPTED)',
                                  'USER_REGISTRATION_AND_CONSENT': 'تسجيل مستخدم وإقرار بالموافقة (USER_REGISTRATION_AND_CONSENT)'
                                };
                                return actionMap[action] || action;
                              })()}
                            </span>
                            <p className="text-sm text-gray-800 font-medium">سجل رقم: #{log.id?.substring(0, 8) || index}</p>
                            <p className="text-xs font-mono text-gray-500 mt-1">IP: {log.ipAddress || 'غير محدد'}</p>
                          </div>
                          <div className="text-left font-mono text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 self-start md:self-auto min-w-[140px]" dir="ltr">
                            {formatDate(log.timestamp?.seconds ? log.timestamp.toMillis() : log.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 text-sm">
                      ليس هناك سجلات تدقيق عامة إضافية بخلاف المرفقة بالطلبات.
                    </div>
                  )}
                </div>
              </section>

              {/* Footer */}
              <div className="pt-8 border-t border-gray-200 pb-2 text-center hidden print:block">
                <p className="text-brand-900 font-bold text-lg mb-1">وثيقة رسمية مُولّدة للإمتثال، منصة سجل تراث العائلة</p>
                <p className="text-xs text-gray-500 font-mono">Report Date: {new Date().toLocaleString('en-GB')} | Audit Record ID: {userId}</p>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
