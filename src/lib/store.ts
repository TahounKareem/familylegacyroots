import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";

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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export type OrderPriority = "عادي" | "عاجل";
export type RecordType = "سجل أساسي" | "الأبواب المغلقة";
export type PaymentStatus = "مدفوع بالكامل" | "مدفوع أول دفعة" | "مدفوع ثاني دفعة" | "مدفوع ثالث دفعة" | "كود دعوة" | "غير مدفوع" | "دفع جزئي";
export type IssueStatus = "طلب غير مكتمل" | "بإنتظار إتمام الدفع" | "جاري التنفيذ" | "تم الإصدار" | "جاري التصويب" | "تم الإغلاق" | "يوجد تصويبات" | "قبول توصيات";
export type ActionPhase = "مرحلة البحث" | "مرحلة التوثيق" | "طلب إيضاح" | "مرحلة التصويب" | "جاهز للتسليم";

export type OrderStatus = "بإنتظار إتمام الدفع" | "بانتظار الدفع" | "راحل" | "قيد البحث" | "طلب إيضاح" | "تم الرد" | "مكتمل" | "طلب مكتمل" | "تم تسليم الإصدار الأول";


export type AppRole = "user" | "admin" | "maestro" | "research" | "marketing" | "accounting" | "compliance" | "shipping" | "customer_service" | "editor";

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
  isCover?: boolean;
}

export interface FamilyData {
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  familyName: string;
  tribeName?: string;
  country: string;
  homeland: string;
  startingPointType?: string;
  startingPointAncestor?: string;
  startingPointName?: string;
  startingPoint?: string; // keeping for backward compatibility
  designTemplate?: string;
  documents: (string | MediaItem)[];
  photos: (string | MediaItem)[];
  historicalNotes: string;
  managerWord?: string;
  mobileNumber?: string;
  shippingAddress?: {
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

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  priority?: OrderPriority;
  recordType?: RecordType;
  paymentStatus?: PaymentStatus;
  issueStatus?: IssueStatus;
  actionPhase?: ActionPhase;
  assignedResearcher?: string;
  isDeleted?: boolean;

  plan: "standard" | "express" | "invite" | "paid";
  printRequested: boolean;
  totalAmount: number;
  status: OrderStatus;
  data: FamilyData;
  createdAt: string;
  messages?: Message[];
  deliveryLink?: string;
  digitalCopyLink?: string;
  posterLink?: string;
  researchRecommendations?: string;
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
  fulfillOrder: (id: string, links: { deliveryLink?: string, digitalCopyLink?: string, posterLink?: string, researchRecommendations?: string }) => Promise<void>;
  addMessageToOrder: (orderId: string, message: Message, newStatus?: OrderStatus) => Promise<void>;
  markMessagesAsRead: (orderId: string, forRole: "user" | "admin") => Promise<void>;
  initializeFirebase: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  orders: [],
  isAuthReady: false,
  pendingOrderData: null,
  
  setPendingOrderData: (data) => set({ pendingOrderData: data }),
  
  login: (user) => set({ currentUser: user }),
  
  logout: async () => {
    try {
      await firebaseSignOut(auth);
      set({ currentUser: null, orders: [] });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  placeOrder: async (order) => {
    try {
      // Optimistic update
      set((state) => ({ orders: [...state.orders, order] }));
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

  fulfillOrder: async (id, links) => {
    try {
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status: "مكتمل", ...links } : o)),
      }));
      await updateDoc(doc(db, "orders", id), { status: "مكتمل", ...links });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  },

  addMessageToOrder: async (orderId, message, newStatus) => {
    try {
      const order = get().orders.find(o => o.id === orderId);
      if (!order) return;
      
      const updatedMessages = [...(order.messages || []), message];
      
      // Optimistic update
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? { 
          ...o, 
          messages: updatedMessages,
          ...(newStatus ? { status: newStatus } : {})
        } : o)),
      }));

      const updateData: any = { messages: updatedMessages };
      if (newStatus) updateData.status = newStatus;

      await updateDoc(doc(db, "orders", orderId), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  markMessagesAsRead: async (orderId, forRole) => {
    try {
      const order = get().orders.find(o => o.id === orderId);
      if (!order || !order.messages) return;
      
      let hasChanges = false;
      const updatedMessages = order.messages.map(msg => {
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
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, messages: updatedMessages } : o))
      }));

      await updateDoc(doc(db, "orders", orderId), { messages: updatedMessages });
    } catch(e) {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  initializeFirebase: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          // Simply clear state, don't force a signout here as it races with Auth.tsx during registration
          set({ currentUser: null, orders: [], isAuthReady: true });
          return;
        }

        try {
          // Get user document
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let userInfo: UserInfo;
          
          if (userDoc.exists()) {
            userInfo = userDoc.data() as UserInfo;
            // Update lastLoginAt
            try {
              await setDoc(doc(db, "users", user.uid), { lastLoginAt: new Date().toISOString() }, { merge: true });
            } catch (e) {}
          } else {
            // First time login fallback (if created externally)
            userInfo = {
              id: user.uid,
              name: user.displayName || "مستخدم",
              email: user.email || "",
              role: user.email?.toLowerCase() === "kareem.tahoun@adamresearchcenter.net" ? "maestro" : (user.email?.toLowerCase() === "hassan.alamri@adamresearchcenter.net" ? "admin" : "user"),
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", user.uid), userInfo);
          }
          
          set({ currentUser: userInfo, isAuthReady: true });

          // Listen to orders
          const ordersRef = collection(db, "orders");
          const q = userInfo.role === "admin" 
            ? query(ordersRef) 
            : query(ordersRef, where("userId", "==", user.uid));
            
          onSnapshot(q, (snapshot) => {
            const ordersList: Order[] = [];
            snapshot.forEach((doc) => {
              ordersList.push(doc.data() as Order);
            });
            set({ orders: ordersList });
          }, (error) => {
             handleFirestoreError(error, OperationType.LIST, `orders`);
          });
          
        } catch (error) {
          console.error("Error during auth state change:", error);
          set({ isAuthReady: true });
        }
      } else {
        set({ currentUser: null, orders: [], isAuthReady: true });
      }
    });
  }
}));
