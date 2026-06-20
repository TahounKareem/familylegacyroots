import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY is not set in environment variables");
}
const stripe = new Stripe(stripeKey || "");

const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({ apiKey: geminiApiKey });
}

// Simulated Knowledge Base from the FAQ
const knowledgeBase = `الأسئلة الشائعة والمصادر المعتمدة لمنصة "سجل تراث العائلة" (جينيا لاب):

1. منهجية العمل والمصادر:
- نعتمد في توثيقنا وإصدار السجلات على مصادر موثوقة ومثبتة تشمل: الوثائق التاريخية، المحفوظات، المخطوطات الأصلية، كتب الأنساب، السجلات الرسمية، بالإضافة إلى الإثباتات الجينية (DNA) إذا لزم الأمر أو توفرت. 
- الفريق البحثي مكون من خبراء ومتخصصين في علم الأنساب والتاريخ لضمان دقة وصحة المعلومات الموثقة.

2. مدة العمل والتسليم:
- يستغرق البحث لتسليم السجل من 90 إلى 180 يوماً كحد أقصى نظراً لدقة عملية التدقيق والتوثيق والبحث.

3. التكلفة وأنظمة الدفع:
- التكلفة الأساسية للإصدار تختلف حسب نظام الدفع المختارة (تُدفع بالدولار الأمريكي USD) وتشمل جميع الرسوم:
  أ) السداد المبكر بالكامل: الدفع دفعة واحدة بقيمة 1780 دولار.
  ب) الدفع المرن: إجمالي 1980 دولار (مقسمة على 3 دفعات ميسرة، الدفعة الأولى قيمتها 693 دولار).
- يتم الدفع عبر بوابات دفع إلكترونية آمنة جداً.

4. ماذا يشمل السجل، وما هي المزايا للمستخدم؟
- يشمل السجل: البحث والتدقيق، توثيق الأصل، بناء عمود النسب، الإدراج العائلي المبسط كشجرة، والإخراج الفني الاحترافي.
- يحصل العميل (أمين السجل) على لوحة تحكم تفاعلية ذكية تمكنه من:
  * متابعة تطور الطلب في كل مرحلة (مسودة، تصميم، طباعة).
  * خزانة مرفقات آمنة لرفع الوثائق، الصور، المخطوطات، وصور شواهد القبور، والفيديوهات الداعمة.
  * نظام إشعارات لحظي وبريد إلكتروني للحالات وتحديثات الطلب.
  * التواصل المباشر وإرسال طلبات تصويب وتعديل على المسودة إلكترونياً.
- يتسلم العميل في النهاية نسخة رقمية فاخرة للسجل قابلة للطباعة وبوستر للمشجرة.

5. الضمانات القانونية والخصوصية:
- يتم إبرام عقد خدمة إلكتروني ملزم بين المنصة والعميل قبل إتمام أي عملية دفع، وهو بمثابة ضمان لحقوق الطرفين.
- تخضع كافة المعلومات والمستندات والوثائق الخاصة بالعميل لسرية تامة وسياسة خصوصية وأمان صارمة، ولا تُشارك أبدًا مع أطراف خارجية لا علاقة لها بأعمال البحث. يحق للعميل طلب حذف بياناته ومرفقاته.

6. كيفية بدء العمل:
- تبدأ الرحلة بإنشاء الحساب، ثم تعبئة بيانات الطلب الأولية (تحديد النطاق واسم العائلة)، الموافقة على شروط الخدمة وتوقيع العقد إلكترونياً، ثم سداد الدفعة الأولى (أو المبلغ كاملاً)، ليتم البدء مباشرة في العمل وفتح لوحة المتابعة للعميل.

7. الدعم وخدمة العملاء:
- في حال وجود استفسارات معقدة، يمكن للزائر والمستخدم التوجه إلى صفحة (مركز التواصل والدعم) لفتح تذكرة استفسار وإرسال رسالة مباشرة لفريق الدعم، وسيتم الرد عليه بشكل مفصل من الفريق المختص عبر البريد خلال أوقات العمل.`;

const systemInstruction = `أنت "المرشد الذكي"، مساعد إرشادي تشغيلي مقيد ومخصص حصريًا لمنصة "سجل تراث العائلة" (جينيا لاب).

أنت لست مساعدًا عامًا، ولا خبير أنساب، ولا مستشارًا قانونيًا، ولا باحثًا تاريخيًا، ولا محللاً اجتماعيًا أو قبليًا. دورك محدود جدًا ومحدد بدقة.

### 1. المبدأ التقني الأساسي (الأهم)
- لا تعتمد على معرفتك العامة أبدًا ولا تبحث في فضاء الإنترنت الخارجي.
- يجب أن تبحث وتسترجع المعلومة فقط من قاعدة المعرفة المعتمدة وتدور في فلك الموقع.
- إذا لم تجد المعلومة داخل المصادر المعتمدة -> لا تجيب ولا تخمن.

### 2. قاعدة المعرفة المغلقة (Closed Knowledge Base)
1. محتوى المنصة الرسمي (من نحن، طريقة سير العمل)
2. العقود والسياسات المعتمدة رسميًا
3. الأسئلة الشائعة (FAQ) والدليل الإرشادي

### 3. الصياغة وتوجيه المستخدم
- يجب أن تكون ردودك هادئة، محايدة، مؤسساتية، ومهذبة جداً.
- **في حالة فشل الإجابة أكثر من مرتين (أو إذا كان المستخدم يطرح أسئلة متشعبة غير متوفرة)**:
  لا تستخدم كلمة "فتح تذكرة". بدلاً من ذلك، ادعوه بلطف للتواصل مع فريق الدعم المختص هكذا:
  "يبدو أن استفسارك يحتاج إلى تفصيل دقيق من قبل زملائي في فريق البحث. يسعدنا استقبال رسالتك عبر مركز التواصل والدعم ليتم الرد عليك بشكل شافٍ ووافٍ."
- ممنوع توفير رابط الدعم الفني بشكل سريع ومباشر من أول سؤال أو سؤالين. استنفذ المحاولات للإجابة من السياق أولاً.

### 4. السياق المتوفر من الموقع:
${knowledgeBase}
`;

async function startServer() {
  const app = express();
  app.post("/api/log_error", express.json(), (req, res) => {
    import("fs").then(fs => {
      fs.writeFileSync("client_error.txt", JSON.stringify(req.body, null, 2));
    });
    res.sendStatus(200);
  });
  const PORT = Number(process.env.PORT) || 3000;

  // Stripe Webhook MUST be placed before express.json() to get the raw body
  app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set.");
      return res.status(400).send("Webhook Secret Missing");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle Stripe Events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const orderId = session.metadata?.orderId;
        const userEmail = session.customer_details?.email || session.metadata?.userEmail;
        const userName = session.customer_details?.name || session.metadata?.userName;
        const invoiceNumber = session.metadata?.invoiceNumber;

        console.log(`[Stripe Webhook] Payment successful [PAID] for order: ${orderId} (Invoice: ${invoiceNumber}).`);
        console.log(`[Email Service Placeholder] Sending Receipt & Contract to: ${userEmail}`);
        // TODO: (Production) Use firebase-admin to update Firestore order status to 'PAID'
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment failed [FAILED] for intent: ${paymentIntent.id}`);
        // TODO: (Production) Update order status to 'FAILED'
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`[Stripe Webhook] Charge refunded [REFUNDED] for charge: ${charge.id}`);
        // TODO: (Production) Update order status to 'REFUNDED'
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe Webhook] Checkout expired [CANCELLED] for order: ${session.metadata?.orderId}`);
        // TODO: (Production) Update order status to 'CANCELLED'
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // API constraints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Chat integration
  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.json({ reply: "عذراً، المرشد الذكي في وضع التحديث حالياً أو أنه غير مربوط بالمحركات. يمكنك دائماً الرجوع إلى صفحة الأسئلة الشائعة والدليل الإرشادي." });
      }

      const { messages, dynamicContext } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      // Convert messages to Gemini format
      const history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      const lastMessage = messages[messages.length - 1];

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: history,
        config: {
          systemInstruction: dynamicContext ? systemInstruction + "\n\n### معلومات إضافية من الإدارة لتوفير إجابات دقيقة (Dynamic FAQs):\n" + dynamicContext : systemInstruction,
          temperature: 0.1, // Strict temperature as requested
        }
      });

      const response = await chat.sendMessage({
        message: lastMessage.text
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong" });
    }
  });

  // Stripe Create Checkout Session Integration
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { orderId, userName, userEmail, packagePrice, invoiceNumber } = req.body;

      if (!stripeKey) {
        throw new Error("Stripe secret key configuration is missing on the server. Please add STRIPE_SECRET_KEY to your .env file.");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "توثيق سجل تراث العائلة",
                description: `طلب رقم #${orderId} - فاتورة ${invoiceNumber || ''}`,
              },
              unit_amount: packagePrice * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          orderId: orderId,
          userName: userName,
          userEmail: userEmail,
          invoiceNumber: invoiceNumber || ''
        },
        success_url: `${req.protocol}://${req.get("host")}/dashboard?success=true&order_id=${orderId}`,
        cancel_url: `${req.protocol}://${req.get("host")}/order?cancel=true`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
