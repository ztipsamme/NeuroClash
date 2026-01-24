import express from 'express'
import { ObjectId } from 'mongodb'
import { client, getCollection } from '../database.js'
import { requireAuth } from '../middleware/auth.js'
import { ValidateQuiz } from '../utils.js'

const router = express.Router()

const getQuiz = async (quizId) => {
  const quizzesCollection = getCollection('quizzes')
  return await quizzesCollection.findOne({
    _id: new ObjectId(quizId),
  })
}
const getCreator = async (creatorId) => {
  const usersCollection = getCollection('users')
  return await usersCollection.findOne({
    _id: new ObjectId(creatorId),
  })
}

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const quizzesCollection = getCollection('quizzes')
    const usersCollection = getCollection('users')

    const quizzes = await quizzesCollection.find({}).toArray()
    const users = await usersCollection.find({}).toArray()

    const getUserById = (id) => users.find((u) => u._id.toString() === id)

    const populatedQuizzes = quizzes.map((q) => ({
      ...q,
      createdBy: getUserById(q.createdBy),
    }))

    res.status(200).json(populatedQuizzes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/quiz-meta/:id', async (req, res) => {
  const { id } = req.params

  try {
    const quiz = await getQuiz(id)
    if (!quiz) res.status(400).json({ message: 'Quiz not found' })

    const creator = await getCreator(quiz.createdBy)
    if (!creator) res.status(400).json({ message: 'Quiz creator not found' })

    const populatedQuiz = {
      ...quiz,
      createdBy: creator,
    }

    res.status(200).json(populatedQuiz)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/full-quiz/:id', async (req, res) => {
  const { id } = req.params

  try {
    const quiz = await getQuiz(id)
    if (!quiz) res.status(400).json({ message: 'Quiz not found' })

    const creator = await getCreator(quiz.createdBy)
    if (!creator) res.status(400).json({ message: 'Quiz creator not found' })

    const questionsCollection = getCollection('questions')
    const questions = await Promise.all(
      quiz.questionIds.map(
        async (questionIds) =>
          await questionsCollection.findOne({
            _id: new ObjectId(questionIds),
          })
      )
    )

    if (!questions)
      res.status(400).json({ message: 'Quiz questions not found' })

    const { questionIds, ...quizRest } = quiz

    res.status(200).json({
      ...quizRest,
      createdBy: creator,
      questions: questions,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// PROTECTED
router.get('/my-quizzes/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params

  try {
    const quizzesCollection = getCollection('quizzes')
    const quizzes = await quizzesCollection.find({}).toArray()
    const usersQuizzes = quizzes.filter(
      (q) => q.createdBy.toString() === userId
    )

    const omittedQuizzes = usersQuizzes.map(({ createdBy, ...p }) => p)

    res.status(200).json(omittedQuizzes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/quiz', requireAuth, async (req, res) => {
  const { meta, questions } = req.body

  const session = client.startSession()
  const quizzesCollection = getCollection('quizzes')
  const questionsCollection = getCollection('questions')

  if (!meta || !questions) {
    res.status(400).json({ message: 'Quiz data is missing' })
    return
  }

  if (!ValidateQuiz({ meta, questions })) {
    return res.status(400).json({ message: 'Please enter all details' })
  }

  try {
    session.startTransaction()

    const insertedQuestions = await questionsCollection.insertMany(questions, {
      session,
    })

    const quiz = {
      ...meta,
      questionIds: Object.values(insertedQuestions.insertedIds),
    }

    await quizzesCollection.insertOne(quiz, { session })
    await session.commitTransaction()

    res.status(201).json({ message: 'Quiz created' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
})

router.put('/quiz/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { meta, questions, deletedQuestionIds } = req.body

  const quiz = getQuiz(id)

  if (!quiz) {
    res.status(400).json({ message: 'Quiz not found' })
    return
  }

  if (!meta || !questions || !deletedQuestionIds) {
    res.status(400).json({ message: 'Quiz data is missing' })
    return
  }

  if (!ValidateQuiz({ meta, questions })) {
    return res.status(400).json({ message: 'Please enter all details' })
  }

  const session = client.startSession()
  const quizzesCollection = getCollection('quizzes')
  const questionsCollection = getCollection('questions')

  try {
    session.startTransaction()

    const existingQuestions = questions.filter((q) => q._id)
    const newQuestions = questions.filter((q) => !q._id)

    const updates = existingQuestions
      .filter((q) => q._id)
      .map((q) => ({
        updateOne: {
          filter: { _id: new ObjectId(q._id) },
          update: {
            $set: {
              statement: q.statement,
              category: q.category,
              answers: q.answers,
            },
          },
        },
      }))

    if (updates.length) {
      await questionsCollection.bulkWrite(updates, { session })
    }

    const inserted = newQuestions.length
      ? await questionsCollection.insertMany(newQuestions, { session })
      : { insertedIds: {} }

    if (deletedQuestionIds.length) {
      await questionsCollection.deleteMany(
        {
          _id: { $in: deletedQuestionIds.map((id) => new ObjectId(id)) },
        },
        { session }
      )
    }

    const existingIds = existingQuestions.map((q) => new ObjectId(q._id))
    const newIds = Object.values(inserted.insertedIds)

    await quizzesCollection.updateOne(
      { _id: new ObjectId(meta._id) },
      {
        $set: {
          title: meta.title,
          description: meta.description,
          category: meta.category,
          questionIds: [...existingIds, ...newIds],
        },
      },
      { session }
    )

    await session.commitTransaction()
    res.status(200).json({ message: 'Quiz updated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
})

router.delete('/quiz/:id', requireAuth, async (req, res) => {
  const { id } = req.params

  const session = client.startSession()
  const quizzesCollection = getCollection('quizzes')
  const questionsCollection = getCollection('questions')

  try {
    session.startTransaction()

    const quiz = await getQuiz(id)

    if (!quiz) {
      await session.abortTransaction()
      res.status(400).json({ message: 'Quiz not found' })
      return
    }

    if (quiz.questionIds.length) {
      await questionsCollection.deleteMany(
        {
          _id: { $in: quiz.questionIds.map((id) => new ObjectId(id)) },
        },
        { session }
      )
    }

    await quizzesCollection.deleteOne({ _id: new ObjectId(id) }, { session })
    await session.commitTransaction()
    res.status(200).json({ message: 'Quiz updated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
})

export default router
