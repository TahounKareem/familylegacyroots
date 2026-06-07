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
const knowledgeBase = `الأسئلة الشائعة والمصادر المعتمدة:
- يستغرق البحث لتسليم السجل من 90 إلى 180 يوماً.
- التكلفة الاساسية للإصدار هي 1980 ريال.
- يشمل السجل توثيق الأصل وعمود النسب والإخراج الفني وتوفير منصة تعاونية (لوحة تحكم للمستخدم لمتابعة العمل والتواصل وإدراج الملفات).
- خطوات العمل: ابدأ سجل عائلتك (تسجيل وتحديد النطاق)، حدثنا عن عائلتك (إدخال بيانات)، نقوم بالبحث والتوثيق، استلم السجل.
- يتم إبرام عقد الكتروني داخلي قبل الدفع.`;

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

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const orderId = session.metadata?.orderId;
      const userEmail = session.customer_details?.email || session.metadata?.userEmail;
      const userName = session.customer_details?.name || session.metadata?.userName;

      console.log(`Payment successful for order: ${orderId}. Email triggered for ${userEmail}.`);
      console.log(`[Email Service Mock] Sending the digitally signed contract (Audit Trail & PDF) to: ${userEmail}`);
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
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { messages } = req.body;
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
          systemInstruction: systemInstruction,
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
      const { orderId, userName, userEmail, packagePrice } = req.body;

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
                description: `طلب رقم #${orderId}`,
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
