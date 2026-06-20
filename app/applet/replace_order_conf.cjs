const fs = require('fs');
let code = fs.readFileSync('src/lib/emailService.ts', 'utf8');

const regex = /export const sendOrderConfirmationEmail = async \([\s\S]*?\}\);\n\};/m;

const newCode = `export const sendOrderConfirmationEmail = async (
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
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
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

code = code.replace(regex, newCode);
fs.writeFileSync('src/lib/emailService.ts', code);
console.log('Done replacement');
