const fs = require('fs');
let code = fs.readFileSync('src/lib/emailService.ts', 'utf8');

const regexOrderConf = /export const sendOrderConfirmationEmail = async \([\s\S]*?\}\);\n\};/m;

const orderConf = `export const sendOrderConfirmationEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  isInvite: boolean = false,
) => {
  const subject = \`بدأت رحلة توثيق سجل تراث عائلتكم\`;
  const htmlContent = \`
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً \${userName}،</h2>
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
          <br/>
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      \`;

  await queueEmail({
    to: userEmail,
    from: "info@thefamilylegacyroots.com",
    message: {
      subject,
      text: \`بدأت رحلة توثيق سجل تراث عائلتكم\`,
      html: htmlContent,
    },
  });
};`;

code = code.replace(regexOrderConf, orderConf);

// Add these to the end of the file if they don't exist
const customMails = `
/**
 * إشعار الانتقال إلى مرحلة التوثيق
 */
export const sendDocumentationPhaseEmail = async (
  userEmail: string,
  userName: string,
) => {
  const subject = \`اكتملت مرحلة البحث وبدأت مرحلة التوثيق\`;
  const htmlContent = \`
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً \${userName}،</h2>
          <p>يسرنا إبلاغكم بأن فريق البحث قد أكمل المرحلة البحثية الخاصة بسجل تراث عائلتكم، وانتقل المشروع الآن إلى مرحلة التوثيق.</p>
          <p>خلال هذه المرحلة يعمل فريقنا على مراجعة وتنظيم وتحليل النتائج المتوصل إليها، وربط المعلومات بالمصادر ذات الصلة، وإعداد المحتوى الذي سيشكل الأساس العلمي والتوثيقي للسجل.</p>
          <p>كما نود التذكير بأنه لا يزال بإمكانكم إثراء السجل العائلي من خلال إضافة الصور أو الوثائق أو الذكريات أو المعلومات التي ترون أنها تستحق أن تكون جزءاً من هذا العمل.</p>
          <p>يمكنكم متابعة حالة المشروع وتطوراته من خلال لوحة التحكم الخاصة بكم في أي وقت.</p>
          <p>لقد أصبحت صورة تاريخ عائلتكم أكثر وضوحاً، ونحن نواصل العمل على تحويل ما تم جمعه من روايات ووثائق ومعلومات إلى سجل متكامل يحفظ إرث العائلة للأجيال القادمة.</p>
          <div style="margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/dashboard" style="background-color: #6d5b3f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">عرض حالة السجل الأساسي</a>
          </div>
          <p>مع خالص التقدير،</p>
          <p><strong>فريق سجل تراث العائلة</strong></p>
          <br/>
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      \`;

  await queueEmail({
    to: userEmail,
    from: "info@thefamilylegacyroots.com",
    message: {
      subject,
      text: subject,
      html: htmlContent,
    },
  });
};

/**
 * إشعار الانتقال إلى مرحلة الإخراج الفني
 */
export const sendDesignPhaseEmail = async (
  userEmail: string,
  userName: string,
) => {
  const subject = \`انتقل سجل تراث عائلتكم إلى مرحلة الإخراج الفني\`;
  const htmlContent = \`
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً \${userName}،</h2>
          <p>يسرنا إبلاغكم بأن مشروع سجل تراث عائلتكم قد انتقل إلى مرحلة الإخراج الفني.</p>
          <p>بعد اكتمال مراحل البحث والتوثيق، يعمل فريقنا الآن على إعداد السجل في صورته النهائية، من خلال تنظيم المحتوى وإخراجه بأسلوب أنيق ومتناسق يليق بتاريخ عائلتكم وإرثها.</p>
          <p>خلال هذه المرحلة يتم العمل على تنسيق النصوص، وإعداد الصفحات، وتنظيم الصور والوثائق والمحتويات المعتمدة، تمهيداً لإصدار النسخة الأولية من السجل ومشاركتها معكم للمراجعة.</p>
          <p>يمكنكم متابعة حالة السجل الأساسي (المشروع) من خلال لوحة التحكم الخاصة بكم في أي وقت.</p>
          <p>لقد بدأت الآن ملامح سجل تراث عائلتكم بالظهور، ونحن نواصل العمل على تحويل ما جُمع من روايات ووثائق وذكريات إلى سجل متكامل يحفظ تاريخ العائلة للأبناء والأحفاد والأجيال القادمة.</p>
          <div style="margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/dashboard" style="background-color: #6d5b3f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">عرض حالة السجل الأساسي</a>
          </div>
          <p>مع خالص التقدير،</p>
          <p><strong>فريق سجل تراث العائلة</strong></p>
          <br/>
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      \`;

  await queueEmail({
    to: userEmail,
    from: "info@thefamilylegacyroots.com",
    message: {
      subject,
      text: subject,
      html: htmlContent,
    },
  });
};

/**
 * إشعار جاهزية النسخة الأولية
 */
export const sendInitialDesignReadyEmail = async (
  userEmail: string,
  userName: string,
) => {
  const subject = \`النسخة الأولية من سجل تراث عائلتكم أصبحت جاهزة\`;
  const htmlContent = \`
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً \${userName}،</h2>
          <p>يسرنا أن نشارككم أولى ثمار هذه الرحلة.</p>
          <p>لقد انتهى فريقنا من إعداد النسخة الأولية لسجل تراث عائلتكم، والتي تجمع ما تم التوصل إليه خلال مراحل البحث والتوثيق والإعداد الأولي.</p>
          <p>ندعوكم الآن إلى استعراض السجل بعناية، وإضافة ما ترونه من ملاحظات أو تصويبات خلال الفترة المخصصة للمراجعة، لنتمكن من إكمال العمل بالصورة التي تليق بتاريخ عائلتكم وإرثها.</p>
          <div style="margin: 30px 0;">
            <a href="https://thefamilylegacyroots.com/dashboard" style="background-color: #6d5b3f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">عرض النسخة الأولية</a>
          </div>
          <p>مع خالص التقدير،</p>
          <p><strong>فريق سجل تراث العائلة</strong></p>
          <br/>
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      \`;

  await queueEmail({
    to: userEmail,
    from: "info@thefamilylegacyroots.com",
    message: {
      subject,
      text: subject,
      html: htmlContent,
    },
  });
};

/**
 * إشعار اكتمال مراجعة التصويبات
 */
export const sendCorrectionsCompletedEmail = async (
  userEmail: string,
  userName: string,
) => {
  const subject = \`اكتملت مراجعة التصويبات وإعداد النسخة النهائية\`;
  const htmlContent = \`
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً \${userName}،</h2>
          <p>يسرنا إبلاغكم بأن فريقنا قد انتهى من مراجعة الملاحظات والتصويبات الواردة من قبلكم، وتم استكمال ما يلزم منها وفق المنهجية المعتمدة في إعداد السجل.</p>
          <p>وبذلك أصبح سجل تراث عائلتكم في صورته النهائية بعد استكمال مراحل البحث والتوثيق والإخراج الفني والمراجعة.</p>
          <p>نشكر لكم مساهمتكم في إثراء هذا العمل، وما قدمتموه من ملاحظات ومعلومات أسهمت في تعزيز محتوى السجل وإظهاره بأفضل صورة ممكنة.</p>
          <p>يجري حالياً استكمال الإجراءات النهائية الخاصة بالتسليم والإغلاق، وسنوافيكم قريباً بإشعار اكتمال رحلة التوثيق وتسليم النسخة النهائية من السجل.</p>
          <p>يمكنكم متابعة حالة المشروع (السجل الأساسي) من خلال لوحة التحكم الخاصة بكم في أي وقت.</p>
          <p>مع خالص التقدير،</p>
          <p><strong>فريق سجل تراث العائلة</strong></p>
          <br/>
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      \`;

  await queueEmail({
    to: userEmail,
    from: "info@thefamilylegacyroots.com",
    message: {
      subject,
      text: subject,
      html: htmlContent,
    },
  });
};

/**
 * إشعار اكتمال رحلة توثيق
 */
export const sendFinalDeliveryEmail = async (
  userEmail: string,
  userName: string,
) => {
  const subject = \`اكتملت رحلة توثيق سجل تراث عائلتكم\`;
  const htmlContent = \`
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6d5b3f;">أهلاً \${userName}،</h2>
          <p>اكتملت رحلة التوثيق.</p>
          <p>ويسعدنا اليوم أن نضع بين أيديكم النسخة النهائية من سجل تراث عائلتكم.</p>
          <p>لقد جمع هذا السجل بين ما توفر من روايات ووثائق ومواد تاريخية ومعلومات عائلية ضمن عمل واحد أُعد ليكون مرجعاً يحفظ ذاكرة العائلة للأبناء والأحفاد والأجيال القادمة.</p>
          <p>يمكنكم الآن استعراض النسخة الرقمية النهائية من خلال لوحة التحكم.</p>
          <p>كما بدأ فريقنا إجراءات إعداد النسخ الورقية للطباعة والتجليد تمهيداً لشحنها إليكم، وسنزودكم بمعلومات الشحن فور جاهزيتها.</p>
          <p>شكراً لثقتكم بنا ومشاركتنا هذه الرحلة.</p>
          <p>لأن بعض الأشياء لا تُشترى... بل تُورث.</p>
          <p><strong>فريق سجل تراث العائلة</strong></p>
          <br/>
          <p style="font-size: 12px; color: #888;">
            <strong>سجل تراث العائلة</strong><br/>
            مشروع بحثي متخصص لحفظ وتوثيق تراث العائلات للأجيال القادمة.
          </p>
        </div>
      \`;

  await queueEmail({
    to: userEmail,
    from: "info@thefamilylegacyroots.com",
    message: {
      subject,
      text: subject,
      html: htmlContent,
    },
  });
};

`;

code = code + customMails;
fs.writeFileSync('src/lib/emailService.ts', code);
console.log('Customer emails updated!');
