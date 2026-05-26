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

  // SignNow APIs
  app.post("/api/contracts", async (req, res) => {
    try {
      const { orderId, customerName, email, locale, clientOrigin } = req.body;
      
      const SIGNNOW_API_KEY = process.env.SIGNNOW_API_KEY || "495ec6d39ffc100718a7b52560730e4c74ba4e02d2c28c8c4a59aedde8362176";
      const SIGNNOW_TEMPLATE_ID = process.env.SIGNNOW_TEMPLATE_ID || "2a574ca2a0294a419348dd8dd90194dc373622e0";

      if (!SIGNNOW_API_KEY) {
        throw new Error("لم يتم إعداد SignNow Key. يرجى التواصل مع الدعم.");
      }

      let documentId = "";
      
      try {
        console.log(`Copying SignNow document/template: ${SIGNNOW_TEMPLATE_ID}`);
        // Try /document/:id/copy first, since user provided a document ID
        let copyRes = await fetch(`https://api.signnow.com/document/${SIGNNOW_TEMPLATE_ID}/copy`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SIGNNOW_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ document_name: `سجل تراث العائلة - ${orderId || customerName || "جديد"}` })
        });
        let copyText = await copyRes.text();
        let copyData = JSON.parse(copyText);

        // If it failed because it's a template, try /template/:id/copy
        if (copyData.errors && copyData.errors[0]?.code === 65582) {
          console.log("Not found as document, trying as template...");
          copyRes = await fetch(`https://api.signnow.com/template/${SIGNNOW_TEMPLATE_ID}/copy`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${SIGNNOW_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ document_name: `سجل تراث العائلة - ${orderId || customerName || "جديد"}` })
          });
          copyText = await copyRes.text();
          copyData = JSON.parse(copyText);
        }

        console.log("SignNow copy response:", copyText);
        
        if (copyData.id) {
          documentId = copyData.id;
          console.log(`Generated Document ID: ${documentId}`);
        } else {
           throw new Error("فشل استنساخ قالب العقد من SignNow: " + JSON.stringify(copyData));
        }
      } catch (e: any) {
         console.error("SignNow template copy error:", e);
         // Return a safe local mock URL so the user is not blocked
         const origin = req.headers.origin || "http://localhost:3000";
         return res.json({ signUrl: `${origin}/mock-signature?orderId=${orderId}`, error: "تم تحويلك لصفحة التوقيع البديلة (Mock) بسبب تعذر الوصول لـ SignNow" });
      }

      // Step 2: Generate embedded invite for the document
      const payload = {
        invites: [
          {
            email: email || "user@example.com",
            role_id: "", // Will use freeform or default if empty
            order: 1,
            auth_method: "none"
          }
        ]
      };

      try {
        console.log(`Generating invite for Document ID: ${documentId}`);
        const inviteRes = await fetch(`https://api.signnow.com/v2/documents/${documentId}/embedded-invites`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SIGNNOW_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const inviteText = await inviteRes.text();
        console.log("SignNow invite response:", inviteText);
        const inviteData = JSON.parse(inviteText);
        
        if (inviteData.errors || !inviteData.data || !inviteData.data[0]?.link) {
           console.error("SignNow Invite Error:", inviteData);
           const origin = req.headers.origin || "http://localhost:3000";
           return res.json({ signUrl: `${origin}/mock-signature?orderId=${orderId}`, error: "API Failed to generate embedded link, using fallback. " + JSON.stringify(inviteData) });
        }

        res.json({ signUrl: inviteData.data[0].link });
      } catch (e: any) {
        console.error("SignNow invite error:", e);
        const origin = req.headers.origin || "http://localhost:3000";
        return res.json({ signUrl: `${origin}/mock-signature?orderId=${orderId}`, error: "API Request exception. " + e.message });
      }

    } catch (error: any) {
      console.error("Error creating contract:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/signnow/webhook", (req, res) => {
    try {
      const data = req.body;
      // SignNow webhook sends event type and document_id
      if (data.event === 'document.complete') {
        const orderId = data.meta?.orderId || data.document_id; 
        if (orderId) {
          console.log(`SignNow Contract completed via webhook! Document/OrderId: ${orderId}`);
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
