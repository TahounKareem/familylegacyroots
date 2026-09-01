import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Calendar, Clock, CheckCircle2, ChevronDown, Video, Phone, MessageCircle } from "lucide-react";
import { ALL_COUNTRIES } from "../data/countries";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export function IntroSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: welcome, 1-6: questions, 7: contact, 8: calendar, 9: success

  // Form Data
  const [formData, setFormData] = useState({
    mainGoal: "",
    projectScope: "",
    familyHistoryKnowledge: "",
    materialsAvailable: [] as string[],
    whatToDocument: [] as string[],
    motivation: "",
    country: "",
    origin: "",
    name: "",
    email: "",
    phoneCode: "",
    phone: "",
    commPreference: "",
    selectedDate: "",
    selectedTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = () => {
    window.scrollTo(0, 0);
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    window.scrollTo(0, 0);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Save to Firebase
      const sessionRef = await addDoc(collection(db, "intro_sessions"), {
        ...formData,
        status: "pending", // admin will update this
        createdAt: serverTimestamp(),
      });

      // HTML for First Email (Confirmation)
      const email1Html = `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4A5568;">قبل ان نلتقي ....</h2>
  <p>شكراً على حجز هذه الجلسة التعريفية ، والتي يسرنا ان نجيب فيها على تساؤلاتك ومناقشة مشروع توثيق سجل تراث عائلتك .</p>
  <h3 style="color: #2D3748;">كن أنت من يقدم توثيق سجل تراث عائلته للأجيال</h3>
  <p>كل جيل يحمل جزءًا من الرواية… حتى يأتي من يجمعها في سجل واحد<br/>
  قد يحتفظ أحدهم بصورة، ويحفظ آخر اسمًا، بينما يتذكر كبير العائلة قصة لم تُكتب من قبل.</p>
  <p>جلسة التعريف ليست اختبارًا لما تعرفه، ولا يشترط أن تكون قد جمعت كل شيء مسبقًا، بل هي بداية رحلة تساعدنا على فهم مشروعكم، وكيف يمكن أن نحول ما تملكونه اليوم إلى سجل عائلي موثق يحفظه للأجيال القادمة.<br/>
  كل ذلك سيمكننا من توثيق سجل تراث عائلتكم ، وتوثيق عمود نسب العائلة عبر بحث تاريخي في اهم المصادر وقواعد بياناتنا عن الأصول في المنطقة ، كل ذلك واكثر سيكون في سجل تراث عائلتكم.</p>
  <p>ولتحقيق أكبر فائدة من الجلسة، نقترح أن تستعد ببعض ما هو متاح لديك إن أمكن.</p>
  <h3 style="color: #2D3748;">خلال الجلسة</h3>
  <p>سنستمع أولًا إلى قصة مشروعكم، ثم نتحدث عن:</p>
  <ul>
    <li>نطاق السجل المناسب لعائلتكم.</li>
    <li>المنهجية التي نتبعها في البحث والتوثيق.</li>
    <li>مراحل تنفيذ المشروع.</li>
    <li>ما يمكن البدء به وفق المعلومات المتوفرة لديكم.</li>
  </ul>
  <p>وسيكون لدينا متسع للإجابة عن جميع أسئلتكم.</p>
  <p><strong>تذكر...</strong><br/>
  ليس الهدف أن تكون لديك جميع الإجابات.<br/>
  بل أن نبدأ من حيث أنتم اليوم، ونرسم معًا الطريق المناسب لبناء سجل يحفظ ذاكرة العائلة بطريقة علمية ومنهجية.<br/>
  يسرنا لقاؤكم قريبًا.</p>
  
  <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>مكان الإجتماع:</strong><br/>
    ${formData.commPreference === 'Google Meet' ? 'عبر جوجل ميت <br/> <a href="https://meet.google.com/ydc-vwcj-nsj">https://meet.google.com/ydc-vwcj-nsj</a>' : formData.commPreference === 'WhatsApp' ? 'اتصال هاتفي (عبر واتساب)' : 'اتصال هاتفي (عبر تيلغرام)'}</p>
    <p><strong>الوقت :</strong><br/>
    ${formData.selectedTime} - توقيت مكة المكرمة<br/>
    يوم: ${formData.selectedDate}</p>
    <p><strong>الوقت المحدد للجلسة :</strong> 30 دقيقة</p>
  </div>

  <p>نتطلع للقائكم قريباً.<br/>
  <strong>لكل عائلة... قصة تستحق أن تُحفظ</strong><br/>
  فريق سجل تراث العائلة</p>

  <p><strong>هل طرأ لديكم انشغال !!</strong><br/>
  <a href="mailto:info@thefamilylegacyroots.com?subject=تعديل موعد الجلسة&body=أرغب بتعديل الجلسة التعريفية الخاصة بي" style="background-color: #e2e8f0; padding: 8px 16px; text-decoration: none; color: #4a5568; border-radius: 4px; margin-left: 10px;">تعديل موعد الجلسة</a>
  <a href="mailto:info@thefamilylegacyroots.com?subject=إلغاء الجلسة&body=أرغب بإلغاء الجلسة التعريفية الخاصة بي" style="background-color: #fed7d7; padding: 8px 16px; text-decoration: none; color: #c53030; border-radius: 4px;">إلغاء</a></p>

  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
  <p style="text-align: center; color: #718096; font-size: 14px;">
    <strong>سجل تراث العائلة</strong><br/>
    مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة
  </p>
</div>`;

      // Trigger Email 1 immediately
      await addDoc(collection(db, "mail"), {
        to: formData.email,
        bcc: "info@thefamilylegacyroots.com",
        message: {
          subject: "قبل ان نلتقي ...",
          html: email1Html,
        },
        createdAt: serverTimestamp(),
      });

      // Try parsing date/time to schedule the second email (1 hour before)
      try {
        const timeParts = formData.selectedTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (timeParts) {
          let hours = parseInt(timeParts[1]);
          const minutes = parseInt(timeParts[2]);
          const isPM = timeParts[3] && timeParts[3].toUpperCase() === 'PM';
          
          if (isPM && hours < 12) hours += 12;
          if (!isPM && hours === 12) hours = 0;

          // Note: using local timezone, could be adjusted to Makkah timezone if needed
          const sessionDate = new Date(formData.selectedDate);
          sessionDate.setHours(hours, minutes, 0, 0);
          
          // 1 hour before
          const reminderDate = new Date(sessionDate.getTime() - 60 * 60 * 1000);
          
          // Only schedule if reminder date is in the future
          if (reminderDate > new Date()) {
            const email2Html = `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4A5568;">دقائق ونبدأ أول صفحة من سجل العائلة .</h2>
  <p>بالتأكيد توجد لدى عائلتكم قصة لم تُكتب بعد، أو صورة يعرف الجميع قيمتها، أو اسم يتناقله الأبناء دون أن يعرفوا حكايته، او عمود نسب يحتاج الي توثيق وربطه تاريخياً بالأصل بحسب ماتذكره المصادر الموثوقة .</p>
  <p>لذا .. بعد دقائق سنبدأ معًا بفهم مشروعكم، وكيف يمكن أن يتحول ما تملكونه اليوم إلى سجل يحفظ ذاكرة العائلة للأجيال القادمة.</p>
  <p>إن كان لديكم أي نقاط أو وثائق أو ملاحظات ترون أنها قد تساعد لجعل جلستكم مثمرة، فاحتفظوا بها بالقرب منكم أثناء الجلسة، وإن لم يكن لديكم شيء، فلا تقلقوا... فكل سجل عائلي يبدأ بخطوة...</p>
  
  <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>مكان الإجتماع:</strong><br/>
    ${formData.commPreference === 'Google Meet' ? 'عبر جوجل ميت <br/> <a href="https://meet.google.com/ydc-vwcj-nsj">https://meet.google.com/ydc-vwcj-nsj</a>' : formData.commPreference === 'WhatsApp' ? 'اتصال هاتفي (عبر واتساب)' : 'اتصال هاتفي (عبر تيلغرام)'}</p>
    <p><strong>الوقت :</strong><br/>
    ${formData.selectedTime} - توقيت مكة المكرمة<br/>
    يوم: ${formData.selectedDate}</p>
    <p><strong>الوقت المحدد للجلسة :</strong> 30 دقيقة</p>
    <p style="color: #e53e3e; font-size: 14px; font-weight: bold;">فضلا تأكد من التوقيت الخاص ببلدك</p>
  </div>

  <p>نتطلع للقائكم غدًا.<br/>
  فريق سجل تراث العائلة</p>

  <p><strong>هل طرأ لديكم انشغال !!</strong><br/>
  <a href="mailto:info@thefamilylegacyroots.com?subject=تعديل موعد الجلسة&body=أرغب بتعديل الجلسة التعريفية الخاصة بي" style="background-color: #e2e8f0; padding: 8px 16px; text-decoration: none; color: #4a5568; border-radius: 4px; margin-left: 10px;">تعديل موعد الجلسة</a>
  <a href="mailto:info@thefamilylegacyroots.com?subject=إلغاء الجلسة&body=أرغب بإلغاء الجلسة التعريفية الخاصة بي" style="background-color: #fed7d7; padding: 8px 16px; text-decoration: none; color: #c53030; border-radius: 4px;">إلغاء</a></p>

  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
  <p style="text-align: center; color: #718096; font-size: 14px;">
    <strong>سجل تراث العائلة</strong><br/>
    مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة
  </p>
</div>`;

            await addDoc(collection(db, "mail"), {
              to: formData.email,
              bcc: "info@thefamilylegacyroots.com",
              message: {
                subject: "تذكير قبل الموعد بساعة",
                html: email2Html,
              },
              delivery: {
                startTime: reminderDate
              },
              createdAt: serverTimestamp(),
            });
          }
        }
      } catch (e) {
        console.warn("Failed to schedule reminder email", e);
      }

      // Notify the admin via DB
      await addDoc(collection(db, "notifications"), {
        userId: "admin", // Admin broadcast
        title: "حجز جلسة تعريفية جديدة",
        message: `تم حجز جلسة من قبل ${formData.name} يوم ${formData.selectedDate} الساعة ${formData.selectedTime}`,
        type: "session_booking",
        link: "/admin", // Links them to the admin panel
        read: false,
        createdAt: serverTimestamp(),
      });
      
      // Admin email notification HTML
      const adminEmailHtml = `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea;">
  <h2 style="color: #c53030; border-bottom: 2px solid #fed7d7; padding-bottom: 10px;">إشعار حجز جلسة تعريفية جديدة</h2>
  
  <p>مرحباً،</p>
  <p>تم حجز جلسة تعريفية جديدة عبر المنصة. إليك تفاصيل الطلب:</p>

  <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
    <h3 style="color: #2b6cb0; margin-top: 0;">بيانات العميل</h3>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 8px;"><strong>الاسم:</strong> ${formData.name}</li>
      <li style="margin-bottom: 8px;"><strong>البريد الإلكتروني:</strong> <a href="mailto:${formData.email}">${formData.email}</a></li>
      <li style="margin-bottom: 8px;"><strong>رقم الهاتف:</strong> ${formData.phone}</li>
      <li style="margin-bottom: 8px;"><strong>البلد/الإقامة:</strong> ${formData.country}</li>
      <li style="margin-bottom: 8px;"><strong>الأصول:</strong> ${formData.origin || 'غير محدد'}</li>
    </ul>
  </div>

  <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
    <h3 style="color: #2b6cb0; margin-top: 0;">تفاصيل الموعد</h3>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 8px;"><strong>تاريخ الجلسة:</strong> ${formData.selectedDate}</li>
      <li style="margin-bottom: 8px;"><strong>وقت الجلسة:</strong> ${formData.selectedTime} (بتوقيت مكة المكرمة)</li>
      <li style="margin-bottom: 8px;"><strong>طريقة التواصل المفضلة:</strong> ${formData.commPreference === 'Google Meet' ? 'فيديو (Google Meet)' : formData.commPreference === 'WhatsApp' ? 'اتصال هاتفي (واتساب)' : formData.commPreference === 'Telegram' ? 'اتصال هاتفي (تيلغرام)' : formData.commPreference}</li>
    </ul>
  </div>

  <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
    <h3 style="color: #2b6cb0; margin-top: 0;">تفاصيل المشروع</h3>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 8px;"><strong>الهدف الرئيسي:</strong> ${formData.mainGoal}</li>
      <li style="margin-bottom: 8px;"><strong>نطاق السجل:</strong> ${formData.projectScope}</li>
      <li style="margin-bottom: 8px;"><strong>المعرفة الحالية بتاريخ العائلة:</strong> ${formData.familyHistoryKnowledge}</li>
      <li style="margin-bottom: 8px;"><strong>ما يودون توثيقه:</strong> ${formData.whatToDocument.join('، ')}</li>
      <li style="margin-bottom: 8px;"><strong>الوثائق المتاحة:</strong> ${formData.materialsAvailable.join('، ')}</li>
      <li style="margin-bottom: 8px;"><strong>الدافع والقصة:</strong><br/> ${formData.motivation}</li>
    </ul>
  </div>

  <p style="text-align: center; margin-top: 30px;">
    <a href="https://ais-pre-ekjreq3gbkyaa7ikcv65ss-370080144961.europe-west1.run.app/admin" style="background-color: #c53030; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">الذهاب إلى لوحة التحكم</a>
  </p>
</div>`;

      // Admin email notification
      await addDoc(collection(db, "mail"), {
        to: "kaouther.douzi@adamresearchcenter.net",
        bcc: "info@thefamilylegacyroots.com",
        message: {
          subject: "إشعار نظام: حجز جلسة تعريفية جديدة",
          html: adminEmailHtml,
        },
        createdAt: serverTimestamp(),
      });

      setStep(9); // Success page
    } catch (error: any) {
      console.error("Error submitting session:", error);
      if (error.code === 'permission-denied') {
        setErrorMsg("عذراً، لا يوجد صلاحية لحفظ الطلب. يرجى من مدير النظام تحديث قواعد أمان Firestore (Rules) للسماح بحفظ الجلسات.");
      } else {
        setErrorMsg("حدث خطأ أثناء حجز الجلسة. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <h2 className="text-3xl font-serif font-bold text-brand-900 mb-6">قبل حجز جلسة التعريف</h2>
      <p className="text-xl text-brand-700 leading-relaxed max-w-2xl mx-auto mb-6">
        نشكرك على اهتمامك بخدمة سجل تراث العائلة.
      </p>
      <p className="text-lg text-brand-600 leading-relaxed max-w-2xl mx-auto mb-12">
        حتى نستثمر وقت الجلسة فيما يفيدكم، نرجو الإجابة عن بعض الأسئلة التالية، لن يستغرق ذلك أكثر من دقيقتين، وسيساعد مستشار توثيق العائلة على فهم احتياجكم قبل اللقاء.
      </p>
      <button
        onClick={handleNext}
        className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 mx-auto"
      >
        التالي <ArrowLeft className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderQuestion1 = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
      <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">ما الهدف الرئيسي من الجلسة؟</h3>
      <p className="text-brand-500 mb-6 font-medium">(اختيار واحد)</p>
      <div className="space-y-4">
        {["التعرف على الخدمة.", "معرفة آلية العمل.", "مناقشة مشروع عائلتنا."].map((opt) => (
          <label key={opt} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.mainGoal === opt ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
            <input type="radio" name="mainGoal" value={opt} checked={formData.mainGoal === opt} onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })} className="w-5 h-5 text-brand-600 focus:ring-brand-500" />
            <span className="text-lg font-medium text-brand-900">{opt}</span>
          </label>
        ))}
      </div>
      <div className="mt-10 flex justify-between items-center">
        <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
        <button onClick={handleNext} disabled={!formData.mainGoal} className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">التالي</button>
      </div>
    </motion.div>
  );

  const renderQuestion2 = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
      <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">ما نطاق المشروع الذي تفكر فيه؟</h3>
      <p className="text-brand-500 mb-6 font-medium">(اختيار واحد)</p>
      <div className="space-y-4">
        {["أسرتي المباشرة.", "العائلة الممتدة.", "أحد فروع العائلة.", "ما زلت أحتاج إلى استشارة لتحديد النطاق."].map((opt) => (
          <label key={opt} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.projectScope === opt ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
            <input type="radio" name="projectScope" value={opt} checked={formData.projectScope === opt} onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })} className="w-5 h-5 text-brand-600 focus:ring-brand-500" />
            <span className="text-lg font-medium text-brand-900">{opt}</span>
          </label>
        ))}
      </div>
      <div className="mt-10 flex justify-between items-center">
        <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
        <button onClick={handleNext} disabled={!formData.projectScope} className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">التالي</button>
      </div>
    </motion.div>
  );

  const renderQuestion3 = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
      <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">تقريبًا، إلى أي مدى تعرفون تاريخ العائلة؟</h3>
      <p className="text-brand-500 mb-6 font-medium">خيار واحد فقط</p>
      <div className="space-y-4">
        {["أعرف حتى جيلين أو ثلاثة.", "أعرف حتى خمسة أجيال.", "أعرف أكثر من خمسة أجيال.", "لدينا مشجرة نسب جاهزة.", "لا أعلم."].map((opt) => (
          <label key={opt} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.familyHistoryKnowledge === opt ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
            <input type="radio" name="familyHistoryKnowledge" value={opt} checked={formData.familyHistoryKnowledge === opt} onChange={(e) => setFormData({ ...formData, familyHistoryKnowledge: e.target.value })} className="w-5 h-5 text-brand-600 focus:ring-brand-500" />
            <span className="text-lg font-medium text-brand-900">{opt}</span>
          </label>
        ))}
      </div>
      <div className="mt-10 flex justify-between items-center">
        <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
        <button onClick={handleNext} disabled={!formData.familyHistoryKnowledge} className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">التالي</button>
      </div>
    </motion.div>
  );

  const renderQuestion4 = () => {
    const options = ["صور قديمة.", "وثائق.", "مشجرات نسب.", "كتب أو مخطوطات.", "روايات يعرفها كبار العائلة.", "لا توجد مواد حالياً."];
    const toggleMaterial = (opt: string) => {
      let updated = [...formData.materialsAvailable];
      if (opt === "لا توجد مواد حالياً.") {
        updated = ["لا توجد مواد حالياً."];
      } else {
        updated = updated.filter(i => i !== "لا توجد مواد حالياً.");
        if (updated.includes(opt)) {
          updated = updated.filter(i => i !== opt);
        } else {
          updated.push(opt);
        }
      }
      setFormData({ ...formData, materialsAvailable: updated });
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
        <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">هل لدى العائلة مواد يمكن الاستفادة منها؟</h3>
        <p className="text-brand-500 mb-6 font-medium">(اختيار متعدد)</p>
        <div className="space-y-4">
          {options.map((opt) => (
            <label key={opt} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.materialsAvailable.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
              <input type="checkbox" checked={formData.materialsAvailable.includes(opt)} onChange={() => toggleMaterial(opt)} className="w-5 h-5 text-brand-600 focus:ring-brand-500 rounded" />
              <span className="text-lg font-medium text-brand-900">{opt}</span>
            </label>
          ))}
        </div>
        <div className="mt-10 flex justify-between items-center">
          <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
          <button onClick={handleNext} disabled={formData.materialsAvailable.length === 0} className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">التالي</button>
        </div>
      </motion.div>
    );
  };

  const renderQuestion5 = () => {
    const options = ["عمود النسب", "الروايات العائلية", "الوثائق التاريخية", "الصور القديمة", "سجل متكامل للعائلة"];
    const toggleItem = (opt: string) => {
      let updated = [...formData.whatToDocument];
      if (updated.includes(opt)) {
        updated = updated.filter(i => i !== opt);
      } else {
        updated.push(opt);
      }
      setFormData({ ...formData, whatToDocument: updated });
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
        <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">ماذا ترغب في توثيقه؟</h3>
        <p className="text-brand-500 mb-6 font-medium">(اختيار متعدد)</p>
        <div className="space-y-4">
          {options.map((opt) => (
            <label key={opt} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.whatToDocument.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
              <input type="checkbox" checked={formData.whatToDocument.includes(opt)} onChange={() => toggleItem(opt)} className="w-5 h-5 text-brand-600 focus:ring-brand-500 rounded" />
              <span className="text-lg font-medium text-brand-900">{opt}</span>
            </label>
          ))}
        </div>
        <div className="mt-10 flex justify-between items-center">
          <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
          <button onClick={handleNext} disabled={formData.whatToDocument.length === 0} className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">التالي</button>
        </div>
      </motion.div>
    );
  };

  const renderQuestion6 = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
      <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">ما الذي دفعكم للتفكير في توثيق تاريخ العائلة الآن؟</h3>
      <p className="text-brand-500 mb-4 font-medium">(مساحة كتابة قصيرة – 2 أو 3 أسطر فقط)</p>
      <textarea
        value={formData.motivation}
        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
        placeholder='"نرغب في توثيق روايات كبار العائلة قبل أن تضيع."'
        className="w-full h-32 p-5 border-2 border-gray-200 rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 resize-none"
      />
      <div className="mt-10 flex justify-between items-center">
        <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
        <button onClick={handleNext} disabled={!formData.motivation.trim()} className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">التالي</button>
      </div>
    </motion.div>
  );

  const renderContact = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full text-right">
        <h3 className="text-2xl font-bold text-brand-900 mb-8 font-serif">أين تقيم العائلة أو معظم أفرادها؟</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-brand-900 font-bold mb-2">الدولة</label>
            <div className="relative">
              <select 
                value={formData.country} 
                onChange={(e) => {
                  const selectedC = ALL_COUNTRIES.find(c => c.name === e.target.value);
                  setFormData({ 
                    ...formData, 
                    country: e.target.value,
                    phoneCode: selectedC?.code || formData.phoneCode
                  });
                }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-600 appearance-none pr-4 pl-10"
              >
                <option value="">اختر الدولة</option>
                {ALL_COUNTRIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-brand-900 font-bold mb-2">الموطن الأصلي للعائلة <span className="text-gray-400 font-normal">(اختياري)</span></label>
            <input 
              type="text" 
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-600"
            />
          </div>

          <hr className="my-8 border-gray-200" />
          <h3 className="text-2xl font-bold text-brand-900 mb-6 font-serif">التواصل معك وكيف تفضل أن تكون جلسة التعريف؟</h3>

          <div>
            <label className="block text-brand-900 font-bold mb-2">الاسم</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-brand-900 font-bold mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-600 text-left" dir="ltr"
            />
          </div>

          <div>
            <label className="block text-brand-900 font-bold mb-2">الهاتف الجوال</label>
            <div className="flex" dir="ltr">
              <input
                type="text"
                value={formData.phoneCode || "+"}
                onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                className="bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl px-2 w-20 text-center font-bold text-brand-700 focus:border-brand-600 focus:ring-0 focus:bg-white outline-none"
                placeholder="+"
              />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-r-xl focus:border-brand-600 focus:ring-0" 
                placeholder="رقم الجوال"
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-900 font-bold mb-4 mt-6">كيف تفضل أن تكون جلسة التعريف؟</label>
            <div className="space-y-4">
              {[
                { id: "Google Meet", label: "اجتماع عبر Google Meet", icon: Video },
                { id: "WhatsApp", label: "مكالمة هاتفية (عبر واتساب)", icon: Phone },
                { id: "Telegram", label: "مكالمة هاتفية (عبر تيلغرام)", icon: MessageCircle }
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.commPreference === opt.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
                  <input type="radio" name="commPref" value={opt.id} checked={formData.commPreference === opt.id} onChange={(e) => setFormData({ ...formData, commPreference: e.target.value })} className="w-5 h-5 text-brand-600 focus:ring-brand-500" />
                  <opt.icon className="w-6 h-6 text-brand-600" />
                  <span className="text-lg font-medium text-brand-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
          <button 
            onClick={handleNext} 
            disabled={!formData.country || !formData.name || !formData.email || !formData.phone || !formData.commPreference} 
            className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            التالي
          </button>
        </div>
      </motion.div>
    );
  };

  const renderCalendar = () => {
    // Generate dates starting from tomorrow for 7 days
    const dates = Array.from({length: 14}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + 1 + i);
      return d;
    });

    const times = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full text-right">
        
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 mb-8 text-center shadow-sm">
          <p className="text-lg text-brand-800 font-medium leading-relaxed">
            جلسة التعريف <span className="font-bold text-brand-900">مجانية</span> ومدتها <span className="font-bold text-brand-900">30 دقيقة</span>.<br/>
            هدفها التعرف على احتياجكم والإجابة عن الأسئلة وشرح آلية العمل، وتحديد مدى ملاءمة الخدمة لمشروعكم.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-brand-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5"/> اختر اليوم</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {dates.map((date, idx) => {
                const dateStr = date.toISOString().split('T')[0];
                const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'short' }).format(date);
                const dayNum = date.getDate();
                const monthName = new Intl.DateTimeFormat('ar-SA', { month: 'short' }).format(date);
                
                return (
                  <button 
                    key={idx}
                    onClick={() => setFormData({ ...formData, selectedDate: dateStr, selectedTime: '' })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.selectedDate === dateStr ? 'border-brand-600 bg-brand-50 shadow-md' : 'border-gray-200 hover:border-brand-300 bg-white'}`}
                  >
                    <span className="text-xs font-bold text-brand-500 mb-1">{dayName}</span>
                    <span className="text-2xl font-bold text-brand-900">{dayNum}</span>
                    <span className="text-xs text-brand-700">{monthName}</span>
                  </button>
                )
              })}
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <h4 className="font-bold text-brand-900 flex items-center gap-2"><Clock className="w-5 h-5"/> اختر الوقت</h4>
              <span className="text-[11px] text-gray-500 mr-7 mt-1 flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit">
                التوقيت (GMT+2)
              </span>
            </div>
            {formData.selectedDate ? (
              <div className="grid grid-cols-2 gap-3">
                {times.map(time => (
                  <button
                    key={time}
                    onClick={() => setFormData({ ...formData, selectedTime: time })}
                    className={`p-4 rounded-xl border-2 text-center transition-all font-mono font-bold ${formData.selectedTime === time ? 'border-brand-600 bg-brand-600 text-white shadow-md' : 'border-gray-200 hover:border-brand-300 bg-white text-brand-900'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 text-gray-400 p-8 text-center">
                الرجاء اختيار اليوم أولاً لرؤية الأوقات المتاحة
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium text-center">
            {errorMsg}
          </div>
        )}

        <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200">
          <button onClick={handlePrev} className="text-brand-600 font-medium hover:text-brand-800 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> السابق</button>
          <button 
            onClick={handleSubmit} 
            disabled={!formData.selectedDate || !formData.selectedTime || loading} 
            className="bg-brand-600 disabled:opacity-50 hover:bg-brand-700 text-white px-10 py-4 rounded-xl font-bold transition shadow-lg flex items-center gap-2"
          >
            {loading ? "جاري الحجز..." : "تأكيد الحجز"}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderSuccess = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto w-full text-center py-12">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">شكراً ..</h2>
      <p className="text-xl text-brand-700 mb-8">تم حجز موعد الجلسة الخاصة بكم بنجاح ، فضلاً اطلع على بريدك الألكتروني .</p>
      
      <div className="bg-brand-50 rounded-2xl p-8 border border-brand-100 text-right mb-10 inline-block text-right mx-auto min-w-[300px]">
        <h4 className="font-bold text-brand-900 mb-6 text-xl border-b border-brand-200 pb-4">تفاصيل الجلسة</h4>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Video className="w-6 h-6 text-brand-500 shrink-0" />
            <div>
              <p className="text-sm text-brand-600 font-bold mb-1">مكان الإجتماع:</p>
              <div className="font-medium text-brand-900">
                {formData.commPreference === 'Google Meet' ? (
                  <div className="flex flex-col gap-1">
                    <span>عبر جوجل ميت</span>
                    <a href="https://meet.google.com/ydc-vwcj-nsj" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-sm break-all" dir="ltr">https://meet.google.com/ydc-vwcj-nsj</a>
                  </div>
                ) : formData.commPreference === 'WhatsApp' ? 'اتصال هاتفي (عبر واتساب)' : 'اتصال هاتفي (عبر تيلغرام)'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Clock className="w-6 h-6 text-brand-500 shrink-0" />
            <div>
              <p className="text-sm text-brand-600 font-bold mb-1">الوقت:</p>
              <p className="font-medium text-brand-900 font-mono" dir="ltr">{formData.selectedTime} - {formData.selectedDate}</p>
              <p className="text-xs text-brand-500 mt-1">بتوقيت مكة المكرمة</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Clock className="w-6 h-6 text-brand-500 shrink-0" />
            <div>
              <p className="text-sm text-brand-600 font-bold mb-1">المدة المحددة:</p>
              <p className="font-medium text-brand-900">30 دقيقة</p>
            </div>
          </div>
        </div>
      </div>

      <br/>
      <Link to="/" className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition">
        العودة للصفحة الرئيسية
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {step < 9 && (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-brand-600">إستفسار {step + 1} من 9</span>
              <span className="text-sm text-brand-500">{Math.round(((step + 1) / 9) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-brand-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / 9) * 100}%` }}></div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 p-6 md:p-12 relative overflow-hidden min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://i.postimg.cc/wMpkC5mC/Pic-Pattern.png')] opacity-[0.02] mix-blend-multiply"></div>
          
          <div className="relative z-10 w-full">
            <AnimatePresence mode="wait">
              {step === 0 && <React.Fragment key="step0">{renderWelcome()}</React.Fragment>}
              {step === 1 && <React.Fragment key="step1">{renderQuestion1()}</React.Fragment>}
              {step === 2 && <React.Fragment key="step2">{renderQuestion2()}</React.Fragment>}
              {step === 3 && <React.Fragment key="step3">{renderQuestion3()}</React.Fragment>}
              {step === 4 && <React.Fragment key="step4">{renderQuestion4()}</React.Fragment>}
              {step === 5 && <React.Fragment key="step5">{renderQuestion5()}</React.Fragment>}
              {step === 6 && <React.Fragment key="step6">{renderQuestion6()}</React.Fragment>}
              {step === 7 && <React.Fragment key="step7">{renderContact()}</React.Fragment>}
              {step === 8 && <React.Fragment key="step8">{renderCalendar()}</React.Fragment>}
              {step === 9 && <React.Fragment key="step9">{renderSuccess()}</React.Fragment>}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
