import express from "express";
import { getCollection } from "../database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const quizzesCollection = getCollection("quizzes");
    const usersCollection = getCollection("users");

    const quizzes = await quizzesCollection.find({}).toArray();
    const users = await usersCollection.find({}).toArray();

    const getUserById = (id) =>
      users.find((u) => u._id.toString() === id.toString());

    const populatedQuizzes = quizzes.map((q) => ({
      ...q,
      CreatedBy: getUserById(q.CreatedBy),
    }));

    res.status(200).json(populatedQuizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const quizzesCollection = getCollection("quizzes");
    const quiz = await quizzesCollection.findOne({ _id: new ObjectId(id) });

    if (!quiz) {
      return (res.status(404), json({ message: "Quiz not found" }));
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
