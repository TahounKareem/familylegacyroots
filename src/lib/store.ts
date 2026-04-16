import { create } from "zustand";

export type OrderStatus = "راحل" | "قيد البحث" | "طلب إيضاح" | "مكتمل";

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
}

interface AppState {
  currentUser: UserInfo | null;
  orders: Order[];
  login: (user: UserInfo) => void;
  logout: () => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null, // Start logged out
  orders: [],
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  placeOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
