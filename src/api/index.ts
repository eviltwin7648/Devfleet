import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow all origins for development

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log("DevFleet Server is Up and running on port " + PORT);
});
