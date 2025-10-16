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


dotenv.config({ path: "../.env" });

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


app.use("/api", authRouter);
app.use(authMiddleware); // protect all routes after this

app.use("/api", expenseRouter);
app.use("/api", userRouter);
app.use("/api", aiRouter);



app.use(notFount);
app.use(errorHandler);

app.get("/", (req, resp) => {
  resp.json({ message: "Welcome to expense backend." });
});

connectDb();

app.listen(8081, () => console.log("Server started on port 8081"));
