import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth',authRoutes)

app.listen(PORT, () => {
  console.log("DevFleet Server is Up and running on port "  + PORT);
});
