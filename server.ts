import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

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

      // Here you would typically securely initialize the Firebase Admin SDK
      // and update the 'orders' document to paid, 
      // then insert a document to the 'mail' collection to trigger the email.
      // Example:
      /*
      await adminDb.collection("orders").doc(orderId).update({ status: "paid" });
      await adminDb.collection("mail").add({
        to: userEmail,
        message: {
          subject: `تأكيد الدفع - أهلاً ${userName}`,
          html: `<h1>تم الدفع بنجاح</h1><p>تم تأكيد الطلب ${orderId}</p>`
        }
      });
      */
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // API constraints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Stripe Create Checkout Session Integration
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { orderId, userName, userEmail, packagePrice } = req.body;

      if (!process.env.STRIPE_SECRET_KEY) {
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
