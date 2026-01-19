import express from 'express'
import { getCollection } from '../database.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const quizzesCollection = getCollection('quizzes')
    const usersCollection = getCollection('users')

    const quizzes = await quizzesCollection.find({}).toArray()
    const users = await usersCollection.find({}).toArray()

    const getUserById = (id) =>
      users.find((u) => u._id.toString() === id.toString())

    const populatedQuizzes = quizzes.map((q) => ({
      ...q,
      CreatedBy: getUserById(q.CreatedBy),
    }))

    res.status(200).json(populatedQuizzes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const quizzesCollection = getCollection('quizzes')
    const usersCollection = getCollection('users')

    const quiz = await quizzesCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!quiz) res.status(400).json({ message: 'Quiz not found' })

    const creator = await usersCollection.findOne({
      _id: new ObjectId(quiz.CreatedBy),
    })

    if (!creator) res.status(400).json({ message: 'Quiz creator not found' })

    const populatedQuiz = {
      ...quiz,
      CreatedBy: creator,
    }

    res.status(200).json(populatedQuiz)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id/questions', async (req, res) => {
  const { id } = req.params

  try {
    const quizzesCollection = getCollection('quizzes')
    const questionsCollection = getCollection('questions')

    const quiz = await quizzesCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!quiz) res.status(400).json({ message: 'Quiz not found' })

    const questions = await Promise.all(
      quiz.QuestionIds.map(
        async (id) =>
          await questionsCollection.findOne({
            _id: new ObjectId(id),
          })
      )
    )

    if (!questions)
      res.status(400).json({ message: 'Quiz questions not found' })

    res.status(200).json({
      Quiz: {
        _id: quiz._id,
        Title: quiz.Title,
      },
      Questions: questions,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
