// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import eventRoutes from "./routes/event.routes.js";
// import { errorHandler } from "./middlewares/error.middleware.js";
// import rateLimit from "express-rate-limit";
// import helmet from "helmet";
// const app = express();

// app.use(cors());
// app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 50,
// });

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// app.use(helmet());
// app.use(limiter);
// app.use(logger);




// app.get("/", (req, res) => {
//   res.send("Welcome to Louder. AI");
// });


// app.use("/api/auth", authRoutes);

// app.use("/api/user", userRoutes);

// app.use("/api/events", eventRoutes);

// app.use(errorHandler);

// export default app;


import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(express.json());

// logger (you already defined it here ✅)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// security
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("Welcome to Louder AI");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);

// error handler
app.use(errorHandler);

export default app;