const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const prisma = require("./prisma");

dotenv.config({ quiet: true });

const app = express();
app.use(cors());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// In-memory store for demo (use DB in production)
const paymentStore = new Map();

// Webhook (must be before express.json)
app.post(
    "/razorpay-webhook",
    express.raw({ type: "application/json" }),
    async (req: any, res: any) => {
        try {
            const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
            const signature = req.headers["x-razorpay-signature"];
            const body = req.body.toString();
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(body)
                .digest("hex");

            if (expectedSignature !== signature) {
                return res.status(400).send("Invalid signature");
            }

            const event = JSON.parse(body);

            if (event.event === "payment.captured") {
                const payment = event.payload.payment.entity;
                const orderId = payment.order_id;
                paymentStore.set(orderId, {
                    status: "captured",
                    payment_id: payment.id,
                    method: payment.method,
                    amount: payment.amount,
                });

                // Always update, never create (created on /order)
                const userId = payment.notes?.userId;
                if (!userId) {
                    console.error("Webhook: userId missing in payment notes for order", orderId);
                    return res.status(400).send("userId missing in payment notes");
                }
                await prisma.payment.upsert({
                    where: { orderId },
                    update: {
                        status: "captured",
                        paymentId: payment.id,
                        method: payment.method,
                        amount: payment.amount,
                        userId: userId,
                    },
                    create: {
                        orderId,
                        paymentId: payment.id,
                        status: "captured",
                        method: payment.method,
                        amount: payment.amount,
                        userId: userId,
                    },
                });

                // Try to update InProgressPayment
                await prisma.inProgressPayment.updateMany({
                    where: { orderId },
                    data: {
                        status: "captured",
                        paymentId: payment.id,
                        method: payment.method,
                        amount: payment.amount,
                    }
                });
            }

            if (event.event === "payment.failed") {
                const payment = event.payload.payment.entity;
                const orderId = payment.order_id;
                paymentStore.set(orderId, {
                    status: "failed",
                    payment_id: payment.id,
                });
            }

            res.json({ status: "ok" });
        } catch (err: any) {
            res.status(500).send("Server error");
        }
    }
);

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Create order
app.post("/order", async (req: any, res: any) => {
    try {
        const { amount, currency, receipt, notes } = req.body;
        const options = {
            amount: Number(amount) * 100,
            currency: currency || "INR",
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || {},
        };
        const order = await razorpay.orders.create(options);

        // Always create Payment record with userId (UUID string)
        if (!notes?.userId) {
            return res.status(400).json({ error: "userId required in notes" });
        }
        await prisma.payment.create({
            data: {
                orderId: order.id,
                status: "created",
                amount: order.amount,
                userId: notes.userId, // UUID string
            }
        });

        paymentStore.set(order.id, {
            status: "created",
            payment_id: null,
            method: null,
            amount: order.amount,
        });
        res.json(order);
    } catch (err: any) {
        res.status(500).json({
            error: true,
            message: err.error?.description || "Server error while creating Razorpay order",
        });
    }
});

// inprogress order
app.post("/order-inprogress", async (req: any, res: any) => {
    try {
        const { amount, currency, receipt, notes, ticketId, userId } = req.body;
        if (!ticketId || !userId) {
            return res.status(400).json({ error: "ticketId and userId required" });
        }
        const options = {
            amount: Number(amount) * 100,
            currency: currency || "INR",
            receipt: receipt || `inprogress_${Date.now()}`,
            notes: notes || {},
        };
        const order = await razorpay.orders.create(options);

        // Create InProgressPayment record
        await prisma.inProgressPayment.create({
            data: {
                orderId: order.id,
                status: "created",
                amount: order.amount,
                userId,
                ticketId,
            }
        });

        paymentStore.set(order.id, {
            status: "created",
            payment_id: null,
            method: null,
            amount: order.amount,
        });
        res.json(order);
    } catch (err: any) {
        res.status(500).json({ error: true, message: err.error?.description || "Server error" });
    }
});

// Verify payment signature
app.post("/verify", async (req: any, res: any) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const prev = paymentStore.get(razorpay_order_id) || {};
            paymentStore.set(razorpay_order_id, {
                ...prev,
                status: "verified",
                payment_id: razorpay_payment_id,
            });
            // Fetch the order from Razorpay to get userId and amount
            const order = await razorpay.orders.fetch(razorpay_order_id);
            const userId = order.notes?.userId || null;
            const amount = order.amount;
            if (!userId) {
                return res.status(400).json({ error: "userId missing in order notes" });
            }
            await prisma.payment.update({
                where: { orderId: razorpay_order_id },
                data: {
                    status: "verified",
                    paymentId: razorpay_payment_id,
                    amount: amount,
                    userId: userId,
                }
            });
            await prisma.inProgressPayment.updateMany({
                where: { orderId: razorpay_order_id },
                data: {
                    status: "verified",
                    paymentId: razorpay_payment_id,
                    amount: amount,
                    userId: userId,
                }
            });
            return res.json({ status: "success", message: "Payment signature verified" });
        } else {
            return res.status(400).json({ status: "failure", message: "Invalid signature" });
        }
    } catch (err: any) {
        res.status(500).json({ status: "error", message: "Server error during verification" });
    }
});

// Poll payment status
app.get("/payment-status/:orderId", (req: any, res: any) => {
    const { orderId } = req.params;
    const data = paymentStore.get(orderId);
    if (!data) return res.status(404).json({ status: "unknown" });
    res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));