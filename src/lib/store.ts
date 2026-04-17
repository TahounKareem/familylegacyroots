import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";

export type OrderStatus = "راحل" | "قيد البحث" | "طلب إيضاح" | "تم الرد" | "مكتمل";

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
}

export interface FamilyData {
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  familyName: string;
  tribeName?: string;
  relation: string;
  country: string;
  homeland: string;
  knownLineage?: string;
  documents: string[]; // URLs (mocked)
  photos: string[];
  historicalNotes: string;
  treeData: TreeData;
}

export interface Order {
  id: string;
  userId: string;
  plan: "standard" | "express";
  printRequested: boolean;
  totalAmount: number;
  status: OrderStatus;
  data: FamilyData;
  createdAt: string;
  messages?: Message[];
}

interface AppState {
  currentUser: UserInfo | null;
  orders: Order[];
  isAuthReady: boolean;
  login: (user: UserInfo) => void;
  logout: () => Promise<void>;
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => Promise<void>;
  addMessageToOrder: (orderId: string, message: Message, newStatus?: OrderStatus) => Promise<void>;
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

  initializeFirebase: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          await firebaseSignOut(auth);
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
              role: user.email?.includes("admin") ? "admin" : "user"
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
