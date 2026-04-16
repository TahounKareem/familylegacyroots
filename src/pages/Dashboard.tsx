import { useAppStore } from "@/lib/store";
import { Navigate, Link } from "react-router";
import { FileText, Clock, AlertCircle, CheckCircle, BookOpen } from "lucide-react";

export function Dashboard() {
  const { currentUser, orders } = useAppStore();

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  const userOrders = orders.filter(o => o.userId === currentUser.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مكتمل": return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "طلب إيضاح": return <AlertCircle className="text-orange-500 w-5 h-5" />;
      case "قيد البحث": return <Clock className="text-blue-500 w-5 h-5" />;
      default: return <Clock className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-900 mb-2">أهلاً بك، {currentUser.name}</h1>
          <p className="text-brand-700">مرحباً بك في لوحة تحكم عائلتك. يمكنك تتبع طلباتك وإضافة المعلومات من هنا.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-brand-600 hover:text-brand-800 hover:underline font-medium">العودة للرئيسية</Link>
          <span className="text-brand-300">|</span>
          <Link to="/services" className="text-brand-600 hover:text-brand-800 hover:underline font-medium">الخدمات</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-serif text-brand-900">طلبات سجل العائلة</h2>
              <Link to="/order" className="bg-brand-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-700 transition">
                طلب جديد
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-12 bg-brand-50 rounded-xl border border-dashed border-brand-200">
                <FileText className="w-12 h-12 text-brand-300 mx-auto mb-4" />
                <h3 className="text-lg text-brand-800 mb-2">لا توجد طلبات بعد</h3>
                <p className="text-brand-600 mb-6 font-light">ابدأ بتوثيق تراث عائلتك الآن</p>
                <Link to="/order" className="bg-brand-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-700 transition">
                  إنشاء السجل
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="border border-brand-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-brand-900 text-lg">سجل عائلة {order.data.familyName}</h4>
                      <p className="text-sm text-brand-600 mt-1">تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                      <p className="text-sm text-brand-600">الباقة: {order.plan === 'express' ? 'سريع' : 'عادي'} | الطباعة: {order.printRequested ? 'مطلوبة (تحت المراجعة)' : 'نسخة رقمية'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="flex items-center gap-2 bg-brand-50 px-3 py-1 rounded-full text-sm font-medium border border-brand-100">
                         {getStatusIcon(order.status)}
                         {order.status}
                       </span>
                       {order.status === "طلب إيضاح" && (
                         <button className="text-sm text-orange-600 hover:underline">الرد على طلب الباحث</button>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-950 text-white rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BookOpen className="w-32 h-32" />
             </div>
             <h3 className="font-serif text-xl font-bold mb-4 relative z-10">نصيحة الباحث</h3>
             <p className="text-brand-200 text-sm leading-relaxed relative z-10">
               كلما قدمت وثائق أكثر تفصيلاً كالشهادات القديمة، عقود المبايعات، وصكوك الأوقاف، زادت دقة شجرة عائلتك وتمكنا من الوصول لأجداد أبعد.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
