import express from "express";
import expenseRouter from "./routes/expense.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import aiRouter from "./routes/ai.route.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { notFount, errorHandler } from "./errors/error.js";
import connectDb from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";


// ✅ load .env from root automatically
dotenv.config();

// Use environment PORT if available
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


const app = express();

app.use(cors({ origin: "smart-budget-ai-backend.vercel.app" }));
app.use(express.json());

// Public routes
app.use("/api", authRouter);

// Protected routes
app.use(authMiddleware); // protect all routes after this
app.use("/api", expenseRouter);
app.use("/api", userRouter);
app.use("/api", aiRouter);

// Error handling
app.use(notFount);
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to expense backend." });
});

// Connect DB
connectDb();

