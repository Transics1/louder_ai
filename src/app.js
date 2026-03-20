import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",     
  "http://localhost:3000",     
  "http://127.0.0.1:5173",       
  "https://louder-ai-client.vercel.app", 
  "https://louder-ai.vercel.app",         
];

console.log(`CORS Allowed Origins: ${allowedOrigins.join(", ")}`);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      console.log("CORS: No origin (Postman/Mobile) - Allowed");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`CORS: ${origin} - Allowed`);
      callback(null, true);
    } else {
      console.warn(`CORS: ${origin} - Blocked (not in allowed list)`);
      callback(new Error(`CORS Not allowed by policy. Origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"]
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