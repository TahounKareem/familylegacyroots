import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * خدمة إرسال البريد الإلكتروني بناءً على إضافة Firebase Trigger Email
 * تعتمد هذه الخدمة على إضافة سجل في مجموعة `mail`
 * وتقوم الإضافة تلقائياً بالتقاط السجل وإرساله عبر SMTP (مثل SendGrid أو Resend)
 */

export interface EmailTemplate {
  to: string | string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
}

// دالة أساسية لإرسال الإيميل
const queueEmail = async (emailData: EmailTemplate) => {
  try {
    await addDoc(collection(db, "mail"), {
      to: emailData.to,
      message: emailData.message,
      createdAt: serverTimestamp(),
    });
    console.log("Email queued for sending successfully.");
  } catch (error) {
    console.error("Error queueing email:", error);
    // يمكن هنا تسجيل الخطأ في نظام المراقبة دون إيقاف تجربة المستخدم
  }
};

/**
 * إرسال إيميل تأكيد استلام الطلب
 */
export const sendOrderConfirmationEmail = async (userEmail: string, userName: string, orderId: string) => {
  await queueEmail({
    to: userEmail,
    message: {
      subject: `تأكيد استلام طلب وثيقة تراث العائلة - طلب رقم #${orderId}`,
      text: `أهلاً ${userName}، شكرًا لثقتك بنا. تم استلام طلبك لتوثيق السجل العائلي بنجاح. سيقوم فريقنا بمراجعة البيانات والبدء في العمل.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>شكرًا لثقتك بمركز آدم للبحوث. تم استلام طلبك لتوثيق السجل العائلي بنجاح.</p>
          <div style="background-color: #fcebd2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>رقم الطلب:</strong> #${orderId}
          </div>
          <p>سيقوم فريقنا المتخصص من الباحثين بمراجعة البيانات المقدمة للبدء في رحلة توثيق تراث عائلتكم.</p>
          <p>سنبقيك على اطلاع في كل مرحلة. يمكنك دائماً متابعة حالة الطلب من خلال لوحة التحكم الخاصة بك.</p>
          <br />
          <p>أطيب التحيات،<br /><strong>فريق مركز آدم للبحوث</strong></p>
        </div>
      `
    }
  });
};

/**
 * إرسال إيميل طلب استيضاح أو بيانات إضافية من الباحث
 */
export const sendClarificationRequestEmail = async (userEmail: string, userName: string, orderId: string, messageBody: string) => {
  await queueEmail({
    to: userEmail,
    message: {
      subject: `تحديث بخصوص طلبك رقم #${orderId} - نود استيضاح بعض التفاصيل`,
      text: `أهلاً ${userName}، أرسل فريق البحث ملاحظة بخصوص طلبك. نرجو منك الدخول إلى حسابك للرد عليها.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>أثناء عمل باحثينا على <strong>طلبك رقم #${orderId}</strong>، توصلنا إلى بعض النقاط التي تحتاج إلى توضيح أو بيانات إضافية لضمان دقة السجل العائلي.</p>
          <div style="background-color: #f9fafb; border-right: 4px solid #6d5b3f; padding: 15px; margin: 20px 0;">
            <p>${messageBody}</p>
          </div>
          <p>يرجى الدخول إلى حسابك في المنصة للرد على الاستفسارات لنتمكن من استكمال العمل.</p>
          <br />
          <a href="https://adam.tahoun.live/dashboard" style="background-color: #6d5b3f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">الانتقال إلى لوحة التحكم</a>
        </div>
      `
    }
  });
};

/**
 * إرسال إيميل تسليم السجل النهائي
 */
export const sendDeliveryEmail = async (userEmail: string, userName: string, orderId: string, downloadLink: string) => {
  await queueEmail({
    to: userEmail,
    message: {
      subject: `مبارك! اكتمل سجل التراث العائلي الخاص بكم`,
      text: `أهلاً ${userName}، يسعدنا إخبارك بأن سجل تراث العائلة الخاص بك قد اكتمل وهو جاهز للاستلام.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>رحلة الأجداد أصبحت الآن موثقة وحاضرة. يسعدنا جداً إخبارك بأن <strong>سجل التراث العائلي قد اكتمل!</strong></p>
          <p>لقد قمنا بعمل دقيق ومرهق لضمان صحة ووضوح السجل التاريخي لعائلتكم الكريمة، ونتمنى أن يكون إرثاً غنياً تتوارثه الأجيال.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadLink}" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">استعرض وحمل الوثيقة الرقمية من هنا</a>
          </div>
          <p>كما يمكنك دائماً الوصول إليه عبر لوحة التحكم في الموقع.</p>
          <br />
          <p>شكراً لثقتكم الغالية.<br /><strong>فريق مركز آدم للبحوث</strong></p>
        </div>
      `
    }
  });
};

/**
 * فتح تذكرة دعم فني من الـ Chatbot
 */
export const createSupportTicket = async (name: string, email: string, message: string) => {
  // 1. Save ticket into "support_tickets" collection
  const ticketRef = await addDoc(collection(db, "support_tickets"), {
    name,
    email,
    message,
    status: 'open',
    createdAt: serverTimestamp(),
  });

  // 2. Email Admin
  await queueEmail({
    to: "admin@adamresearchcenter.net", // ضع الإيميل الخاص بكم هنا
    message: {
      subject: `تذكرة دعم جديدة #${ticketRef.id} من ${name}`,
      text: `رسالة جديدة من ${name} (${email}): ${message}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">تذكرة دعم فني جديدة</h2>
          <p><strong>اسم العميل:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <div style="background-color: #f9fafb; border-right: 4px solid #6d5b3f; padding: 15px; margin: 20px 0;">
            <p><strong>الرسالة:</strong><br/>${message}</p>
          </div>
          <p><small style="color:#666;">رقم التذكرة الأرشيفي: ${ticketRef.id}</small></p>
        </div>
      `
    }
  });

  // 3. Email User (Confirmation)
  await queueEmail({
    to: email,
    message: {
      subject: `استلمنا رسالتك - مركز آدم للبحوث`,
      text: `أهلاً ${name}، استلمنا رسالتك وسنقوم بالرد عليك في أقرب وقت.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${name}،</h2>
          <p>شكراً لتواصلك مع مركز آدم للبحوث.</p>
          <p>نؤكد لك أننا استلمنا رسالتك الخاصة باستفسارك بعناية. قام نظامنا بإنشاء تذكرة دعم مخصصة لك برقم مسار <strong>#${ticketRef.id}</strong>.</p>
          <p>سيقوم أحد باحثينا أو أفراد خدمة العملاء بالرد عليك عبر هذا البريد الإلكتروني خلال <strong>24 إلى 48 ساعة</strong>.</p>
          <br />
          <p>أطيب التحيات،<br /><strong>فريق الدعم - مركز آدم للبحوث</strong></p>
        </div>
      `
    }
  });
};

