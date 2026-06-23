import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Shield, X, FileText, CheckCircle, Clock, Database, AlertCircle, Printer } from 'lucide-react';

export function UserComplianceReport({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

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
    <div className="fixed inset-0 z-50 bg-brand-900/60 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white print:block">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-200 max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden relative print:shadow-none print:border-none print:max-h-none">
        
        <div className="absolute top-0 right-0 w-3 h-full bg-indigo-600 rounded-r-3xl print:hidden" />

        {/* Header */}
        <div className="px-8 py-6 border-b border-brand-100 bg-gradient-to-r from-indigo-50 to-white flex items-center justify-between print:bg-white print:border-b-2 print:border-black">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white shadow-sm border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center print:hidden">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-900">تقرير الإمتثال التفصيلي (User Audit)</h2>
              <p className="text-sm text-brand-600 font-mono mt-1" dir="ltr">User: {userData?.email || userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-brand-200 hover:bg-brand-50 text-brand-800 px-4 py-2 rounded-xl font-bold shadow-sm transition">
              <Printer className="w-4 h-4" /> طباعة
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition bg-white border border-gray-200 shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 overflow-y-auto bg-white flex-1 space-y-12 print:overflow-visible">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-600 font-medium">جاري سحب السجلات القانونية للعميل...</p>
            </div>
          ) : (
            <>
              {/* Section 1 */}
              <section className="relative">
                <div className="absolute -right-4 top-2 text-indigo-200 print:hidden">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                  1. إقرار سياسة الخصوصية وشروط الخدمة
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-6">
                  {userData?.agreedToTermsAt ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">حالة الإقرار</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-bold w-fit flex items-center gap-1"><CheckCircle className="w-4 h-4"/> تم الإقرار وتسجيل الاعتماد</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">تاريخ وسجل الإقرار</span>
                        <span className="font-mono text-brand-900 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm" dir="ltr">
                          {formatDate(userData.agreedToTermsAt)}
                        </span>
                      </div>
                      <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 text-sm text-brand-700 flex items-start gap-3 mt-2">
                         <Database className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                         <div>
                           <p className="font-bold mb-1">بيانات التسجيل المرجعية</p>
                           <p>تم تخزين بصمة الإقرار في مجموعة المستخدمين (Users Table) للحساب المرتبط بالبريد: <span className="font-mono">{userData?.email}</span></p>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <AlertCircle className="w-5 h-5" />
                      <span>لا يوجد سجل يوثق الإقرار بشروط الخدمة (قد يكون الحساب منشأ ضمن الإطار التجريبي أو قبل التحديثات).</span>
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
                  2. إقرارات الموافقة على ملفات الارتباط (Cookies)
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-6">
                  {userData?.cookieConsentAt ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">مستوى الموافقة (Consent Level)</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold w-fit font-mono tracking-wider">
                          {userData.cookieConsentLevel?.toUpperCase() || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-brand-500 font-bold">تاريخ توثيق الموافقة</span>
                        <span className="font-mono text-brand-900 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm" dir="ltr">
                          {formatDate(userData.cookieConsentAt)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> لم يتخذ المستخدم إجراء بشأن ملفات الإرتباط بعد.
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
                  3. عقود تقديم الخدمات (طلبات الأنساب الموثقة)
                </h3>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mr-6">
                  {orders.filter(o => o.contractSigned).length > 0 ? (
                    <div className="space-y-4">
                      {orders.filter(o => o.contractSigned).map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col gap-4">
                           <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                             <div>
                               <span className="font-bold text-blue-900 block mb-1">الطلب المنشأ رقم: #{order.orderNumber || order.id.toUpperCase().substring(0, 6)}</span>
                               <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{order.data?.firstName} {order.data?.familyName}</span>
                             </div>
                             <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100" dir="ltr">ID: {order.id}</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                               <p className="text-xs text-brand-500 mb-1 font-bold">الاسم الموقع المعتمد (E-Signature)</p>
                               <p className="font-serif text-lg font-bold text-brand-800">{order.signatureName || "توقيع غير مسجل بصيغة نصية"}</p>
                             </div>
                             <div>
                               <p className="text-xs text-brand-500 mb-1 font-bold">تاريخ توقيع العقد (Timestamp)</p>
                               <p className="font-mono text-sm" dir="ltr">{formatDate(order.createdAt)}</p>
                             </div>
                           </div>
                           <div className="mt-2 text-xs text-brand-700 bg-blue-50/50 p-3 rounded-lg border border-blue-50 flex items-start gap-2">
                             <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                             يقر المترجم بهذا على إبرام اتفاقية خدمة البحث وفقاً للبنود الـ 6 الملزمة ضمن مرحلة الطلب، وتشمل الموافقة على إجراء شروط التاريخ الشفوي والسياسات المالية للإنسحاب.
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 text-sm">
                      ليس لدى العميل أي طلبات مسرى عليها بالعقود الإلكترونية.
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
                  4. إقرارات ومطالبات حقوق البيانات (GDPR)
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mr-6">
                  {tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((t) => (
                        <div key={t.id} className="bg-white p-4 rounded-xl border border-amber-200 border-l-4 border-l-amber-500 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-amber-900">{t.privacyType || "طلب إداري للبيانات"}</span>
                            <span className="font-mono text-xs text-gray-500" dir="ltr">{formatDate(t.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{t.message || t.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${t.status === 'تم الرد' ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>{t.status || "قيد المراجعة"}</span>
                            <span className="text-[10px] font-mono text-gray-500">Ticket: {t.ticketNumber || t.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 p-4 bg-white rounded-xl border border-gray-200 text-sm">
                      لم يتم تسجيل أي طلبات محو بيانات أو طلبات متعلقة بحقوق الخصوصية (GDPR) لهذا المستخدم.
                    </div>
                  )}
                </div>
              </section>

              {/* Footer */}
              <div className="pt-8 border-t border-gray-200 text-center hidden print:block">
                <p className="text-brand-900 font-bold text-lg mb-1">وثيقة رسمية للإمتثال لمنصة سجل تراث العائلة</p>
                <p className="text-sm text-gray-500 font-mono">Date Generated: {new Date().toLocaleString('en-GB')} | Record ID: {userId}</p>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
