import express from "express";
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("DevFleet Server is Up and running on port "  + PORT);
});
