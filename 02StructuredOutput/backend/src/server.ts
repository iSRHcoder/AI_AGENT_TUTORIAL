import express from "express";
import cors from "cors";
import { loadEnv } from "./env";
import { askStructured } from "./ask-core";

loadEnv();

const app = express();

app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Hello World");
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "server is live and running",
  });
});

app.post("/ask", async (req, res) => {
  try {
    const { query } = req.body ?? {};
    if (!query || !String(query).trim()) {
      return res.status(400).json({
        error: 'Field "query" is required',
      });
    }

    const out = await askStructured(query);

    return res.status(200).json(out);
  } catch (err: any) {
    return res.status(500).json({
      error: "Failed to answer",
    });
  }
});

const PORT = process.env.PORT;
console.log("PORT =", PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
