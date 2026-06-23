import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Shield, FileCheck, Users, FileText, CheckCircle, AlertCircle, Save, Plus, ChevronDown, ChevronUp, History, ListChecks } from "lucide-react";
import { collection, onSnapshot, getDocs, updateDoc, doc, setDoc, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { legalContent, LegalSection } from "../../pages/Legal";

// -- Interfaces --

interface ComplianceUser {
  id: string;
  name?: string;
  email?: string;
  createdAt?: string;
  agreedToTermsAt?: string;
  agreedToTermsLevel?: string;
  cookieConsentLevel?: string;
  cookieConsentAt?: string;
  ipAddress?: string;
  legalConsent?: {
    agreedToTerms?: boolean;
    agreedToTermsAt?: string;
    cookieConsentLevel?: string;
    cookieConsentAt?: string;
    ipAddress?: string;
  };
}

interface ComplianceOrder {
  id: string;
  userId: string;
  data: any;
  isDeleted?: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  details: string;
  timestamp: string | any;
  ipAddress?: string;
  eventType?: string;
  preferences?: any;
}

interface DocumentVersion {
  id?: string;
  version: string;
  title: string;
  content: string;
  effectiveDate: string;
  lastUpdated: string;
}

import { UserComplianceReport } from "./UserComplianceReport";
import { LegalAuditTrailReport } from "./LegalAuditTrailReport";

export function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<"users_consents" | "visitors_consents" | "legal_versions" | "legal_audit_trail">("users_consents");
  const [selectedUserReport, setSelectedUserReport] = useState<string | null>(null);
  
  // Data State
  const [users, setUsers] = useState<ComplianceUser[]>([]);
  const [orders, setOrders] = useState<ComplianceOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  // Legal Docs State
  const [selectedDocId, setSelectedDocId] = useState<string>("terms");
  const [docContent, setDocContent] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docVersion, setDocVersion] = useState("");
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [docSections, setDocSections] = useState<LegalSection[]>([]);
  
  useEffect(() => {
    async function loadDoc() {
      try {
        const { getDoc } = await import('firebase/firestore');
        const docRef = doc(db, "legal_documents", selectedDocId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data().latestVersion;
          if (data && data.sections && data.sections.length > 0) {
            setDocTitle(data.title || "");
            setDocVersion(data.version || "");
            setDocSections(data.sections);
            return;
          }
        }
      } catch (e) {
         console.warn("Could not load from firestore, using local template");
      }
      
      const defaultDoc = legalContent[selectedDocId as keyof typeof legalContent]?.['ar'];
      if (defaultDoc) {
        setDocTitle(defaultDoc.title);
        setDocVersion(defaultDoc.version);
        setDocSections(defaultDoc.sections.map(s => ({ 
          ...s, 
          html: s.html || (s.content ? renderToStaticMarkup(s.content as React.ReactElement) : "")
        })));
      }
    }
    loadDoc();
  }, [selectedDocId]);

  const handleSectionHtmlChange = (index: number, html: string) => {
    const newSections = [...docSections];
    newSections[index].html = html;
    setDocSections(newSections);
  };

  const availableDocs = [
    { id: "terms", label: "شروط استخدام الموقع والمنصة" },
    { id: "privacy", label: "سياسة الخصوصية وسرية البيانات" },
    { id: "cookies", label: "سياسة ملفات تعريف الارتباط" },
    { id: "refund", label: "سياسة الإلغاء وعدم الاسترجاع" },
    { id: "payments", label: "سياسة الدفع والفوترة والمعاملات المالية" },
    { id: "service_agreement", label: "عقد تقديم الخدمة" }
  ];

  useEffect(() => {
    // 1. Fetch Users
    const unSubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const data: ComplianceUser[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setUsers(data);
    }, () => {});

    // 2. Fetch Orders
    const unSubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setOrders(data);
    }, () => {});

    // 3. Fetch Audit Logs for Visitors/Consents
    const auditQuery = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"));
    const unSubLogs = onSnapshot(auditQuery, (snap) => {
      const data: AuditLog[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() } as AuditLog));
      setAuditLogs(data);
    }, () => {});

    return () => {
      unSubUsers();
      unSubOrders();
      unSubLogs();
    };
  }, []);

  const handleSaveLegalVersion = async () => {
    if (!docVersion || !docTitle) {
      alert("الرجاء تعبئة كافة الحقول (العنوان - رقم الإصدار)");
      return;
    }
    
    setIsSavingDoc(true);
    try {
      const effectiveDate = new Date().toISOString().split("T")[0];
      const safeSections = docSections.map(s => ({
        id: s.id,
        title: s.title,
        html: s.html || ""
      }));
      
      const newVersion = {
        title: docTitle,
        version: docVersion,
        sections: safeSections,
        effectiveDate,
        lastUpdated: effectiveDate,
        createdAt: new Date().toISOString()
      };
      
      const docRef = doc(db, "legal_documents", selectedDocId);
      await setDoc(docRef, { latestVersion: newVersion, ...newVersion }, { merge: true });
      await addDoc(collection(docRef, "versions"), newVersion);
      
      alert("تم إصدار وحفظ النسخة الجديدة بنجاح. ستنعكس فوراً في واجهة المستخدم.");
      setDocVersion("");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ الوثيقة.");
    }
    setIsSavingDoc(false);
  };

  const renderUsersConsents = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <h3 className="font-bold text-lg text-brand-900">سجل إقرارات المستخدمين المسجلين</h3>
          </div>
          <span className="text-sm font-medium text-brand-700 bg-white px-3 py-1 border border-brand-200 rounded-full">
            إجمالي: {users.length} مستخدم
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-brand-50 text-brand-800 border-b border-brand-100">
              <tr>
                <th className="px-6 py-4 font-bold">المستخدم</th>
                <th className="px-6 py-4 font-bold">قبول الشروط والتسجيل</th>
                <th className="px-6 py-4 font-bold">ملفات الارتباط (Cookies)</th>
                <th className="px-6 py-4 font-bold">عقد تقديم الخدمة (إن وجد)</th>
                <th className="px-6 py-4 font-bold">IP Address</th>
                <th className="px-6 py-4 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {users.map(u => {
                // Find user orders and check if any has a signed contract
                const userOrders = orders.filter(o => o.userId === u.id && !o.isDeleted);
                const hasSignedContract = userOrders.some(o => 
                  o.contractUrl || o.data?.contractUrl || o.contractSigned || o.data?.contractSigned || o.data?.documents?.some((doc: any) => typeof doc !== 'string' && doc.kind === 'توقيع إلكتروني')
                );

                return (
                  <tr key={u.id} className="hover:bg-brand-50/50 transition">
                    <td className="px-6 py-4 text-brand-900 font-semibold">{u.name || "عضو"} <br/><span className="text-xs text-brand-500 font-normal">{u.email}</span></td>
                    <td className="px-6 py-4">
                      {u.legalConsent?.agreedToTermsAt || u.agreedToTermsAt || u.createdAt ? (
                        <span className="flex items-center gap-1 text-green-700 text-xs bg-green-50 px-2 py-1 rounded-md w-fit">
                          <CheckCircle className="w-3 h-3" />
                          مقبول - {new Date(u.legalConsent?.agreedToTermsAt || u.agreedToTermsAt || u.createdAt || '').toLocaleDateString("ar-SA")}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">غير متوفر</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(u.legalConsent?.cookieConsentLevel && u.legalConsent?.cookieConsentLevel !== 'none') || (u.cookieConsentLevel && u.cookieConsentLevel !== 'none') ? (
                        <span className="flex items-center gap-1 text-brand-700 text-xs bg-brand-100 px-2 py-1 rounded-md w-fit inline-block">
                          {(u.legalConsent?.cookieConsentLevel || u.cookieConsentLevel) === 'all' ? 'الكل' : (u.legalConsent?.cookieConsentLevel || u.cookieConsentLevel)}
                        </span>
                      ) : (
                         <span className="text-gray-400 text-xs">رفض / غير محدد</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {hasSignedContract ? (
                        <span className="flex items-center gap-1 text-blue-700 text-xs bg-blue-50 px-2 py-1 rounded-md w-fit border border-blue-200">
                           <FileCheck className="w-3 h-3" /> تم التوقيع
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">لم يوقع</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500" dir="ltr">
                      {
                        // Prioritize audit logs to get the real recorded IP instead of the security server message
                        auditLogs.find(log => log.userId === u.id && log.ipAddress && log.ipAddress !== "تم تسجيلها بواسطة سيرفر أمان النظام")?.ipAddress 
                        || u.legalConsent?.ipAddress 
                        || u.ipAddress 
                        || "N/A"
                      }
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedUserReport(u.id)}
                        className="bg-brand-800 hover:bg-brand-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center whitespace-nowrap"
                      >
                        <FileText className="w-3 h-3 ml-1" /> عرض التقرير التفصيلي
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderVisitorsConsents = () => {
    const displayedLogs = auditLogs.filter(log => {
      const actionValue = log?.action || log?.eventType || "";
      return actionValue.includes('CONSENT') || actionValue.includes('REGISTRATION') || actionValue.includes('checkbox');
    });
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-brand-600" />
            <h3 className="font-bold text-lg text-brand-900">سجل التدقيق والموافقات العامة (Audit Trail)</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 p-4 border border-blue-100 rounded-xl mb-6">
            <p className="text-sm text-blue-800 font-semibold leading-relaxed mb-1">
              ألية عمل تتبع الزوار والموافقات:
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              لضمان عدم جمع بيانات شخصية (PII) للزوار العابرين وحماية للخصوصية، يتم حفظ تفضيلات الكوكيز محلياً في متصفح الزائر. وعند التسجيل أو تقديم طلب، يتم رفع كافة سجلات الموافقات وIP Address إلى نظامنا كدليل امتثال قانوني. 
              أدناه تجد جميع أحداث الموافقات المسجلة.
            </p>
          </div>
          <div className="space-y-4">
            {displayedLogs.length === 0 ? (
               <p className="text-center text-sm text-gray-500 py-8">لا يوجد سجلات متوفرة.</p>
            ) : (
              displayedLogs.map(log => {
                const actionValue = log.action || log.eventType || "حدث";
                let dateString = "غير متاح";
                if (log.timestamp) {
                  const ts = typeof log.timestamp.toMillis === 'function' ? log.timestamp.toMillis() : log.timestamp;
                  dateString = new Date(ts).toLocaleString("en-GB");
                }
                return (
                  <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-50/50 p-4 rounded-xl border border-brand-100">
                    <div>
                      <span className="inline-block text-xs font-bold text-white bg-brand-700 px-2 py-1 rounded mb-2">
			{(() => {
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
			  return actionMap[actionValue] || actionValue;
			})()}
                      </span>
                      <p className="text-sm font-semibold text-brand-900">{log.details || JSON.stringify(log.preferences || {})}</p>
                      {log.ipAddress && <p className="text-xs text-brand-600 mt-1 font-mono" dir="ltr">IP: {log.ipAddress}</p>}
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-semibold text-gray-500 whitespace-nowrap" dir="ltr">
                         {dateString}
                       </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLegalVersions = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            <h3 className="font-bold text-lg text-brand-900">إدارة إصدارات الوثائق القانونية</h3>
          </div>
          <span className="text-xs text-brand-600 font-semibold bg-white border border-brand-200 px-3 py-1 rounded flex items-center gap-1">
             <AlertCircle className="w-4 h-4"/> ينعكس فوراً في الموقع
          </span>
        </div>
        
        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-800 mb-2">اختر الوثيقة لإصدار نسخة جديدة</label>
              <select 
                value={selectedDocId} 
                onChange={e => setSelectedDocId(e.target.value)}
                className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none appearance-none bg-white font-semibold text-brand-900"
              >
                {availableDocs.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-brand-800 mb-2">رقم الإصدار الجديد</label>
                  <input type="text" placeholder="مثال: V2.1" value={docVersion} onChange={e => setDocVersion(e.target.value)}
                         className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" dir="ltr" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-brand-800 mb-2">عنوان الوثيقة (للعرض)</label>
                  <input type="text" placeholder="مثال: شروط الاستخدام" value={docTitle} onChange={e => setDocTitle(e.target.value)}
                         className="w-full border border-brand-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none" />
               </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-800 mb-4">هيكلة ومحتوى الوثيقة (اضغط على أي قسم للتعديل مباشرة)</label>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Table of contents preview */}
              <div className="lg:w-1/4">
                <div className="sticky top-6 bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
                  <h3 className="text-sm font-bold text-brand-900 mb-4 pb-4 border-b border-brand-100">فهرس المحتويات</h3>
                  <nav className="space-y-1">
                    {docSections.map((section) => (
                      <div key={section.id} className="block w-full text-right px-3 py-2 text-xs text-brand-600 truncate border-r-2 border-transparent hover:border-brand-500 hover:text-brand-900 transition-colors">
                        {section.title}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
              
              {/* Sections Edit */}
              <div className="lg:w-3/4 space-y-6">
                {docSections.map((section, index) => (
                  <section key={section.id} className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 transition">
                    <h2 className="font-serif text-xl font-bold text-brand-900 mb-4 pb-3 border-b border-brand-50">
                      {section.title}
                    </h2>
                    <div className="prose prose-brand max-w-none font-light leading-relaxed text-sm">
                      <div 
                        contentEditable 
                        className="outline-none min-h-[100px] p-2 hover:bg-brand-50/50 rounded-lg transition"
                        dangerouslySetInnerHTML={{ __html: section.html || "" }}
                        onBlur={(e) => handleSectionHtmlChange(index, e.currentTarget.innerHTML)}
                      />
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            disabled={isSavingDoc}
            onClick={handleSaveLegalVersion}
            className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
          >
            {isSavingDoc ? "جاري الحفظ والتعميم..." : <><Save className="w-5 h-5"/> حفظ كإصدار جاري العمل به عبر كافة صفحات المنصة</>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${selectedUserReport ? 'print:hidden' : ''}`}>
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-900 mb-2">بوابة الرقابة و الإمتثال</h2>
          <p className="text-brand-600 text-sm">مراجعة الموافقات، السجلات القانونية، وإصدارات السياسات المتوافقة مع الخصوصية.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-brand-100 w-fit shadow-sm ${selectedUserReport ? 'print:hidden' : ''}`}>
        <button
          onClick={() => setActiveTab("users_consents")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === "users_consents" ? "bg-brand-800 text-white shadow-md" : "text-brand-600 hover:bg-brand-50"}`}
        >
          <Users className="w-4 h-4"/> إقرارات المستخدمين
        </button>
        <button
          onClick={() => setActiveTab("visitors_consents")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === "visitors_consents" ? "bg-brand-800 text-white shadow-md" : "text-brand-600 hover:bg-brand-50"}`}
        >
          <History className="w-4 h-4"/> إقرارات الزوار والتدقيق
        </button>
        <button
          onClick={() => setActiveTab("legal_versions")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === "legal_versions" ? "bg-brand-800 text-white shadow-md" : "text-brand-600 hover:bg-brand-50"}`}
        >
          <FileText className="w-4 h-4"/> إدارة النسخ القانونية
        </button>
        <button
          onClick={() => setActiveTab("legal_audit_trail")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === "legal_audit_trail" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-600 hover:bg-indigo-50 border border-indigo-100"}`}
        >
          <ListChecks className="w-4 h-4"/> Legal Audit Trail
        </button>
      </div>

      <div className={`min-h-[500px] ${selectedUserReport ? 'print:hidden' : ''}`}>
        {activeTab === "users_consents" && renderUsersConsents()}
        {activeTab === "visitors_consents" && renderVisitorsConsents()}
        {activeTab === "legal_versions" && renderLegalVersions()}
        {activeTab === "legal_audit_trail" && <LegalAuditTrailReport />}
      </div>

      {selectedUserReport && (
        <UserComplianceReport userId={selectedUserReport} onClose={() => setSelectedUserReport(null)} />
      )}
    </div>
  );
}
