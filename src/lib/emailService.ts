import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * خدمة إرسال البريد الإلكتروني بناءً على إضافة Firebase Trigger Email
 * تعتمد هذه الخدمة على إضافة سجل في مجموعة `mail`
 * وتقوم الإضافة تلقائياً بالتقاط السجل وإرساله عبر SMTP (مثل SendGrid أو Resend)
 */

export interface EmailTemplate {
  to: string | string[];
  cc?: string | string[];
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
    const sender = emailData.from || "سجل تراث العائلة <info@thefamilylegacyroots.com>";
    const docData: any = {
      to: emailData.to,
      message: {
        ...emailData.message,
        from: sender
      },
      createdAt: serverTimestamp(),
    };
    if (emailData.cc) docData.cc = emailData.cc;
    if (emailData.bcc) docData.bcc = emailData.bcc;

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
export const sendOrderConfirmationEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  isInvite: boolean = false,
) => {
  const subject = `بدأت رحلة توثيق سجل تراث عائلتكم`;
  const htmlContent = `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>نشكر لكم ثقتكم واختياركم خدمة سجل تراث العائلة.</p>
          <p>يسرنا إبلاغكم بأنه تم تأكيد طلبكم واستلام الدفعة المستحقة بنجاح، وقد انتقل مشروعكم الآن إلى مرحلة البحث.</p>
          <p>سيباشر فريقنا خلال هذه المرحلة مراجعة البيانات والمواد المقدمة، والاستفادة من المصادر وقواعد البيانات المتاحة وفق المنهجية البحثية المعتمدة لإعداد سجل تراث عائلتكم.</p>
          <p>يمكنكم في أي وقت متابعة حالة السجل الأساسي من خلال لوحة التحكم، كما يمكنكم البدء في إثراء السجل العائلي بإضافة الصور والوثائق والذكريات والمعلومات التي ترون أنها تسهم في حفظ تاريخ عائلتكم.</p>
          <p>هذه هي الخطوة الأولى في رحلة تهدف إلى جمع ما تفرق من الروايات والوثائق والذكريات في سجل واحد يبقى مرجعاً للأبناء والأحفاد والأجيال القادمة.</p>
          
          <div style="margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/dashboard" style="background-color: #6d5b3f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">عرض حالة السجل الأساسي</a>
          </div>

          <p>مع خالص التقدير،</p>
          <p><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `;

  await queueEmail({
    to: userEmail,
    message: {
      subject,
      text: `بدأت رحلة توثيق سجل تراث عائلتكم`,
      html: htmlContent,
    },
  });
};

export const sendManagementNewOrderEmail = async (
  orderId: string,
  familyName: string,
) => {
  await queueEmail({
    to: "Kareem.Tahoun@adamresearchcenter.net",
    cc: "Hassan.Alamri@adamresearchcenter.net",
    bcc: "info@thefamilylegacyroots.com",
    from: DEFAULT_FROM,
    message: {
      subject: `طلب جديد جاري التنفيذ - عائلة ${familyName}`,
      text: `تم استلام طلب جديد لعائلة ${familyName} برقم ${orderId}. الطلب الآن في مرحلة البحث بانتظار تعيين باحث.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إشعار بطلب جديد (جاري التنفيذ)</h2>
          <p>تحية طيبة،</p>
          <p>نفيدكم علماً بأنه قد تم وصول طلب جديد وبدأت مرحلة التنفيذ (الطلب الآن في <strong>مرحلة البحث</strong>).</p>
          <ul>
            <li><strong>رقم الطلب:</strong> ${orderId}</li>
            <li><strong>العائلة:</strong> ${familyName}</li>
          </ul>
          <p>يرجى التفضل بالدخول إلى لوحة التحكم لتعيين <strong>باحث مسؤول</strong> عن هذا الطلب للبدء في التنفيذ في أسرع وقت.</p>
          <br/><p>مع خالص التحيات،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `,
    },
  });
};

/**
 * إرسال إيميل طلب استيضاح أو بيانات إضافية من الباحث
 */
export const sendClarificationRequestEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  messageBody: string,
) => {
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
      `,
    },
  });
};

/**
 * إرسال إيميل تسليم السجل النهائي
 */
export const sendDeliveryEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  downloadLink: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `اكتملت رحلة توثيق سجل تراث عائلتكم`,
      text: `أهلاً ${userName}، اكتملت رحلة التوثيق. ويسعدنا اليوم أن نضع بين أيديكم النسخة النهائية من سجل تراث عائلتكم.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">اكتملت رحلة توثيق سجل تراث عائلتكم</h2>
          <p>أهلاً ${userName}،</p>
          <p>اكتملت رحلة التوثيق.<br/>ويسعدنا اليوم أن نضع بين أيديكم النسخة النهائية من سجل تراث عائلتكم.</p>
          <p>لقد جمع هذا السجل بين ما توفر من روايات ووثائق ومواد تاريخية ومعلومات عائلية ضمن عمل واحد أُعد ليكون مرجعاً يحفظ ذاكرة العائلة للأبناء والأحفاد والأجيال القادمة.</p>
          <p>يمكنكم الآن استعراض النسخة الرقمية النهائية من خلال لوحة التحكم.</p>
          <p>كما بدأ فريقنا إجراءات إعداد النسخ الورقية للطباعة والتجليد تمهيداً لشحنها إليكم، وسنزودكم بمعلومات الشحن فور جاهزيتها.</p>
          <p>شكراً لثقتكم بنا ومشاركتنا هذه الرحلة.<br/>لأن بعض الأشياء لا تُشترى... بل تُورث.</p>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * فتح تذكرة دعم فني من الـ Chatbot
 */
export const createSupportTicket = async (
  name: string,
  email: string,
  message: string,
) => {
  // 1. Save ticket into "support_tickets" collection
  const ticketRef = await addDoc(collection(db, "support_tickets"), {
    name,
    email,
    message,
    status: "open",
    createdAt: serverTimestamp(),
  });

  // 2. Email Admin
  await queueEmail({
    to: "admin@adamresearchcenter.net", // ضع الإيميل الخاص بكم هنا
    bcc: DEFAULT_BCC,
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
      `,
    },
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
      `,
    },
  });
};

const DEFAULT_FROM = "سجل تراث العائلة <info@thefamilylegacyroots.com>";
const DEFAULT_BCC = ["info@thefamilylegacyroots.com"];

/**
 * 1. إشعار إدارة البحوث بإسناد طلب جديد للبحث والتوثيق
 */
export const sendResearchAssignedEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "eng.kareemsherif@gmail.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `إسناد طلب جديد للبحث والتوثيق #${orderId} - عائلة (${familyName})`,
      text: `تم استلام طلب جديد وتعيين باحث للبدء بأعمال البحث والتوثيق لعائلة (${familyName}).`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إشعار استلام طلب جديد للبحث والتوثيق</h2>
          <p>تحية طيبة،</p>
          <p>نود إعلامكم بأنه قد تم <strong>إسناد طلب جديد</strong> لفريق البحوث الخاص بسجل عائلة (<strong>${familyName}</strong>) للطلب رقم #${orderId}.</p>
          <p>يرجى البدء بالإجراءات المتبعة في منهجية البحث والتوثيق.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `,
    },
  });
};

/**
 * 2. إشعار إدارة المحاسبة بانتهاء البحث (لتحصيل الدفعة الثانية)
 */
export const sendAccountingPhaseEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "tahoun.kareemsherif@gmail.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تحديث طلب #${orderId}: انتهاء مرحلة البحث لعائلة (${familyName})`,
      text: `تم الإنتهاء من مرحلة البحث الخاصة بعائلة (${familyName}). يمكن الآن تحصيل الدفعة الثانية في حال اختار العميل نظام الدفع المرن.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إشعار استكمال البحث</h2>
          <p>تحية طيبة،</p>
          <p>نود إعلامكم بأنه قد <strong>تم الإنتهاء من مرحلة البحث</strong> الخاصة بسجل عائلة (<strong>${familyName}</strong>) للطلب رقم #${orderId}.</p>
          <p>يمكنكم الآن المضي قدماً في إجراءات تحصيل الدفعة الثانية إذا كان العميل قد اختار نظام الدفع المرن.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `,
    },
  });
};

/**
 * 3. إشعار إدارة المحاسبة بانتهاء التوثيق (لتحصيل الدفعة الثالثة)
 */
export const sendDocumentationPhaseEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "tahoun.kareemsherif@gmail.com",
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تحديث طلب #${orderId}: انتهاء مرحلة التوثيق لعائلة (${familyName})`,
      text: `تم الإنتهاء من مرحلة التوثيق الخاصة بعائلة (${familyName}). يمكن الآن تحصيل الدفعة الثالثة في حال اختار العميل نظام الدفع المرن.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إشعار استكمال التوثيق</h2>
          <p>تحية طيبة،</p>
          <p>نود إعلامكم بأنه قد <strong>تم الإنتهاء من مرحلة التوثيق</strong> الخاصة بسجل عائلة (<strong>${familyName}</strong>) للطلب رقم #${orderId}.</p>
          <p>يمكنكم الآن المضي قدماً في إجراءات تحصيل الدفعة الثالثة إذا كان العميل قد اختار نظام الدفع المرن.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `,
    },
  });
};

/**
 * 4. إشعار إدارة التصميم بتسليم المسودة (من البحث للتصميم)
 */
export const sendDesignDraftReadyEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "ahlymember@gmail.com",
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
      `,
    },
  });
};

/**
 * 5. إشعار إدارة الطلبات بانتهاء التصميم الأولي (المسودة)
 */
export const sendInitialDesignReadyEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "Kareem.Tahoun@adamresearchcenter.net",
    cc: "Hassan.Alamri@adamresearchcenter.net",
    bcc: "info@thefamilylegacyroots.com",
    from: DEFAULT_FROM,
    message: {
      subject: `النسخة الأولية لسجل تراث العائلة جاهزة للإرسال الى العميل #${orderId} - عائلة (${familyName})`,
      text: `أنهى مدير التصميم إعداد النسخة الإلكترونية الأولية لسجل عائلة (${familyName}). يرجى المراجعة وتسليمها للعميل.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">النسخة الإلكترونية الأولية جاهزة</h2>
          <p>تحية طيبة للجميع،</p>
          <p>لقد أنهى فريق التصميم تصميم <strong>النسخة الإلكترونية الأولية (المسودة)</strong> الخاصة بسجل عائلة (<strong>${familyName}</strong>) رقم #${orderId}.</p>
          <p>يرجى من مدراء إدارة الطلبات استلام هذه المسودة من لوحة التحكم وإرسالها للعميل للإطلاع وإبداء الملاحظات.</p>
          <br/><p>مع التحية،<br/><strong>النظام الآلي - سجل تراث العائلة</strong></p>
        </div>
      `,
    },
  });
};

/**
 * 6. إشعار العميل باستلام المسودة الأولية
 */
export const sendCustomerDraftReadyEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  downloadLink: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `النسخة الأولية من سجل تراث عائلتكم أصبحت جاهزة`,
      text: `أهلاً ${userName}، يسرنا أن نشارككم أولى ثمار هذه الرحلة. لقد انتهى فريقنا من إعداد النسخة الأولية لسجل تراث عائلتكم.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>يسرنا أن نشارككم أولى ثمار هذه الرحلة.</p>
          <p>لقد انتهى فريقنا من إعداد النسخة الأولية لسجل تراث عائلتكم، والتي تجمع ما تم التوصل إليه خلال مراحل البحث والتوثيق والإعداد الأولي.</p>
          <p>ندعوكم الآن إلى استعراض السجل بعناية، وإضافة ما ترونه من ملاحظات أو تصويبات خلال الفترة المخصصة للمراجعة، لنتمكن من إكمال العمل بالصورة التي تليق بتاريخ عائلتكم وإرثها.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/auth" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">عرض النسخة الأولية</a>
          </div>
          <br/><p>مع خالص التقدير،<br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 7. إشعار إدارة البحوث بطلب تصويبات من العميل
 */
export const sendResearchCorrectionsEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "eng.kareemsherif@gmail.com",
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
      `,
    },
  });
};

/**
 * 8. إشعار إدارة التصميم باعتماد العميل للطباعة
 */
export const sendDesignPrintApprovedEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "ahlymember@gmail.com",
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
      `,
    },
  });
};

/**
 * 9. إشعار إدارة التصميم بانتهاء التصويبات
 */
export const sendDesignCorrectionsAppliedEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "ahlymember@gmail.com",
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
      `,
    },
  });
};

/**
 * 10. إشعار إدارة الطلبات باستلام الروابط النهائية (من التصميم لإدارة الطلبات)
 */
export const sendFinalLinksReadyEmail = async (
  familyName: string,
  orderId: string,
) => {
  await queueEmail({
    to: "Kareem.Tahoun@adamresearchcenter.net",
    cc: "Hassan.Alamri@adamresearchcenter.net",
    bcc: "info@thefamilylegacyroots.com",
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
      `,
    },
  });
};

/**
 * 11. إشعار العميل باستلام السجل النهائي
 */
export const sendFinalDeliveryToCustomerEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  finalLink: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `اكتملت رحلة توثيق سجل تراث عائلتكم`,
      text: `أهلاً ${userName}، اكتملت رحلة التوثيق. ويسعدنا اليوم أن نضع بين أيديكم النسخة النهائية من سجل تراث عائلتكم.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">اكتملت رحلة توثيق سجل تراث عائلتكم</h2>
          <p>أهلاً ${userName}،</p>
          <p>اكتملت رحلة التوثيق.<br/>ويسعدنا اليوم أن نضع بين أيديكم النسخة النهائية من سجل تراث عائلتكم.</p>
          <p>لقد جمع هذا السجل بين ما توفر من روايات ووثائق ومواد تاريخية ومعلومات عائلية ضمن عمل واحد أُعد ليكون مرجعاً يحفظ ذاكرة العائلة للأبناء والأحفاد والأجيال القادمة.</p>
          <p>يمكنكم الآن استعراض النسخة الرقمية النهائية من خلال لوحة التحكم.</p>
          <p>كما بدأ فريقنا إجراءات إعداد النسخ الورقية للطباعة والتجليد تمهيداً لشحنها إليكم، وسنزودكم بمعلومات الشحن فور جاهزيتها.</p>
          <p>شكراً لثقتكم بنا ومشاركتنا هذه الرحلة.<br/>لأن بعض الأشياء لا تُشترى... بل تُورث.</p>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 12. إشعار العميل ببدء البحث بعد الدفع
 */
export const sendCustomerResearchStartedEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `بدأت رحلة توثيق سجل تراث عائلتكم`,
      text: `أهلاً ${userName}، نشكر لكم ثقتكم واختياركم خدمة سجل تراث العائلة. يسرنا إبلاغكم بأنه تم تأكيد طلبكم واستلام الدفعة المستحقة بنجاح، وقد انتقل مشروعكم الآن إلى مرحلة البحث.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>نشكر لكم ثقتكم واختياركم خدمة سجل تراث العائلة.</p>
          <p>يسرنا إبلاغكم بأنه تم تأكيد طلبكم واستلام الدفعة المستحقة بنجاح، وقد انتقل مشروعكم الآن إلى <strong>مرحلة البحث</strong>.</p>
          <p>سيباشر فريقنا خلال هذه المرحلة مراجعة البيانات والمواد المقدمة، والاستفادة من المصادر وقواعد البيانات المتاحة وفق المنهجية البحثية المعتمدة لإعداد سجل تراث عائلتكم.</p>
          <p>يمكنكم في أي وقت متابعة حالة السجل الأساسي من خلال لوحة التحكم، كما يمكنكم البدء في إثراء السجل العائلي بإضافة الصور والوثائق والذكريات والمعلومات التي ترون أنها تسهم في حفظ تاريخ عائلتكم.</p>
          <p>هذه هي الخطوة الأولى في رحلة تهدف إلى جمع ما تفرق من الروايات والوثائق والذكريات في سجل واحد يبقى مرجعاً للأبناء والأحفاد والأجيال القادمة.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/auth" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">عرض حالة السجل الأساسي</a>
          </div>
          <br/><p>مع خالص التقدير،<br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 13. إشعار العميل بالانتقال إلى مرحلة التوثيق
 */
export const sendCustomerDocumentationPhaseEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `اكتملت مرحلة البحث وبدأت مرحلة التوثيق`,
      text: `أهلاً ${userName}، يسرنا إبلاغكم بأن فريق البحث قد أكمل المرحلة البحثية الخاصة بسجل تراث عائلتكم، وانتقل المشروع الآن إلى مرحلة التوثيق.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">اكتملت مرحلة البحث وبدأت مرحلة التوثيق</h2>
          <p>أهلاً ${userName}،</p>
          <p>يسرنا إبلاغكم بأن فريق البحث قد أكمل المرحلة البحثية الخاصة بسجل تراث عائلتكم، وانتقل المشروع الآن إلى مرحلة التوثيق.</p>
          <p>خلال هذه المرحلة يعمل فريقنا على مراجعة وتنظيم وتحليل النتائج المتوصل إليها، وربط المعلومات بالمصادر ذات الصلة، وإعداد المحتوى الذي سيشكل الأساس العلمي والتوثيقي للسجل.</p>
          <p>كما نود التذكير بأنه لا يزال بإمكانكم إثراء السجل العائلي من خلال إضافة الصور أو الوثائق أو الذكريات أو المعلومات التي ترون أنها تستحق أن تكون جزءاً من هذا العمل.</p>
          <p>يمكنكم متابعة حالة المشروع وتطوراته من خلال لوحة التحكم الخاصة بكم في أي وقت.</p>
          <p>لقد أصبحت صورة تاريخ عائلتكم أكثر وضوحاً، ونحن نواصل العمل على تحويل ما تم جمعه من روايات ووثائق ومعلومات إلى سجل متكامل يحفظ إرث العائلة للأجيال القادمة.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/auth" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">عرض حالة السجل الأساسي</a>
          </div>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 14. إشعار العميل بالانتقال إلى مرحلة الإخراج الفني (التصميم)
 */
export const sendCustomerDesignPhaseEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `انتقل سجل تراث عائلتكم إلى مرحلة الإخراج الفني`,
      text: `أهلاً ${userName}، يسرنا إبلاغكم بأن مشروع سجل تراث عائلتكم قد انتقل إلى مرحلة الإخراج الفني.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">انتقل سجل تراث عائلتكم إلى مرحلة الإخراج الفني</h2>
          <p>أهلاً ${userName}،</p>
          <p>يسرنا إبلاغكم بأن مشروع سجل تراث عائلتكم قد انتقل إلى مرحلة الإخراج الفني.</p>
          <p>بعد اكتمال مراحل البحث والتوثيق، يعمل فريقنا الآن على إعداد السجل في صورته النهائية، من خلال تنظيم المحتوى وإخراجه بأسلوب أنيق ومتناسق يليق بتاريخ عائلتكم وإرثها.</p>
          <p>خلال هذه المرحلة يتم العمل على تنسيق النصوص، وإعداد الصفحات، وتنظيم الصور والوثائق والمحتويات المعتمدة، تمهيداً لإصدار النسخة الأولية من السجل ومشاركتها معكم للمراجعة.</p>
          <p>يمكنكم متابعة حالة السجل الأساسي (المشروع) من خلال لوحة التحكم الخاصة بكم في أي وقت.</p>
          <p>لقد بدأت الآن ملامح سجل تراث عائلتكم بالظهور، ونحن نواصل العمل على تحويل ما جُمع من روايات ووثائق وذكريات إلى سجل متكامل يحفظ تاريخ العائلة للأبناء والأحفاد والأجيال القادمة.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/auth" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">عرض حالة السجل الأساسي</a>
          </div>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
             <strong>سجل تراث العائلة</strong><br/>
             مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 15. إشعار العميل باستلام التصويبات
 */
export const sendCustomerCorrectionsReceivedEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تم استلام ملاحظاتكم وتصويباتكم`,
      text: `أهلاً ${userName}، تم استلام ملاحظاتكم وتصويباتكم بنجاح. سيقوم فريق البحث والتوثيق بمراجعتها والعمل على دراستها.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>تم استلام ملاحظاتكم وتصويباتكم بنجاح.</p>
          <p>سيقوم فريق البحث والتوثيق بمراجعة كافة الملاحظات الواردة والعمل على دراستها وإدراج ما يلزم منها ضمن النسخة النهائية للسجل وفق المنهجية المعتمدة.</p>
          <p>سنوافيكم بالتحديثات فور اكتمال هذه المرحلة.</p>
          <p>شكراً لمساهمتكم في إثراء سجل تراث عائلتكم.</p>
          <br/><p>مع خالص التقدير،<br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 16. رسالة للعميل تفيد بانتهاء مراجعة التصويبات (اكتملت مراجعة التصويبات وإعداد النسخة النهائية)
 */
export const sendCustomerCorrectionsAppliedEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `اكتملت مراجعة التصويبات وإعداد النسخة النهائية`,
      text: `أهلاً ${userName}، يسرنا إبلاغكم بأن فريقنا قد انتهى من مراجعة الملاحظات والتصويبات الواردة من قبلكم.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً ${userName}،</h2>
          <p>يسرنا إبلاغكم بأن فريقنا قد انتهى من مراجعة الملاحظات والتصويبات الواردة من قبلكم، وتم استكمال ما يلزم منها وفق المنهجية المعتمدة في إعداد السجل.</p>
          <p>وبذلك أصبح سجل تراث عائلتكم في صورته النهائية بعد استكمال مراحل البحث والتوثيق والإخراج الفني والمراجعة.</p>
          <p>نشكر لكم مساهمتكم في إثراء هذا العمل، وما قدمتموه من ملاحظات ومعلومات أسهمت في تعزيز محتوى السجل وإظهاره بأفضل صورة ممكنة.</p>
          <p>يجري حالياً استكمال الإجراءات النهائية الخاصة بالتسليم والإغلاق، وسنوافيكم قريباً بإشعار اكتمال رحلة التوثيق وتسليم النسخة النهائية من السجل.</p>
          <p>يمكنكم متابعة حالة المشروع (السجل الأساسي) من خلال لوحة التحكم الخاصة بكم في أي وقت.</p>
          <br/><p>مع خالص التقدير،<br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 17. رسالة إعادة تعيين كلمة المرور (عند استخدام رابط مخصص مستقبلاً)
 */
export const sendCustomPasswordResetEmail = async (
  userEmail: string,
  userName: string,
  resetLink: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `إعادة تعيين كلمة المرور`,
      text: `أهلاً ${userName}، تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابكم. يرجى استخدام الرابط التالي: ${resetLink}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">إعادة تعيين كلمة المرور</h2>
          <p>أهلاً ${userName}،</p>
          <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابكم في منصة سجل تراث العائلة.</p>
          <p>لإنشاء كلمة مرور جديدة، يرجى الضغط على الزر أدناه:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">إعادة تعيين كلمة المرور</a>
          </div>
          <p>لأسباب أمنية، تنتهي صلاحية هذا الرابط بعد فترة محددة، لذا نوصي بإتمام العملية في أقرب وقت.</p>
          <p>إذا لم تقم بطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان، ولن يتم إجراء أي تغيير على حسابكم.</p>
          <p>في حال واجهتكم أي صعوبة، يسعد فريق الدعم الفني بمساعدتكم.</p>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            منصة متخصصة لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 18. رسالة تم تغيير كلمة المرور بنجاح
 */
export const sendPasswordChangedSuccessEmail = async (
  userEmail: string,
  userName: string,
) => {
  const currentDate = new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date());

  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تم تغيير كلمة المرور بنجاح`,
      text: `أهلاً ${userName}، نود إبلاغكم بأنه تم تحديث كلمة المرور الخاصة بحسابكم في منصة سجل تراث العائلة بنجاح.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">تم تغيير كلمة المرور بنجاح</h2>
          <p>أهلاً ${userName}،</p>
          <p>نود إبلاغكم بأنه تم تحديث كلمة المرور الخاصة بحسابكم في منصة سجل تراث العائلة بنجاح.</p>
          <p>تاريخ التحديث: ${currentDate}</p>
          <p>يمكنكم الآن استخدام كلمة المرور الجديدة لتسجيل الدخول إلى حسابكم والاستفادة من خدمات المنصة.</p>
          <p>إذا كنتم أنتم من قام بإجراء هذا التغيير، فلا يلزم اتخاذ أي إجراء إضافي.</p>
          <p>أما إذا لم تقوموا بتغيير كلمة المرور أو لديكم أي مخاوف تتعلق بأمان الحساب، فنرجو التواصل مع فريق الدعم الفني فوراً.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/auth" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">تسجيل الدخول إلى حسابي</a>
          </div>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            منصة متخصصة لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 19. رسالة تسجيل دخول جديد إلى حسابكم (تم التعرف على جهاز/متصفح جديد)
 */
export const sendNewLoginEmail = async (
  userEmail: string,
  userName: string,
  loginTime: string,
  deviceInfo?: string,
  locationInfo?: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تسجيل دخول جديد إلى حسابكم`,
      text: `أهلاً ${userName}، تم تسجيل دخول جديد إلى حسابكم في منصة سجل تراث العائلة.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">تسجيل دخول جديد إلى حسابكم</h2>
          <p>أهلاً ${userName}،</p>
          <p>تم تسجيل دخول جديد إلى حسابكم في منصة سجل تراث العائلة.</p>
          <p><strong>تفاصيل تسجيل الدخول:</strong></p>
          <ul>
            <li><strong>التاريخ والوقت:</strong> ${loginTime}</li>
            ${deviceInfo ? `<li><strong>الجهاز أو المتصفح:</strong> ${deviceInfo}</li>` : ""}
            ${locationInfo ? `<li><strong>الموقع التقريبي:</strong> ${locationInfo}</li>` : ""}
          </ul>
          <p>إذا كنتم أنتم من قام بتسجيل الدخول، فلا يلزم اتخاذ أي إجراء إضافي.</p>
          <p>أما إذا لم تتعرفوا على هذا النشاط أو كانت لديكم أي مخاوف تتعلق بأمان الحساب، فننصحكم بتغيير كلمة المرور فوراً والتواصل مع فريق الدعم الفني في أقرب وقت ممكن.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/app" style="background-color: #6d5b3f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">إدارة الحساب</a>
          </div>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            منصة متخصصة لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

/**
 * 20. رسالة تفعيل الحساب برمز التأكيد (مخصصة)
 */
export const sendVerificationCodeEmail = async (
  userEmail: string,
  userName: string,
  code: string,
) => {
  await queueEmail({
    to: userEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: `تفعيل حسابكم على منصة سجل تراث العائلة`,
      text: `أهلاً ${userName}، رمز التفعيل الخاص بكم هو: ${code}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">تفعيل الحساب</h2>
          <p>أهلاً ${userName}،</p>
          <p>مرحباً بكم في منصة سجل تراث العائلة.<br/>لتفعيل حسابكم، يرجى إدخال رمز التفعيل التالي:</p>
          <div style="font-size: 24px; font-weight: bold; background: #eee; padding: 15px; text-align: center; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
            ${code}
          </div>
          <p>إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة ولن يتم اتخاذ أي إجراء.<br/>نوصي بإتمام عملية التحقق لضمان أمان حسابكم واستلام التحديثات والإشعارات المتعلقة بطلباتكم وخدماتكم داخل المنصة.</p>
          <br/><p>مع خالص التقدير،<br/><br/><strong>فريق سجل تراث العائلة</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            <strong>سجل تراث العائلة</strong><br/>
            منصة متخصصة لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      `,
    },
  });
};

export const sendCustomEmail = async (
  toEmail: string,
  subject: string,
  bodyHtml: string,
) => {
  await queueEmail({
    to: toEmail,
    bcc: DEFAULT_BCC,
    from: DEFAULT_FROM,
    message: {
      subject: subject,
      text: subject,
      html: bodyHtml,
    },
  });
};
