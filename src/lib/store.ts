import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";

export type OrderStatus = "بانتظار الدفع" | "راحل" | "قيد البحث" | "طلب إيضاح" | "تم الرد" | "مكتمل";

export interface UserInfo {

  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
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
    country: string;
    state: string;
    zip: string;
    street: string;
  };
  treeData: TreeData;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
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
      console.error("Error placing order:", error);
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
      console.error("Error updating order status:", error);
    }
  },

  fulfillOrder: async (id, links) => {
    try {
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status: "مكتمل", ...links } : o)),
      }));
      await updateDoc(doc(db, "orders", id), { status: "مكتمل", ...links });
    } catch (error) {
      console.error("Error fulfilling order:", error);
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
      console.error("Error adding message to order:", error);
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
      console.error("Error marking msg read:", e);
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
          } else {
            // First time login fallback (if created externally)
            userInfo = {
              id: user.uid,
              name: user.displayName || "مستخدم",
              email: user.email || "",
              role: user.email?.toLowerCase() === "kareem.tahoun@adamresearchcenter.net" ? "admin" : "user"
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
             console.error("Error fetching orders:", error);
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
