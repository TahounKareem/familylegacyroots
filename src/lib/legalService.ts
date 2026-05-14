import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";

interface LegalSnapshot {
  [key: string]: any;
}

export async function logLegalEvent(eventType: string, metadata: any = {}, contractId?: string, orderId?: string) {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    await addDoc(collection(db, "audit_logs"), {
      userId: user.uid,
      orderId: orderId || null,
      contractId: contractId || null,
      eventType,
      timestamp: serverTimestamp(),
      metadata,
      userAgent: navigator.userAgent,
    });
  } catch (error) {
    console.error("Legal Evidentiary logging failed:", error);
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
      customerSnapshot,
      shippingSnapshot,
      orderSnapshot
    });
    
    await logLegalEvent("contract_generated", { contractVersion }, contractId, orderId);
  } catch (error) {
    console.error("Failed to create legal contract:", error);
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
    await setDoc(contractRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Failed to update legal contract:", error);
  }
}

export async function recordLegalConsent(
  consentType: string,
  metadata: any = {},
  contractId?: string,
  orderId?: string
) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "legal_consents"), {
      userId: user.uid,
      orderId: orderId || null,
      contractId: contractId || null,
      consentType,
      accepted: true,
      acceptedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      ...metadata
    });
    
    await logLegalEvent("checkbox_checked", { consentType, ...metadata }, contractId, orderId);
  } catch (error) {
    console.error("Failed to record legal consent:", error);
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
    await addDoc(collection(db, "order_evidence"), {
      userId: user.uid,
      orderId,
      contractId,
      orderDetailsSnapshot,
      generatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to create order evidence:", error);
  }
}
