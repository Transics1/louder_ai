import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Louder. AI");
});

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/events", eventRoutes);

export default app;