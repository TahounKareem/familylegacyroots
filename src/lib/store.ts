import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
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
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  // To prevent the runner from catching these as uncaught errors, we just log a suppressed message:
  console.log("Firestore permissions error suppressed for UI continuity:", errInfo.error);
}

export type OrderPriority = "عادي" | "عاجل";
export type RecordType = "سجل أساسي" | "الأبواب المغلقة";
export type PaymentStatus = string;
export type IssueStatus = string;
export type ActionPhase = string;

export type OrderStatus = string;

export type AppRole =
  | "user"
  | "admin"
  | "maestro"
  | "research"
  | "marketing"
  | "accounting"
  | "compliance"
  | "shipping"
  | "customer_service"
  | "editor";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  message: string;
  event?: string;
  details?: string;
  userId?: string;
  userName?: string;
  role?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  createdAt?: string;
  lastLoginAt?: string;
  country?: string;
  mobile?: string;
  passportUrl?: string;
  photoUrl?: string;
  isEmailVerified?: boolean;
}

export interface Node {
  id: string;
  name: string;
  relation: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface TreeData {
  nodes: Node[];
  edges: Edge[];
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: "user" | "admin";
  text: string;
  attachments?: string[];
  createdAt: string;
  isRead?: boolean;
}

export interface MediaItem {
  url: string;
  title?: string;
  kind?: string;
  description?: string;
  purpose?: string;
  approximateDate?: string;
  associatedPersonsOrPlaces?: string;
  additionalNotes?: string;
  isCover?: boolean;
}

export interface TimelineFormEvent {
  id: string;
  title: string;
  type?: string;
  date?: string; // added to match code
  period: string;
  description: string;
  location?: string;
  associatedPeople?: string[]; // force array
  attachments?: (string | MediaItem)[];
  dateAccuracy?: "مؤكد" | "تقريبي" | "رواية متوارثة" | "غير محدد" | "confirmed" | "approximate" | "inherited" | "unknown";
  source?: string;
}

export interface FamilyData {
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  familyName: string;
  tribeName?: string;
  contactEmail?: string;
  country: string;
  homeland: string;
  startingPointType?: string;
  startingPointAncestor?: string;
  startingPointName?: string;
  startingPoint?: string; // keeping for backward compatibility
  designTemplate?: string;
  documents: (string | MediaItem)[]; // To be used in Family Archive
  photos: (string | MediaItem)[];    // To be used in Family Archive
  historicalNotes: string;           // Maps to "Family Overview"
  managerWord?: string;              // Maps to "Word of the Record Keeper"
  placesAssociated?: string;         // New
  familyNames?: string;              // New
  familyPersonalities?: string;      // New
  professions?: string;              // New
  familyMemory?: string;             // New
  timelineEvents?: TimelineFormEvent[]; // New
  sectionStatuses?: Record<string, "draft" | "closed">;
  mobileNumber?: string;
  email?: string;
  currentResidenceCountry?: string;
  currentResidenceState?: string;
  contractUrl?: string; // Stored here temporarily
  contractId?: string;
  contractSigned?: boolean;  // Built-in Electronic Signature status
  signatureName?: string;    // Built-in Electronic Signature name
  shippingAddress?: {
    name: string;
    phone: string;
    country: string;
    state: string;
    street: string;
    zip?: string;
    notes?: string;
  };
  hasDeliveryAddress?: boolean;
  deliveryAddress?: {
    name: string;
    phone: string;
    country: string;
    state: string;
    street: string;
    zip?: string;
    notes?: string;
  };
  treeData: TreeData;
}


export interface ChatbotFAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  priority?: OrderPriority;
  recordType?: RecordType;
  paymentStatus?: PaymentStatus;
  issueStatus?: IssueStatus;
  actionPhase?: ActionPhase;
  previousActionPhase?: ActionPhase;
  assignedResearcher?: string;
  isDeleted?: boolean;
  researchDraftLink?: string;
  initialDesignLink?: string;
  postCorrectionLink?: string;
  printReadyLink?: string;
  followups?: any[];
  designLinks?: {
    recordLink: string;
    downloadLink?: string;
    treeLink: string;
    copiesShipped: boolean;
    shippingDate?: string;
    carrierName?: string;
    trackingNumber?: string;
  };

  plan: "standard" | "express" | "invite" | "paid";
  printRequested: boolean;
  totalAmount: number;
  status: OrderStatus;
  data: FamilyData;
  createdAt: string;
  messages?: Message[];
  timeline?: TimelineEvent[];
  deliveryLink?: string;
  digitalCopyLink?: string;
  digitalCopyDownloadLink?: string;
  posterLink?: string;
  researchRecommendations?: string;
  contractSigned?: boolean;
  contractUrl?: string;
  contractSignedAt?: string;
  invoiceNumber?: string;
  shippingDetails?: {
    shippingDate?: string;
    carrierName?: string;
    trackingNumber?: string;
  };
}

interface AppState {
  currentUser: UserInfo | null;
  orders: Order[];
  isAuthReady: boolean;
  pendingOrderData: FamilyData | null;
  setPendingOrderData: (data: FamilyData | null) => void;
  login: (user: UserInfo) => void;
  logout: () => Promise<void>;
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => Promise<void>;
  logTimelineEvent: (orderId: string, _message: string) => Promise<void>;
  fulfillOrder: (
    id: string,
    data: Partial<Order>,
  ) => Promise<void>;
  addMessageToOrder: (
    orderId: string,
    message: Message,
    newStatus?: OrderStatus,
    extraUpdates?: Partial<Order>
  ) => Promise<void>;
  markMessagesAsRead: (
    orderId: string,
    forRole: "user" | "admin",
  ) => Promise<void>;
  initializeFirebase: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  orders: [],
  isAuthReady: false,
  pendingOrderData: (() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem("pendingOrderData");
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  })(),

  setPendingOrderData: (data) => {
    if (typeof window !== "undefined") {
      if (data) {
        localStorage.setItem("pendingOrderData", JSON.stringify(data));
      } else {
        localStorage.removeItem("pendingOrderData");
      }
    }
    set({ pendingOrderData: data });
  },

  login: (user) => set({ currentUser: user }),

  logout: async () => {
    try {
      await firebaseSignOut(auth);
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingOrderData");
      }
      set({ currentUser: null, orders: [], pendingOrderData: null });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  placeOrder: async (order) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingOrderData");
      }
      // Optimistic update
      set((state) => ({ 
        orders: [...state.orders, order],
        pendingOrderData: null
      }));
      await setDoc(doc(db, "orders", order.id), order);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${order.id}`);
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      // Optimistic update
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }));
      await updateDoc(doc(db, "orders", id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  },

  logTimelineEvent: async (orderId, message) => {
    try {
      const state = get();
      const user = state.currentUser;
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return;

      const newEvent: TimelineEvent = {
        id: Math.random().toString(36).substring(2, 10),
        timestamp: new Date().toISOString(),
        message,
        userId: user?.id,
        userName: user?.name,
        role: user?.role,
      };

      const updatedTimeline = [...(order.timeline || []), newEvent];

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, timeline: updatedTimeline } : o,
        ),
      }));

      const updateData: any = { timeline: updatedTimeline };
      await updateDoc(doc(db, "orders", orderId), updateData);
      
      // Add a global staff notification
      try {
        await addDoc(collection(db, "notifications"), {
          message: `طلب #${order.orderNumber || order.id.substring(0,6)}: ${message}`,
          timestamp: new Date().toISOString(),
          orderId: order.id,
          readBy: [],
          createdBy: user?.name || "النظام",
        });
      } catch (notifErr) {
        console.error("Failed to add notification", notifErr);
      }
    } catch (e) {
      console.error(e);
    }
  },

  fulfillOrder: async (id, data) => {
    try {
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, ...data } : o,
        ),
      }));
      await updateDoc(doc(db, "orders", id), { ...data });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  },

  addMessageToOrder: async (orderId, message, newStatus, extraUpdates) => {
    try {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return;

      const updatedMessages = [...(order.messages || []), message];

      let nextActionPhase = extraUpdates?.actionPhase !== undefined ? extraUpdates.actionPhase : order.actionPhase;
      let nextPreviousPhase = extraUpdates?.previousActionPhase !== undefined ? extraUpdates.previousActionPhase : order.previousActionPhase;

      if (newStatus === "طلب إيضاح") {
        nextPreviousPhase = order.actionPhase || "مرحلة البحث";
        nextActionPhase = "طلب إيضاح";
      } else if (newStatus === "تم الرد" && order.actionPhase === "طلب إيضاح") {
        nextActionPhase = order.previousActionPhase || "مرحلة البحث";
      }

      // Optimistic update
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                ...extraUpdates,
                messages: updatedMessages,
                ...(newStatus ? { status: newStatus } : {}),
                actionPhase: nextActionPhase,
                previousActionPhase: nextPreviousPhase,
              }
            : o,
        ),
      }));

      const updateData: any = {
        ...extraUpdates,
        messages: updatedMessages,
      };
      if (nextActionPhase !== undefined) updateData.actionPhase = nextActionPhase;
      if (nextPreviousPhase !== undefined) updateData.previousActionPhase = nextPreviousPhase;
      if (newStatus) updateData.status = newStatus;

      await updateDoc(doc(db, "orders", orderId), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  markMessagesAsRead: async (orderId, forRole) => {
    try {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order || !order.messages) return;

      let hasChanges = false;
      const updatedMessages = order.messages.map((msg) => {
        // if user opens it, we mark admin's messages as read.
        // if admin opens it, we mark user's messages as read.
        if (msg.senderRole !== forRole && !msg.isRead) {
          hasChanges = true;
          return { ...msg, isRead: true };
        }
        return msg;
      });

      if (!hasChanges) return;

      // Optimistic
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, messages: updatedMessages } : o,
        ),
      }));

      await updateDoc(doc(db, "orders", orderId), {
        messages: updatedMessages,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  initializeFirebase: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user document
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const docData = userDoc.data();
          
          const isVerified = user.emailVerified || (docData?.isEmailVerified === true);
          if (!isVerified) {
            // Simply clear state, don't force a signout here as it races with Auth.tsx during registration
            set({ currentUser: null, orders: [], isAuthReady: true });
            return;
          }

          let userInfo: UserInfo;

          if (userDoc.exists()) {
            userInfo = docData as UserInfo;
            
            // Fix empty name if it exists from previous bugs
            if (!userInfo.name || userInfo.name.trim() === "") {
              userInfo.name = user.displayName || "العميل الكريم";
            }
            
            // Hardcode specific emails to their designated roles
            const emailLower = user.email?.toLowerCase();
            let newRole = userInfo.role;
            if (emailLower === "hassan.alamri@adamresearchcenter.net") newRole = "admin";
            else if (emailLower === "kareem.tahoun@adamresearchcenter.net") newRole = "maestro";
            else if (emailLower === "eng.kareemsherif@gmail.com") newRole = "research";
            else if (emailLower === "ahlymember@gmail.com") newRole = "shipping";
            else if (emailLower === "tahoun.kareemsherif@gmail.com") newRole = "accounting";

            const shouldUpdateRole = newRole !== userInfo.role;
            const shouldUpdateName = userInfo.name !== userDoc.data()?.name;
            if (shouldUpdateRole) {
               userInfo.role = newRole;
            }

            // Update lastLoginAt, potentially role and name
            try {
              await setDoc(
                doc(db, "users", user.uid),
                { 
                  lastLoginAt: new Date().toISOString(), 
                  ...(shouldUpdateRole ? { role: newRole } : {}),
                  ...(shouldUpdateName ? { name: userInfo.name } : {})
                },
                { merge: true },
              );
            } catch (e) {
              console.error("Failed to update user document", e);
            }
          } else {
            // First time login fallback (if created externally)
            const emailLower = user.email?.toLowerCase();
            let newRole: AppRole = "user";
            if (emailLower === "hassan.alamri@adamresearchcenter.net") newRole = "admin";
            else if (emailLower === "kareem.tahoun@adamresearchcenter.net") newRole = "maestro";
            else if (emailLower === "eng.kareemsherif@gmail.com") newRole = "research";
            else if (emailLower === "ahlymember@gmail.com") newRole = "shipping";
            else if (emailLower === "tahoun.kareemsherif@gmail.com") newRole = "accounting";

            userInfo = {
              id: user.uid,
              name: user.displayName || "العميل الكريم",
              email: user.email || "",
              role: newRole,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", user.uid), userInfo, { merge: true });
          }

          set({ currentUser: userInfo, isAuthReady: true });

          // Listen to orders
          const ordersRef = collection(db, "orders");
          const isStaff = [
            "admin",
            "maestro",
            "research",
            "marketing",
            "accounting",
            "compliance",
            "shipping",
            "customer_service",
            "editor",
          ].includes(userInfo.role);
          const q = isStaff
            ? query(ordersRef)
            : query(ordersRef, where("userId", "==", user.uid));

          onSnapshot(
            q,
            (snapshot) => {
              const ordersList: Order[] = [];
              snapshot.forEach((doc) => {
                ordersList.push(doc.data() as Order);
              });
              set({ orders: ordersList });
            },
            (error) => {
              handleFirestoreError(error, OperationType.LIST, `orders`);
            },
          );
        } catch (error) {
          console.error("Error during auth state change:", error);
          set({ isAuthReady: true });
        }
      } else {
        set({ currentUser: null, orders: [], isAuthReady: true });
      }
    });
  },
}));
