import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * خدمة إرسال البريد الإلكتروني بناءً على إضافة Firebase Trigger Email
 * تعتمد هذه الخدمة على إضافة سجل في مجموعة `mail`
 * وتقوم الإضافة تلقائياً بالتقاط السجل وإرساله عبر SMTP (مثل SendGrid أو Resend)
 */

export interface EmailTemplate {
  to: string | string[];
  bcc?: string | string[];
  from?: string;
  message: {
    subject: string;
    text: string;
    html: string;
  };
}

// دالة أساسية لإرسال الإيميل
const queueEmail = async (emailData: EmailTemplate) => {
  try {
    const docData: any = {
      to: emailData.to,
      message: emailData.message,
      createdAt: serverTimestamp(),
    };
    if (emailData.bcc) docData.bcc = emailData.bcc;
    if (emailData.from) docData.from = emailData.from;
    
    await addDoc(collection(db, "mail"), docData);
    console.log("Email queued for sending successfully.");
  } catch (error) {
    console.error("Error queueing email:", error);
    // يمكن هنا تسجيل الخطأ في نظام المراقبة دون إيقاف تجربة المستخدم
  }
};

/**
 * إرسال إيميل تأكيد استلام الطلب
 */
export const sendOrderConfirmationEmail = async (userEmail: string, userName: string, orderId: string, isInvite: boolean = false) => {
  const subject = isInvite ? `مبروك! تم اعتماد طلب السجل الخاص بكم - طلب رقم #${orderId.toUpperCase()}` : `تأكيد استلام طلب وثيقة تراث العائلة - طلب رقم #${orderId.toUpperCase()}`;
  const htmlContent = isInvite ? `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>نهنئكم لإعتماد السجل الخاص بكم عبر الكود التسويقي، وقد تم البدء في البحث من قبل فريقنا المختص.</p>
          <div style="background-color: #fcebd2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>رقم الطلب:</strong> #${orderId.toUpperCase()}
          </div>
          <p>يمكنك متابعة حالة الطلب من خلال لوحة التحكم الخاصة بك.</p>
          <br />
          <p>أطيب التحيات،<br /><strong>سجل تراث العائلة</strong></p>
        </div>
      ` : `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>شكرًا لثقتك بسجل تراث العائلة. تم استلام طلبك لتوثيق السجل العائلي بنجاح.</p>
          <div style="background-color: #fcebd2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>رقم الطلب:</strong> #${orderId.toUpperCase()}
          </div>
          <p>سيقوم فريقنا المتخصص من الباحثين بمراجعة البيانات المقدمة للبدء في رحلة توثيق تراث عائلتكم.</p>
          <p>سنبقيك على اطلاع في كل مرحلة. يمكنك دائماً متابعة حالة الطلب من خلال لوحة التحكم الخاصة بك.</p>
          <br />
          <p>أطيب التحيات،<br /><strong>فريق سجل تراث العائلة</strong></p>
        </div>
      `;

  await queueEmail({
    to: userEmail,
    message: {
      subject,
      text: isInvite ? `أهلاً ${userName}، نهنئكم لإعتماد السجل الخاص بكم عبر الكود التسويقي.` : `أهلاً ${userName}، شكرًا لثقتك بنا. تم استلام طلبك لتوثيق السجل العائلي بنجاح.`,
      html: htmlContent
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

const DEFAULT_FROM = "info@thefamilylegacyroots.com";
const DEFAULT_BCC = "no-reply@thefamilylegacyroots.com";

/**
 * 1. إشعار مدير المحاسبة بانتهاء مرحلة البحث (لتحصيل الدفعة الثانية)
 */
export const sendAccountingPhaseEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: "accounting@thefamilylegacyroots.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تحديث طلب #${orderId}: انتهاء مرحلة البحث لعائلة (${familyName})`,
      text: `تم الإنتهاء من مرحلة البحث الخاصة بعائلة (${familyName}). يمكن الآن تحصيل الدفعة الثانية في حال اختار العميل نظام الدفع المرن.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إشعار استكمال البحث</h2>
          <p>تحية طيبة،</p>
          <p>نود إعلامكم بأنه قد <strong>تم الإنتهاء من مرحلة البحث والتوثيق</strong> الخاصة بسجل عائلة (<strong>${familyName}</strong>) للطلب رقم #${orderId}.</p>
          <p>يمكنكم الآن المضي قدماً في إجراءات تحصيل الدفعة الثانية إذا كان العميل قد اختار نظام الدفع المرن.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 2. إشعار مدير التصميم (تسليم المسودة من البحث إلى التصميم)
 */
export const sendDesignDraftReadyEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: "design@thefamilylegacyroots.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `السجل جاهز للتصميم المبدئي #${orderId} - عائلة (${familyName})`,
      text: `تم الإنتهاء من البحث والتوثيق الخاص بعائلة (${familyName}). مسودة سجل تراث العائلة أصبحت جاهزة، يمكنكم البدء بتصميم النسخة المبدئية.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">مسودة السجل جاهزة للتصميم</h2>
          <p>تحية طيبة،</p>
          <p>نود إعلامكم بأنه قد <strong>تم الإنتهاء من البحث والتوثيق</strong> الخاص بعائلة (<strong>${familyName}</strong>) للطلب رقم #${orderId}.</p>
          <p>مسودة سجل تراث العائلة أصبحت جاهزة الآن، وبالتالي يمكنكم البدء بالعمل على تصميم النسخة الإلكترونية (النسخة الأولية) وتسليمها إلى إدارة الطلبات.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 3. إشعار العميل باستلام المسودة الأولية
 */
export const sendCustomerDraftReadyEmail = async (userEmail: string, userName: string, orderId: string, downloadLink: string) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `مسودة سجل تراث عائلتكم أصبحت جاهزة - طلب #${orderId.toUpperCase()}`,
      text: `أهلاً ${userName}، يسعدنا إعلامك بأن المسودة الأولية لسجل تراث عائلتك أصبحت جاهزة للتصفح.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>يسعدنا جداً إعلامك بأن <strong>النسخة الأولية (المسودة)</strong> من سجل تراث العائلة أصبحت جاهزة للتصفح!</p>
          <p>لقد قمنا بجمع وتوثيق وتصميم المعلومات الأولية بعناية، وندعوك الآن للاطلاع عليها ومراجعتها.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/app" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">الانتقال إلى لوحة التحكم لاستعراض السجل</a>
          </div>
          <p>يمكنك أيضاً الوصول إليها وإبداء ملاحظاتك أو طلب تصويب عبر لوحة التحكم الخاصة بك.</p>
          <br/><p>أطيب التحيات،<br/><strong>فريق سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 4. إشعار مدير البحوث بالتصويبات من العميل
 */
export const sendResearchCorrectionsEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: "research@thefamilylegacyroots.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `طلب تصويب جديد للطلب #${orderId} - عائلة (${familyName})`,
      text: `قام العميل بطلب تصويبات على المسودة الأولية لسجل عائلة (${familyName}). يرجى المراجعة والعمل على التصويبات.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">طلب تصويبات جديد</h2>
          <p>تحية طيبة،</p>
          <p>نحيطكم علماً بأن العميل قد قام برفع طلب <strong>تصويبات</strong> على المسودة الأولية الخاصة بسجل عائلة (<strong>${familyName}</strong>) رقم #${orderId}.</p>
          <p>يرجى الدخول إلى لوحة التحكم لمراجعة الملاحظات والعمل على إجراء التصويبات اللازمة لإصدار النسخة التالية.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 5. إشعار مدير التصميم بانتهاء التصويبات (جاهز للتصميم النهائي)
 */
export const sendDesignCorrectionsAppliedEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: "design@thefamilylegacyroots.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `التصويبات مكتملة وجاهزة للتصميم #${orderId} - عائلة (${familyName})`,
      text: `تم الإنتهاء من التصويبات المطلوبة لسجل عائلة (${familyName}). يمكنكم الآن تصميم النسخة النهائية للسجل الجاهزة للطباعة.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إشعار انتهاء التصويبات المعتمدة</h2>
          <p>تحية طيبة،</p>
          <p>نود إعلامكم بأنه قد تم <strong>الإنتهاء من التصويبات المطلوبة</strong> التي حددها العميل على مسودة سجل عائلة (<strong>${familyName}</strong>) رقم #${orderId}.</p>
          <p>يمكنكم الآن بناءً على ذلك العمل على تصميم النسخة النهائية للسجل وتجهيزها للطباعة.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 6. إشعار مدير التصميم باعتماد العميل للطباعة
 */
export const sendDesignPrintApprovedEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: "design@thefamilylegacyroots.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `اعتماد الطباعة للطلب #${orderId} - عائلة (${familyName})`,
      text: `قام العميل باعتماد النسخة للطباعة والتسليم النهائي لعائلة (${familyName}). يمكنكم البدء في التجهيز للطباعة.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">اعتماد العميل للطباعة</h2>
          <p>تحية طيبة،</p>
          <p>خبر سار! لقد <strong>قام العميل باعتماد النسخة النهائية</strong> لسجل عائلة (<strong>${familyName}</strong>) رقم #${orderId} استعداداً للطباعة.</p>
          <p>يرجى اتخاذ الإجراءات اللازمة للبدء في تجهيز السجلات لعمليات الطباعة والتغليف والتسليم النهائي.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 7. إشعار إدارة الطلبات والمدير العام والمايسترو باستلام الروابط النهائية
 */
export const sendFinalLinksReadyEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: ["orders@thefamilylegacyroots.com", "manager@thefamilylegacyroots.com", "maestro@thefamilylegacyroots.com"],
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `السجل النهائي جاهز للعميل #${orderId} - عائلة (${familyName})`,
      text: `أرسل مدير التصميم الروابط النهائية الخاصة بسجل عائلة (${familyName}). السجل أصبح جاهزاً ويستطيع مدير الطلبات إرساله للعميل.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">النسخة النهائية جاهزة للتسليم</h2>
          <p>تحية طيبة للجميع،</p>
          <p>لقد قام فريق التصميم برفع <strong>الروابط والملفات النهائية</strong> المتعلقة بسجل عائلة (<strong>${familyName}</strong>) رقم #${orderId}.</p>
          <p>هذا إشعار بأن السجل أصبح الآن في صورته النهائية الكاملة وجاهز بنسبة 100%. يمكن للإدارة المعنية (إدارة الطلبات) القيام بإرساله مباشرة إلى العميل عبر لوحة التحكم.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 8. إشعار التسليم النهائي للعميل
 */
export const sendFinalDeliveryToCustomerEmail = async (userEmail: string, userName: string, orderId: string, finalLink: string) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تم اعتماد النسخة النهائية وجاهزية المطبوعات - طلب #${orderId.toUpperCase()}`,
      text: `أهلاً ${userName}، يسرنا تسليمك النسخة الرقمية النهائية الفاخرة، جاري طباعة وتجهيز المطبوعات الفاخرة ليتم إرسالها إليكم قريباً.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>اكتملت مسيرة التوثيق والتصميم، ويسرنا جداً أن نضع بين أيديكم <strong>النسخة الرقمية النهائية الفاخرة</strong> من سجل تراث العائلة.</p>
          <p>لقد تم اعتماد هذه النسخة، ونعمل حالياً بكل اعتزاز على إتمام عمليات الطباعة الفاخرة والتجليد لتجهيز الشحنة المرسلة إليكم خلال الأيام القليلة القادمة.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/app" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">تسجيل الدخول لاستعراض السجل في لوحة التحكم</a>
          </div>
          <p>سنوافيك بتفاصيل الشحن ورقم التتبع بمجرد انطلاق الشحنة في طريقها إليك.</p>
          <p>شكرًا لثقتك الغالية في مركز آدم للبحوث وتوثيق التراث.</p>
          <br/><p>أطيب التحيات،<br/><strong>فريق سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};

/**
 * 9. إشعار إدارة الطلبات والمدير العام والمايسترو بانتهاء التصميم الأولية
 */
export const sendInitialDesignReadyEmail = async (familyName: string, orderId: string) => {
  await queueEmail({
    to: ["orders@thefamilylegacyroots.com", "manager@thefamilylegacyroots.com", "maestro@thefamilylegacyroots.com"],
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `النسخة الإلكترونية الأولية جاهزة للطلب #${orderId} - عائلة (${familyName})`,
      text: `أنهى مدير التصميم إعداد النسخة الإلكترونية الأولية لسجل عائلة (${familyName}). يرجى المراجعة وتسليمها للعميل.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">النسخة الإلكترونية الأولية جاهزة</h2>
          <p>تحية طيبة للجميع،</p>
          <p>لقد أنهى فريق التصميم تصميم <strong>النسخة الإلكترونية الأولية (المسودة)</strong> الخاصة بسجل عائلة (<strong>${familyName}</strong>) رقم #${orderId}.</p>
          <p>يرجى من مدراء إدارة الطلبات استلام هذه المسودة من لوحة التحكم وإرسالها للعميل للإطلاع وإبداء الملاحظات.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `
    }
  });
};
