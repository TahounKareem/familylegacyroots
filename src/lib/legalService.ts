import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";

interface LegalSnapshot {
  [key: string]: any;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.log('Firestore Error suppressed:', JSON.stringify(errInfo.error));
}

// Helper to remove undefined values before saving to Firestore
function sanitizeSnapshot(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeSnapshot);
  const result: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = sanitizeSnapshot(obj[key]);
    }
  }
  return result;
}

const contractSequences: Record<string, number> = {};
let currentSessionId = "";
if (typeof window !== "undefined") {
  currentSessionId = sessionStorage.getItem('legal_session_id') || "";
  if (!currentSessionId) {
    currentSessionId = crypto.randomUUID();
    sessionStorage.setItem('legal_session_id', currentSessionId);
  }
}

interface LegalProfileUpdate {
  latestContractId?: string;
  latestOrderId?: string;
  activeContractStatus?: string;
  contractsCount?: any; 
  legalRiskFlag?: string;
  lastAgreementVersion?: string;
  lastConsentAt?: any;
  lastPaymentStatus?: string;
  lastUpdatedAt?: any;
}

async function updateUserLegalProfile(updates: LegalProfileUpdate) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { 
      legalProfile: sanitizeSnapshot({
        ...updates,
        lastUpdatedAt: serverTimestamp()
      }) 
    }, { merge: true });
  } catch (err) {
    console.error("Failed to update user legal profile", err);
  }
}

let cachedIp = "";

export async function logLegalEvent(eventType: string, metadata: any = {}, contractId?: string, orderId?: string) {
  const user = auth.currentUser;
  if (!user) return;
  
  if (!cachedIp && typeof window !== 'undefined') {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      if (data.ip) cachedIp = data.ip;
    } catch (e) {
      cachedIp = "غير متوفر";
    }
  }

  const sequenceKey = contractId || orderId || "general";
  contractSequences[sequenceKey] = (contractSequences[sequenceKey] || 0) + 1;
  const pageUrl = typeof window !== "undefined" ? window.location.pathname : "";

  try {
    const eventPayload = {
      userId: user.uid,
      orderId: orderId || null,
      contractId: contractId || null,
      eventType,
      timestamp: serverTimestamp(),
      ...sanitizeSnapshot(metadata),
      userAgent: navigator.userAgent,
      sessionId: currentSessionId,
      pageUrl,
      eventSequence: contractSequences[sequenceKey],
      ipAddress: cachedIp || "غير متوفر"
    };
    
    await addDoc(collection(db, "audit_logs"), eventPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "audit_logs");
  }
}

export async function createLegalContractRecord(
  contractId: string, 
  orderId: string, 
  contractVersion: string, 
  status: string,
  customerSnapshot: LegalSnapshot,
  shippingSnapshot: LegalSnapshot,
  orderSnapshot: LegalSnapshot
) {
  const user = auth.currentUser;
  if (!user) return;

  const cleanCustomerSnapshot = { 
    id: customerSnapshot.uid || customerSnapshot.id || user.uid,
    name: customerSnapshot.displayName || customerSnapshot.name || user.displayName || "Unknown",
    email: customerSnapshot.email || user.email || "Unknown",
    role: customerSnapshot.role || "user" 
  };

  try {
    const contractRef = doc(db, "legal_contracts", contractId);
    await setDoc(contractRef, {
      userId: user.uid,
      orderId,
      contractVersion,
      status,
      agreementType: "service_agreement",
      contractGeneratedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      customerSnapshot: sanitizeSnapshot(cleanCustomerSnapshot),
      shippingSnapshot: sanitizeSnapshot(shippingSnapshot),
      orderSnapshot: sanitizeSnapshot(orderSnapshot)
    }, { merge: true }); // Make it merge true for safety
    
    await logLegalEvent("contract_generated", { contractVersion }, contractId, orderId);
    await updateUserLegalProfile({
      latestContractId: contractId,
      latestOrderId: orderId,
      activeContractStatus: status,
      contractsCount: increment(1),
      legalRiskFlag: "none",
      lastAgreementVersion: contractVersion,
    });
    
    // Ensure legal versions tracking document exists (Admin/Safe create)
    try {
      const adminDoc = doc(db, "legal_versions", contractVersion || "v1.0");
      await setDoc(adminDoc, {
          termsVersion: contractVersion || "v1.0",
          privacyVersion: "v1.0",
          cookiesVersion: "v1.0",
          serviceAgreementVersion: contractVersion || "v1.0",
          refundVersion: "v1.0",
          billingVersion: "v1.0",
          activatedAt: serverTimestamp(),
          isActive: true
      }, { merge: true });
    } catch (ignore) {
      // Ignore permission denied for normal users
    }

  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `legal_contracts/${contractId}`);
  }
}

export async function updateLegalContractRecord(
  contractId: string, 
  updates: Record<string, any>
) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const contractRef = doc(db, "legal_contracts", contractId);
    await setDoc(contractRef, sanitizeSnapshot({
      ...updates,
      updatedAt: serverTimestamp()
    }), { merge: true });
    
    if (updates.status) {
      await updateUserLegalProfile({
        activeContractStatus: updates.status,
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `legal_contracts/${contractId}`);
  }
}

export async function recordLegalConsent(
  consentType: string,
  metadata: any = {},
  contractId?: string,
  orderId?: string,
  preferences: any = { essential: true, analytics: false, marketing: false }
) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    if (!cachedIp && typeof window !== 'undefined') {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        if (data.ip) cachedIp = data.ip;
      } catch (e) {
        cachedIp = "غير متوفر";
      }
    }

    const consentDocId = contractId ? `${contractId}_${consentType}` : `${user.uid}_${consentType}_${Date.now()}`;
    const consentPayload = sanitizeSnapshot({
      userId: user.uid,
      orderId: orderId || null,
      contractId: contractId || null,
      consentType,
      consentVersion: metadata.version || "v1.0",
      accepted: true,
      preferences,
      acceptedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: cachedIp || "غير متوفر",
      ...metadata
    });
    await setDoc(doc(db, "legal_consents", consentDocId), consentPayload, { merge: true });
    
    await logLegalEvent("checkbox_checked", { consentType, ...metadata }, contractId, orderId);
    await updateUserLegalProfile({
      lastConsentAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "legal_consents");
  }
}

export async function createOrderEvidence(
  orderId: string,
  contractId: string,
  orderDetailsSnapshot: LegalSnapshot
) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const evidenceRef = doc(db, "order_evidence", orderId);
    await setDoc(evidenceRef, sanitizeSnapshot({
      userId: user.uid,
      orderId,
      contractId,
      orderDetailsSnapshot,
      generatedAt: serverTimestamp(),
    }), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `order_evidence/${orderId}`);
  }
}
