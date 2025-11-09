import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Setup (No trailing slash, otherwise CORS fails)
app.use(cors({
  origin: [
    "https://pay-flux-eight.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

// JSON parser
app.use(express.json());

// Global API Key Validation Middleware
app.use((req, res, next) => {
  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }
  next();
});

// Rate limiting (10 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Root route
app.get("/", (req, res) => {
  res.send("💳 PayFlux Backend is Running Securely...");
});

// Payment API routes
app.use("/api", paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ PayFlux backend running securely on port ${PORT}`);
});