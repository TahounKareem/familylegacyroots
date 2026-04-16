import { useAppStore } from "@/lib/store";
import { Navigate } from "react-router";
import { Users, FileText, CheckCircle, Search, Edit3 } from "lucide-react";

export function AdminPanel() {
  const { currentUser, orders, updateOrderStatus } = useAppStore();

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif text-brand-900 mb-8 border-b border-brand-200 pb-4">
        لوحة تحكم الإدارة (فريق البحث)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-600 font-medium">إجمالي الطلبات</p>
            <p className="text-2xl font-bold font-mono text-brand-900">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-600 font-medium">قيد البحث والمراجعة</p>
            <p className="text-2xl font-bold font-mono text-brand-900">{orders.filter(o => o.status === 'قيد البحث').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-600 font-medium">المنجزة (مكتمل)</p>
            <p className="text-2xl font-bold font-mono text-brand-900">{orders.filter(o => o.status === 'مكتمل').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
          <h2 className="font-bold text-lg text-brand-900">إدارة طلبات الأنساب والتسجيل</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-white text-brand-500 border-b border-brand-100">
              <tr>
                <th className="px-6 py-4 font-medium">رقم الطلب</th>
                <th className="px-6 py-4 font-medium">اسم العميل وتفصيل العائلة</th>
                <th className="px-6 py-4 font-medium">الباقة المتفق عليها</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium">إجراءات الباحث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-50/50 transition">
                  <td className="px-6 py-4 font-mono text-brand-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-900">{order.data.firstName} بن {order.data.fatherName}</p>
                    <p className="text-xs text-brand-600 mt-1">عائلة: {order.data.familyName} | {order.data.homeland}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.plan==='express'?'bg-red-50 text-red-700':'bg-brand-100 text-brand-700'}`}>
                      {order.plan === 'express' ? 'سريع' : 'عادي'}
                    </span>
                  </td>
                   <td className="px-6 py-4">
                     <select 
                       value={order.status} 
                       onChange={(e) => handleStatusChange(order.id, e.target.value)}
                       className="border border-brand-200 rounded px-2 py-1 bg-white text-sm focus:ring-brand-500"
                     >
                       <option value="راحل">راحل (تم الدفع المبدئي)</option>
                       <option value="قيد البحث">قيد البحث والمقارنة</option>
                       <option value="طلب إيضاح">طلب إيضاح / وثائق ناقصة</option>
                       <option value="مكتمل">التدقيق المنجز للطباعة</option>
                     </select>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                     <button className="w-full flex items-center justify-center gap-1 text-brand-600 hover:text-brand-800 bg-brand-100 px-3 py-1.5 rounded-md transition font-medium">
                       <Edit3 className="w-4 h-4" /> مراسلة العميل
                     </button>
                     {order.status === "مكتمل" && (
                       <button className="w-full flex items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition font-medium text-xs">
                         <CheckCircle className="w-3 h-3" /> تسليم عبر Klaviyo
                       </button>
                     )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-500">
                    لا توجد طلبات في النظام حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
