import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("💳 PayFlux Backend is Running...");
});

// API routes
app.use("/api", paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ PayFlux backend running on port ${PORT}`);
});
