import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Simple API key-based protection
const API_KEY = process.env.API_SECRET;

// Preferred gateway routing
const preferredGateway = {
  upi: "razorpay",
  card: "stripe",
  netbanking: "cashfree",
};

// Helper: Basic sanitization
const sanitizeInput = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/[<>]/g, "") // remove HTML tags
    .replace(/script/gi, "")
    .replace(/["'`]/g, "")
    .trim();
};

// 🧾 Payment Route
router.post("/pay", async (req, res) => {
  try {
    // Check API key (if you enable it)
    if (API_KEY && req.headers["x-api-key"] !== API_KEY) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    let { amount, method, recipient, description, subtype } = req.body;

    // Validate inputs
    if (!amount || isNaN(amount) || amount <= 0 || !method)
      return res.status(400).json({ error: "Invalid payment details" });

    const normalizedMethod = sanitizeInput(method.toLowerCase());
    recipient = sanitizeInput(recipient);
    description = sanitizeInput(description);
    subtype = sanitizeInput(subtype);

    const gateway = preferredGateway[normalizedMethod] || "razorpay";

    // Random subtype if not provided
    if (!subtype) {
      if (normalizedMethod === "card") {
        const cards = ["Visa", "MasterCard", "RuPay"];
        subtype = cards[Math.floor(Math.random() * cards.length)];
      } else if (normalizedMethod === "netbanking") {
        const banks = ["HDFC", "ICICI", "SBI", "Axis"];
        subtype = banks[Math.floor(Math.random() * banks.length)];
      } else if (normalizedMethod === "upi") {
        const upis = ["Paytm", "GooglePay"];
        subtype = upis[Math.floor(Math.random() * upis.length)];
      }
    }

    // Construct display method
    const displayMethod = subtype
      ? `${normalizedMethod.toUpperCase()} (${subtype.toUpperCase()})`
      : normalizedMethod.toUpperCase();

    // Mock transaction ID + status
    const mockTransactionId = `${gateway.slice(0, 3).toUpperCase()}-${Date.now()}`;
    const status = Math.random() > 0.1 ? "Success" : "Failed";

    // Create record safely
    const payment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        method: displayMethod,
        recipient,
        description,
        gateway,
        status,
        transactionId: mockTransactionId,
      },
    });

    res.json(payment);
  } catch (error) {
    console.error("❌ Payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Transaction History
router.get("/history", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // Limit results to avoid overload
    });
    res.json(payments);
  } catch (error) {
    console.error("❌ Fetch history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;