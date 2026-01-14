import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getCollection } from "../database.js";

const router = express.Router();
const SECRET = "minhemliga123";

router.get("/", async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersCollection = getCollection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, password: hashedPassword });

    res.status(200).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;

  try {
  } catch (error) {}
  const user = users.find((u) => u.username === username);
  if (!user)
    return res.status(400).json({ message: "Incorrect username or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(400).json({ message: "Incorrect username or password" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

export default router;
