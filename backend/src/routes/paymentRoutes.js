import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Preferred gateway routing
const preferredGateway = {
  upi: "razorpay",
  card: "stripe",
  netbanking: "cashfree",
};

// Payment Route
router.post("/pay", async (req, res) => {
  try {
    let { amount, method, recipient, description, subtype } = req.body;
    if (!amount || !method)
      return res.status(400).json({ error: "Missing required fields" });

    const normalizedMethod = method.toLowerCase();

    const gateway = preferredGateway[normalizedMethod] || "razorpay";

    // Use subtype from frontend or fallback randomly
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

    // Format method to show subtype (if applicable)
    const displayMethod = subtype
      ? `${method.toUpperCase()} (${subtype.toUpperCase()})`
      : method.toUpperCase();

    // Simulate realistic transaction ID + status
    const mockTransactionId = `${gateway.slice(0, 3).toUpperCase()}-${Date.now()}`;
    const status = Math.random() > 0.1 ? "Success" : "Failed";

    // Store transaction
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
    console.error("Payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Transaction History
router.get("/history", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
