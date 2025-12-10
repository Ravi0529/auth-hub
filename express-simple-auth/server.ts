import dotenv from "dotenv";
import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import cors from "cors";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 8000;

const corsOptions = {
  origin: "http://localhost:5000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.get("/", (_: Request, res: Response) => {
  return res.status(200).json({ message: "Hello from the server!" });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
