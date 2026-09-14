import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPvl2nFW5EdKirbKTD-hhEF1QyV0c_JAM",
  authDomain: "the-family-legacy-roots.firebaseapp.com",
  projectId: "the-family-legacy-roots",
  storageBucket: "the-family-legacy-roots.firebasestorage.app",
  messagingSenderId: "823144866980",
  appId: "1:823144866980:web:d87aa109ea79128dad7231"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];
const ARABIC_DAYS = [
  "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
];

function formatArabicDate(dateStr: string): string {
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return `${ARABIC_DAYS[d.getDay()]}، ${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch (e) {}
  return dateStr;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "booked_sessions.json");

interface BookedSessionItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  commPreference?: string;
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // e.g. "10:00 AM"
  createdAt?: string;
  reminderSent?: boolean | string;
  reminderSentAt?: string;
}

function loadBookedSessions(): BookedSessionItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SESSIONS_FILE)) {
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify([]), "utf-8");
      return [];
    }
    const content = fs.readFileSync(SESSIONS_FILE, "utf-8");
    return JSON.parse(content) || [];
  } catch (err) {
    console.error("Error reading booked sessions:", err);
    return [];
  }
}

function saveBookedSessions(sessions: BookedSessionItem[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving booked sessions:", err);
  }
}

function getSessionTimestampMs(dateStr: string, timeStr: string): number {
  if (!dateStr || !timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3].toUpperCase();
  if (meridian === "PM" && hours < 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;
  
  const pad = (n: number) => n.toString().padStart(2, "0");
  // Makkah Time is UTC+3
  const isoStr = `${dateStr}T${pad(hours)}:${pad(minutes)}:00+03:00`;
  const ms = Date.parse(isoStr);
  return isNaN(ms) ? 0 : ms;
}

async function sendOneHourReminderEmail(session: BookedSessionItem): Promise<boolean> {
  try {
    const meetingPlace = session.commPreference === "Google Meet" 
      ? 'عبر جوجل ميت <br/> <a href="https://meet.google.com/ydc-vwcj-nsj">https://meet.google.com/ydc-vwcj-nsj</a>'
      : session.commPreference === "WhatsApp"
      ? 'اتصال هاتفي (عبر واتساب)'
      : 'اتصال هاتفي (عبر تيلغرام)';

    const formattedDate = formatArabicDate(session.selectedDate);

    const emailHtml = `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4A5568;">دقائق ونبدأ أول صفحة من سجل العائلة .</h2>
  <p>بالتأكيد توجد لدى عائلتكم قصة لم تُكتب بعد، أو صورة يعرف الجميع قيمتها، أو اسم يتناقله الأبناء دون أن يعرفوا حكايته، او عمود نسب يحتاج الي توثيق وربطه تاريخياً بالأصل بحسب ماتذكره المصادر الموثوقة .</p>
  <p>لذا .. بعد دقائق سنبدأ معًا بفهم مشروعكم، وكيف يمكن أن يتحول ما تملكونه اليوم إلى سجل يحفظ ذاكرة العائلة للأجيال القادمة.</p>
  <p>إن كان لديكم أي نقاط أو وثائق أو ملاحظات ترون أنها قد تساعد لجعل جلستكم مثمرة، فاحتفظوا بها بالقرب منكم أثناء الجلسة، وإن لم يكن لديكم شيء، فلا تقلقوا... فكل سجل عائلي يبدأ بخطوة...</p>
  
  <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>مكان الإجتماع:</strong><br/>
    ${meetingPlace}</p>
    <p><strong>الوقت :</strong><br/>
    ${session.selectedTime} (التوقيت: GMT+2)<br/>
    يوم: ${formattedDate}</p>
    <p><strong>الوقت المحدد للجلسة :</strong> 30 دقيقة</p>
    <p style="color: #e53e3e; font-size: 14px; font-weight: bold;">فضلا تأكد من التوقيت الخاص ببلدك</p>
  </div>

  <p>نتطلع للقائكم بعد قليل.<br/>
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
      to: session.email,
      bcc: "info@thefamilylegacyroots.com",
      message: {
        subject: "دقائق ونبدأ أول صفحة من سجل العائلة .",
        html: emailHtml,
      },
      createdAt: serverTimestamp(),
    });

    console.log(`[AutoReminder] Successfully dispatched reminder to ${session.email} for session on ${session.selectedDate} at ${session.selectedTime}`);
    return true;
  } catch (err) {
    console.error(`[AutoReminder] Failed sending reminder to ${session.email}:`, err);
    return false;
  }
}

async function checkAndSendPendingReminders(): Promise<number> {
  const sessions = loadBookedSessions();
  let updatedCount = 0;
  const now = Date.now();

  for (const session of sessions) {
    if (session.reminderSent === true || session.reminderSent === "expired") {
      continue;
    }

    const sessionMs = getSessionTimestampMs(session.selectedDate, session.selectedTime);
    if (!sessionMs) continue;

    const oneHourBeforeMs = sessionMs - 60 * 60 * 1000;

    // If session is within the next 60 minutes (or right now)
    if (now >= oneHourBeforeMs && now < sessionMs) {
      console.log(`[AutoReminder] Triggering reminder for session: ${session.name} (${session.email}) scheduled at ${session.selectedDate} ${session.selectedTime}`);
      const success = await sendOneHourReminderEmail(session);
      if (success) {
        session.reminderSent = true;
        session.reminderSentAt = new Date().toISOString();
        updatedCount++;
      }
    } else if (now >= sessionMs) {
      // Past session
      session.reminderSent = "expired";
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    saveBookedSessions(sessions);
  }
  return updatedCount;
}

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
  const PORT = 3000;

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

  // ==========================================
  // Intro Sessions & Reminder System Endpoints
  // ==========================================

  // Get all booked dates and times (no personal data returned)
  app.get("/api/intro-sessions/booked", (req, res) => {
    try {
      const sessions = loadBookedSessions();
      const booked = sessions.map(s => ({
        date: s.selectedDate,
        time: s.selectedTime
      }));
      res.json({ booked });
    } catch (err: any) {
      console.error("Error fetching booked sessions:", err);
      res.status(500).json({ error: "Failed to fetch booked sessions", booked: [] });
    }
  });

  // Record a new booking and check if reminder is due
  app.post("/api/intro-sessions/book", async (req, res) => {
    try {
      const { name, email, phone, commPreference, selectedDate, selectedTime } = req.body;
      if (!email || !selectedDate || !selectedTime) {
        return res.status(400).json({ error: "Missing required booking details" });
      }

      const sessions = loadBookedSessions();
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const newSession: BookedSessionItem = {
        id,
        name: name || "ضيفنا الكريم",
        email,
        phone: phone || "",
        commPreference: commPreference || "Google Meet",
        selectedDate,
        selectedTime,
        createdAt: new Date().toISOString(),
        reminderSent: false,
      };

      sessions.push(newSession);
      saveBookedSessions(sessions);

      // Check if this booking needs an immediate reminder (if booked within <= 60 minutes)
      checkAndSendPendingReminders().catch(console.error);

      res.json({ success: true, id });
    } catch (err: any) {
      console.error("Error saving booking:", err);
      res.status(500).json({ error: err.message || "Failed to save booking" });
    }
  });

  // Sync sessions from Admin or Firestore
  app.post("/api/intro-sessions/sync", async (req, res) => {
    try {
      const { sessions } = req.body;
      if (!Array.isArray(sessions)) {
        return res.status(400).json({ error: "Invalid sessions array" });
      }

      const current = loadBookedSessions();
      let added = 0;

      for (const item of sessions) {
        if (!item.selectedDate || !item.selectedTime) continue;
        
        // Find existing by email + date + time or id
        const exists = current.find(c => 
          (c.id && item.id && c.id === item.id) ||
          (c.selectedDate === item.selectedDate && c.selectedTime === item.selectedTime && c.email === item.email)
        );

        if (!exists) {
          current.push({
            id: item.id || `sync_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            name: item.name || "ضيفنا الكريم",
            email: item.email,
            phone: item.phone || "",
            commPreference: item.commPreference || "Google Meet",
            selectedDate: item.selectedDate,
            selectedTime: item.selectedTime,
            createdAt: item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
            reminderSent: item.reminderSent || false,
            reminderSentAt: item.reminderSentAt || undefined,
          });
          added++;
        }
      }

      if (added > 0) {
        saveBookedSessions(current);
        checkAndSendPendingReminders().catch(console.error);
      }

      res.json({ success: true, count: current.length, added });
    } catch (err: any) {
      console.error("Error syncing sessions:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Manual or admin trigger for 1-hour reminder
  app.post("/api/intro-sessions/trigger-reminder", async (req, res) => {
    try {
      const { email, id } = req.body;
      const sessions = loadBookedSessions();
      const session = sessions.find(s => (id && s.id === id) || (email && s.email === email));

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const success = await sendOneHourReminderEmail(session);
      if (success) {
        session.reminderSent = true;
        session.reminderSentAt = new Date().toISOString();
        saveBookedSessions(sessions);
        return res.json({ success: true, message: "Reminder email sent successfully" });
      } else {
        return res.status(500).json({ error: "Failed to send reminder email" });
      }
    } catch (err: any) {
      console.error("Error triggering reminder:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Check pending reminders immediately endpoint
  app.post("/api/intro-sessions/check-reminders", async (req, res) => {
    try {
      const count = await checkAndSendPendingReminders();
      res.json({ success: true, triggeredCount: count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  let vite;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Intercept /knowledge to inject Dynamic Open Graph tags for social media sharing
  app.get("/knowledge", async (req, res, next) => {
    const articleId = req.query.article;
    if (!articleId) {
      return next();
    }
    
    try {
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/the-family-legacy-roots/databases/(default)/documents/knowledge_articles/${articleId}`);
      if (!response.ok) {
         return next();
      }
      
      const data = await response.json();
      const fields = data.fields;
      if (!fields) return next();

      const title = fields.title?.stringValue || "سجل تراث العائلة";
      let description = fields.description?.stringValue || "منصة متخصصة في توثيق وحفظ سجلات تراث العائلة والأنساب بأعلى معايير الدقة والاحترافية.";
      description = description.replace(/<[^>]*>?/gm, '');

      const imageUrl = fields.coverImageUrl?.stringValue || "https://i.postimg.cc/d3PQr4fd/Banner.png";
      const url = `https://thefamilylegacyroots.com/knowledge?article=${articleId}`;

      let html = "";
      if (process.env.NODE_ENV !== "production") {
          const fsPromises = await import("fs/promises");
          html = await fsPromises.readFile(path.join(process.cwd(), "index.html"), "utf-8");
          html = await vite.transformIndexHtml(req.originalUrl, html);
      } else {
          const fsPromises = await import("fs/promises");
          html = await fsPromises.readFile(path.join(process.cwd(), "dist", "index.html"), "utf-8");
      }

      // Remove existing og/twitter tags
      html = html.replace(/<meta property="og:[^>]*>/g, "");
      html = html.replace(/<meta (property|name)="twitter:[^>]*>/g, "");
      html = html.replace(/<title>.*<\/title>/g, `<title>${title}<\/title>`);

      const ogTags = `
        <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
        <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${url}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
        <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
        <meta name="twitter:image" content="${imageUrl}" />
      `;

      html = html.replace("</head>", `${ogTags}</head>`);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      console.error("Error generating OG tags:", error);
      next();
    }
  });

  if (process.env.NODE_ENV !== "production") {
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
    // Initial check for pending 1-hour session reminders
    checkAndSendPendingReminders().catch(err => {
      console.error("Initial reminder check error:", err);
    });
    // Recurring check every 60 seconds
    setInterval(() => {
      checkAndSendPendingReminders().catch(err => {
        console.error("Scheduled reminder check error:", err);
      });
    }, 60 * 1000);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
