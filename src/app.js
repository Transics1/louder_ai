import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();

app.use(cors({
  origin: "https://your-frontend-url.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("Welcome to Louder AI");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);

app.use(errorHandler);

export default app;