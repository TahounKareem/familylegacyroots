import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Check, UploadCloud, ArrowRight, ArrowLeft } from "lucide-react";
import { TreeBuilder } from "./TreeBuilder";
import { useAppStore, FamilyData } from "@/lib/store";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { sendOrderConfirmationEmail } from "@/lib/emailService";

export function OrderFlow() {
  const [step, setStep] = useState(1);
  const { currentUser, placeOrder } = useAppStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FamilyData>({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    familyName: "",
    relation: "ابن",
    country: "",
    homeland: "",
    documents: [],
    photos: [],
    historicalNotes: "",
    treeData: { nodes: [], edges: [] }
  });

  const [plan, setPlan] = useState<"standard"|"express">("standard");
  const [printRequested, setPrintRequested] = useState<boolean>(false);
  const [agreedToService, setAgreedToService] = useState<boolean>(false);
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
        alert("فشل رفع الملف. تأكد من إعدادات Storage Rules.");
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, downloadURL]
          }));
          setUploading(false);
        });
      }
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderId = "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase();
      const planPrice = 1999;
      
      // Save order in Firestore with local pending state 
      await placeOrder({
        id: orderId,
        userId: currentUser?.id || "guest",
        createdAt: new Date().toISOString(),
        plan: "standard",
        printRequested: false,
        status: "بانتظار الدفع", // Order created but not paid yet
        totalAmount: planPrice,
        data: formData,
      });
      
      // We don't send the email here anymore! The webhook in backend will send it upon payment.

      // Call Express Backend to create a Stripe Session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          userName: currentUser?.name || "عميل المركز",
          userEmail: currentUser?.email || "pending@example.com",
          packagePrice: planPrice,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "حدث خطأ أثناء الاتصال ببوابة الدفع. برجاء إعداد مفاتيح Stripe.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Order submission error", error);
      alert("حدث خطأ غير متوقع.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-50 min-h-screen py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Navigation Back */}
        <div className="mb-6">
          <Link to={currentUser ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-medium transition">
            <ArrowRight className="w-4 h-4" /> العودة {currentUser ? "للوحة التحكم" : "للرئيسية"}
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-200 -z-10 translate-y-[-50%]"></div>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 ${
                step >= s ? 'bg-brand-600 border-brand-100 text-white' : 'bg-white border-brand-200 text-brand-400'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs md:text-sm font-medium text-brand-700">
            <span>البيانات الأساسية لسجل تراث عائلتك</span>
            <span>مشجرة الأحياء</span>
            <span>الدفع والاعتماد</span>
          </div>
        </div>

        {/* Steps Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-6 md:p-10 mb-8">
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-brand-900 mb-6">البيانات الأساسية لسجل تراث عائلتك</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الإسم الأول (العميل وأمين السجل) *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.firstName} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">اسم الأب *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.fatherName} onChange={(e)=>setFormData({...formData, fatherName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">اسم الجد *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.grandfatherName} onChange={(e)=>setFormData({...formData, grandfatherName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">اسم العائلة / اللقب *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.familyName} onChange={(e)=>setFormData({...formData, familyName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">القبيلة (اختياري)</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.tribeName || ""} onChange={(e)=>setFormData({...formData, tribeName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الدولة *</label>
                  <input type="text" placeholder="مثال: السعودية، الكويت، مصر..." className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.country} onChange={(e)=>setFormData({...formData, country: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">الموطن الأصلي للعائلة *</label>
                  <input type="text" className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.homeland} onChange={(e)=>setFormData({...formData, homeland: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-brand-900">مشجرة الأحياء (تحت إشراف العميل / أمين السجل)</h2>
              
              <div>
                <label className="block text-sm font-medium text-brand-800 mb-4">شجرة العائلة المبدئية (اسحب لإضافة أقاربك)</label>
                <div className="rounded-2xl border-2 border-brand-100 overflow-hidden">
                  <TreeBuilder 
                    initialNodes={formData.treeData.nodes} 
                    initialEdges={formData.treeData.edges} 
                    onChange={(nodes, edges) => setFormData({...formData, treeData: { nodes, edges }})}
                    familyName={formData.familyName}
                  />
                </div>
                <p className="text-sm text-brand-500 mt-2">* هذه شجرة مبدئية، سيقوم الباحثون بالتدقيق وبناء الشجرة الكاملة.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-800 mb-2">نبذة تاريخية عن العائلة (سيتم إدراجها في القسم الخاص الذي يقع تحت إشرافكم)</label>
                <textarea rows={4} className="w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3" value={formData.historicalNotes} onChange={(e)=>setFormData({...formData, historicalNotes: e.target.value})} placeholder="اكتب ما تتذكره من قصص الأجداد ومآثرهم..."></textarea>
              </div>

              <div>
                 <label className="block text-sm font-medium text-brand-800 mb-2">مرفقات ووثائق</label>
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="border-2 border-dashed border-brand-300 rounded-2xl p-8 text-center hover:bg-brand-50 transition cursor-pointer relative"
                 >
                   <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                   
                   {uploading ? (
                     <div className="flex flex-col items-center justify-center">
                       <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
                       <p className="text-brand-800 font-medium">جاري الرفع... {Math.round(uploadProgress)}%</p>
                     </div>
                   ) : (
                     <>
                       <UploadCloud className="w-10 h-10 text-brand-400 mx-auto mb-3" />
                       <p className="text-brand-800 font-medium">اسحب وأفلت المرفقات أو انقر للرفع</p>
                       <p className="text-sm text-brand-500 mt-1">صور و وثائق (PDF, JPG, PNG)</p>
                     </>
                   )}
                 </div>

                 {formData.documents.length > 0 && (
                   <div className="mt-4 space-y-2">
                     <p className="text-sm font-medium text-brand-800 mb-2">الملفات المرفقة ({formData.documents.length}):</p>
                     {formData.documents.map((url, i) => (
                       <div key={i} className="flex justify-between items-center bg-brand-50 border border-brand-100 p-2 rounded text-sm">
                         <span className="truncate flex-1" dir="ltr">{url.split('?')[0].split('%2F').pop()}</span>
                         <a href={url} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 mr-4 font-medium">عرض</a>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-brand-900 text-center">مراجعة الفاتورة والموافقة</h2>
              
              <div className="bg-brand-50 p-6 rounded-2xl border border-brand-200 w-full max-w-lg mx-auto">
                 <h3 className="font-bold border-b border-brand-200 pb-4 mb-4">ملخص الطلب لسجل ({formData.familyName || "---"})</h3>
                 <div className="space-y-3 text-brand-800 mb-6">
                    <div className="flex justify-between">
                      <span>الباقة الرقمية الشاملة</span>
                      <span className="font-medium font-mono">$1999</span>
                    </div>
                 </div>
                 <div className="flex justify-between border-t border-brand-200 pt-4 font-bold text-xl text-brand-900">
                    <span>الإجمالي (الدفعة المبدئية)</span>
                    <span className="font-mono">$1999</span>
                 </div>
              </div>

              {!agreedToService ? (
                <div className="max-w-lg mx-auto bg-white border-2 border-brand-200 p-6 rounded-2xl text-center shadow-sm">
                  <h3 className="font-bold text-brand-900 mb-2">توقيع اتفاقية تقديم الخدمة</h3>
                  <p className="text-sm text-brand-600 mb-4">
                    لضمان حقوقك القانونية وحقوق فريق البحث، يرجى توقيع اتفاقية مستوى الخدمة وإشعار إخلاء المسؤولية رسمياً.
                    (التوقيع الإلكتروني متوافق مع نظام ESIGN Act و UETA).
                  </p>
                  <button 
                    type="button"
                    onClick={() => setShowSignModal(true)}
                    className="bg-brand-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-800 transition shadow-md w-full"
                  >
                    بدء التوقيع الإلكتروني (E-Signature)
                  </button>
                </div>
              ) : (
                <div className="max-w-lg mx-auto bg-green-50 border border-green-200 p-4 rounded-xl text-center text-green-800 flex items-center justify-center gap-2" dir="ltr">
                  <span className="font-medium" dir="rtl">تم توقيع الاتفاقية بنجاح.</span>
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
          )}

        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button 
            type="button" 
            onClick={handlePrev} 
            disabled={step === 1}
            className={`px-6 py-3 rounded-md font-semibold flex items-center gap-2 transition ${step === 1 ? 'opacity-50 cursor-not-allowed text-brand-400' : 'text-brand-700 hover:bg-brand-200 bg-brand-100'}`}
          >
            السابق
          </button>
          
          {step < 3 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="px-8 py-3 rounded-md font-semibold flex items-center gap-2 bg-brand-600 text-white hover:bg-brand-700 shadow-md transition"
            >
              التالي <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={submitOrder}
              disabled={!agreedToService || isSubmitting}
              className={`px-10 py-3 rounded-md font-semibold flex items-center gap-2 shadow-xl transition ${agreedToService && !isSubmitting ? 'bg-brand-900 text-white hover:bg-brand-800' : 'bg-brand-200 text-brand-500 cursor-not-allowed'}`}
            >
               {isSubmitting ? "جاري المعالجة..." : "إتمام الطلب والدفع المبدئي"}
            </button>
          )}
        </div>

      </div>

      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
               <h3 className="font-bold text-brand-900">توقيع الوثيقة (محاكاة eSignatures.com)</h3>
               <button onClick={() => setShowSignModal(false)} className="text-brand-500 hover:text-brand-800">إغلاق</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-sm text-brand-800 leading-relaxed font-serif">
              <h4 className="font-bold mb-4 text-center text-lg">عقد تقديم خدمة بحث وتوثيق الأنساب</h4>
              <p className="mb-4"><strong>الطرف الأول (مزود الخدمة):</strong> منصة سجل تراث العائلة.</p>
              <p className="mb-4"><strong>الطرف الثاني (العميل):</strong> {formData.firstName} {formData.familyName}</p>
              <p className="mb-4">بناءً على طلب الطرف الثاني لتوثيق شجرة عائلته، تم الاتفاق على الخطوط العريضة التالية:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>يلتزم الطرف الأول بتقديم أقصى درجات العناية والبحث في المصادر والمراجع التاريخية لتوثيق التسلسل النسبي لعائلة الطرف الثاني.</li>
                <li>يقر الطرف الثاني بأن كافة المعلومات والمستندات المقدمة منه مبدئياً صحيحة، وتتحمل الجهة الطالبة مسؤوليتها الأخلاقية والاجتماعية.</li>
                <li><strong>إخلاء المسؤولية:</strong> نتائج البحث تعتمد على الوثائق والمصادر المتاحة والحمض النووي (إن وجد). لا يتحمل الطرف الأول مسؤلية أي تضارب تاريخي قديم لا تدعمه المصادر.</li>
                <li>حقوق الطبع والنشر لآلية وشكل إخراج الشجرة محفوظة للطرف الأول، بينما يمتلك الطرف الثاني حقوق المادة العلمية الناتجة عن المشروع.</li>
              </ul>
              <div className="bg-brand-50 p-4 border border-brand-200 rounded-lg text-center mt-6">
                <p className="font-bold text-brand-900 mb-2">منطقة التوقيع الإلكتروني</p>
                <div className="w-full h-24 bg-white border border-dashed border-brand-300 rounded flex items-center justify-center text-brand-400 mb-2 italic">
                  [المستخدم يوقع هنا تقنياً عبر مزود الخدمة]
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-brand-100 bg-brand-50 flex justify-end gap-3">
               <button onClick={() => setShowSignModal(false)} className="px-6 py-2 rounded-md font-medium text-brand-600 hover:bg-brand-100 transition">إلغاء</button>
               <button onClick={() => { setAgreedToService(true); setShowSignModal(false); }} className="px-6 py-2 rounded-md font-bold bg-brand-600 text-white hover:bg-brand-700 transition">أوافق وأوقع إلكترونياً</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
