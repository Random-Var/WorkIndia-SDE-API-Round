import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
