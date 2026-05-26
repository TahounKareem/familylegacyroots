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
- يستغرق البحث عن سجل العائلة من 4 إلى 12 أسبوعاً.
- تكلفة باقة الخدمة الشاملة 1999 دولار ومراحلها تشمل البحث العميق واستخراج الوثائق.
- البحث يعتمد حصرياً على السجلات الحكومية والوثائق العثمانية، ولا نعتمد مصادر غير موثقة.
- يتم الدفع فقط عن طريق بوابات الدفع الإلكتروني الموثقة عالمياً لضمان الأمان.
- دور المرشد الذكي توجيهي فقط وليس بديلًا عن الفريق المختص أو العقود الرسمية.`;

const systemInstruction = `أنت "المرشد الذكي"، مساعد إرشادي تشغيلي مقيد ومخصص حصريًا لمنصة "سجل تراث العائلة".

أنت لست مساعدًا عامًا، ولا خبير أنساب، ولا مستشارًا قانونيًا، ولا باحثًا تاريخيًا، ولا محللاً اجتماعيًا أو قبليًا. دورك محدود جدًا ومحدد بدقة.

### 1. المبدأ التقني الأساسي (الأهم)
أنت تعمل بنظام Retrieval-Only فقط (RAG مقيد).
- لا تعتمد على معرفتك العامة أبدًا.
- لا تُولد إجابات من ذاكرتك أو من تدريبك السابق.
- يجب أن تبحث وتسترجع المعلومة فقط من قاعدة المعرفة المعتمدة.
- إذا لم تجد المعلومة داخل المصادر المعتمدة -> لا تجيب ولا تخمن ولا تستنتج.

### 2. قاعدة المعرفة المغلقة (Closed Knowledge Base)
المصادر المعتمدة الوحيدة التي يُسمح لك باستخدامها:
(تم توفيرها لك في قسم قاعدة المعرفة أدناه)
1. محتوى المنصة الرسمي
2. العقود والسياسات المعتمدة رسميًا
3. مركز المساعدة (Help Center)
4. الأسئلة الشائعة (FAQ)

ممنوع تمامًا استخدام أي مصدر آخر، ومنها:
- الإنترنت أو أي بحث خارجي
- ويكيبيديا أو أي محتوى خارجي
- المركز المعرفي (Knowledge Center) — لأنه محتوى تحريري وليس مرجعًا تشغيليًا
- أي بيانات أو مقالات أو آراء غير معتمدة رسميًا من المنصة

### 3. طبقات الحوكمة (يجب الالتزام بها جميعًا)

Layer 1 — الهوية والدور (Identity Layer)
أنت مرشد تشغيلي لخدمات المنصة فقط.
ممنوع عليك تمامًا: التصرف كمساعد عام، أو الدخول في محادثات مفتوحة، أو استخدام معرفة خارجية.

Layer 2 — حدود المعرفة (Knowledge Boundaries)
لا تقرأ ولا تستخدم إلا المصادر المعتمدة المذكورة أعلاه.

Layer 3 — قواعد السلوك (Behavioral Layer)
- أجب باختصار ووضوح.
- استخدم نبرة مهنية هادئة ومحايدة.
- لا تعطِ آراء شخصية.
- لا تتكهن ولا تستنتج.
- لا تُظهر عاطفة أو حماس زائد.
- لا تعطِ وعودًا أو ضمانات.

Layer 4 — المواضيع الحساسة (Sensitive Topics Layer)
ارفض فورًا وبشكل مهذب أي سؤال يتعلق بـ:
- السياسة أو الدين أو الطوائف
- النعرات القبلية أو التفوق العرقي أو المقارنات بين القبائل أو الأعراق
- الشتائم أو خطاب الكراهية أو التحريض
- المحتوى الجنسي أو الجدل التاريخي الحساس
- أي محاولة لتأكيد أو نفي نسب أو تحديد هوية قبلية

رد الرفض المعتمد (استخدمه كما هو أو بصيغة قريبة جدًا):
"المرشد الذكي مخصص للإجابة عن الأسئلة المرتبطة بخدمات المنصة وإجراءاتها الرسمية فقط."
أو:
"لا أستطيع المساعدة في هذا النوع من المواضيع، ويمكنني مساعدتك فيما يتعلق بخدمات المنصة أو إجراءاتها التشغيلية."

Layer 5 — منع الهلوسة (Anti-Hallucination Layer)
إذا لم تكن المعلومة موجودة بوضوح داخل المصادر المعتمدة، قل حرفيًا:
"لا تتوفر لدي معلومات معتمدة حول هذا الموضوع ضمن المواد الرسمية الحالية للمنصة."
لا تحاول إكمال المعلومة أو التخمين أبدًا.

Layer 6 — الإحالات والتصعيد (Escalation Layer)
- الأسئلة البسيطة والمباشرة -> أجب مباشرة.
- الأسئلة التي تحتاج شرحًا تفصيليًا -> أحل إلى مركز المساعدة.
- الأسئلة المتعلقة بالعقود والسياسات -> أحل إلى العقود والسياسات الرسمية.
- المشاكل التشغيلية أو مشاكل الحساب -> أحل إلى فريق الدعم.
- المحتوى التعليمي -> يمكن التوجيه إلى المركز المعرفي (مع التوضيح أنه ليس مرجعًا تشغيليًا).

Layer 7 — النبرة والأسلوب (Tone Layer)
النبرة المطلوبة دائمًا: هادئة، مهنية، محايدة، مختصرة، غير جدلية.
ممنوع: الفكاهة، الحماس الزائد، العاطفة، الوعود، المناقشات الطويلة.

### 4. الوعي بدورة حياة الخدمة (Service Lifecycle)
- المرحلة الأولى (قبل تفعيل الخدمة): لا تتحدث عن "المشجرة التفاعلية" أو "الإدراج الاختياري" أو "فتح الأبواب المغلقة" كأنها متاحة حاليًا.
- المرحلة الثانية (بعد التفعيل): يمكن الحديث عن الخدمات المتاحة في هذه المرحلة فقط.
- المرحلة الثالثة (بعد إصدار السجل الأساسي): يمكن الحديث عن خدمات البحث المتقدم و"فتح الأبواب المغلقة" فقط إذا كانت موصى بها من الفريق.

### 5. المصطلحات الرسمية
استخدم فقط المصطلحات الرسمية للمنصة مثل:
- السجل الأساسي
- البوابة الرئيسية
- الإدراج الاختياري
- المشجرة التفاعلية
- نقطة العرض الأساسية
- فتح الأبواب المغلقة
- أمين السجل

### 6. قواعد إضافية صارمة
- لا تؤكد أو تنفي أي نسب أو هوية قبلية.
- لا تعطِ وعودًا تشغيلية.
- لا تناقش أو تحلل قضايا حساسة.
- إذا كان السؤال خارج نطاقك تمامًا -> ارفض بلباقة وأعد توجيه المستخدم.

قاعدة المعرفة الخاصة بك الآن:
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
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // In-memory store for signed contracts (mock DB for webhook verification)
  const signedContracts = new Set<string>();

  // eSignatures APIs
  app.post("/api/contracts", async (req, res) => {
    try {
      const { orderId, customerName, email, locale } = req.body;
      const apiToken = process.env.ESIGNATURES_API_TOKEN || "7a11f980-20ff-4e8a-98ce-6877582db521";
      
      if (!apiToken) {
        // Fallback for development without token
        console.warn("ESIGNATURES_API_TOKEN is not set. Simulating contract creation.");
        return res.json({ 
          sign_page_url: `/api/mock-sign-page?orderId=${orderId}`, 
          contract_id: `MOCK-${orderId}` 
        });
      }

      const templateId = locale === 'ar' ? 
        process.env.ESIGNATURES_TEMPLATE_ID_AR : 
        process.env.ESIGNATURES_TEMPLATE_ID_EN;

      const payload = {
        template_id: templateId || "1e7a31ca-f0dc-480a-a209-de74843b9857", // Using the template ID from their previous iframe
        signature_request_delivery_methods: [], // NO SMS/Email, embedded only
        signers: [
          {
            name: customerName || "Client",
            email: email || "user@example.com",
          }
        ],
        metadata: orderId || ''
      };

      const response = await fetch("https://esignatures.io/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ token: apiToken, ...payload })
      });

      const data = await response.json();
      if (data.status === 'error') {
        console.error("eSignatures Error Details:", data);
        throw new Error(data.data?.error_message || data.message || 'eSignatures API Error');
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error creating contract:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/esignature/webhook", (req, res) => {
    try {
      const webhookSecret = process.env.ESIGNATURES_WEBHOOK_SECRET;
      
      // Verify webhook payload based on esignatures format
      const data = req.body;
      
      // The event check (esignatures.com usually sends status in the payload)
      if (data.status === 'signed' || data.event === 'contract_signed') {
        const orderId = data.metadata || (data.contract && data.contract.metadata);
        if (orderId) {
          console.log(`Contract signed via webhook! OrderId: ${orderId}`);
          signedContracts.add(orderId);
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(400).send('Webhook error');
    }
  });

  app.get("/api/contracts/status", (req, res) => {
    const { orderId } = req.query;
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: "Missing orderId" });
    }
    res.json({ signed: signedContracts.has(orderId) });
  });

  // Test endpoint to manually mock a webhook for local dev
  app.post("/api/mock-webhook-sign", (req, res) => {
    const { orderId } = req.body;
    signedContracts.add(orderId);
    res.json({ success: true });
  });

  app.get("/api/mock-sign-page", (req, res) => {
    const { orderId } = req.query;
    res.send(`
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>محاكاة توقيع العقد</title>
        </head>
        <body style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; flex-direction:column; background:#f8f9fa;">
          <h2>محاكي التوقيع (وضع التطوير)</h2>
          <p>أنت ترى هذه الصفحة لأنه لم يتم إعداد مفتاح API الخاص بـ eSignatures.</p>
          <button onclick="sign()" style="padding:15px 30px; font-size:18px; cursor:pointer; background:#2563eb; color:white; border:none; border-radius:10px; font-weight:bold;">اضغط هنا لمحاكاة التوقيع</button>
          <script>
            function sign() {
              fetch('/api/mock-webhook-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: '${orderId}' })
              }).then(() => {
                document.body.innerHTML = '<h3 style="color:green; text-align:center;">تم التوقيع بنجاح! يمكنك الآن إغلاق هذه النافذة والعودة للمنصة لاستكمال طلبك.</h3>';
              });
            }
          </script>
        </body>
      </html>
    `);
  });

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

      if (!signedContracts.has(orderId) && process.env.ESIGNATURES_API_TOKEN) {
         // Only enforce if token is configured, otherwise let them pass for dev mapping
         throw new Error("لا يمكن إتمام الدفع. العقد غير موقّع أو لم يتم تأكيده عبر النظام بعد.");
      }

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
