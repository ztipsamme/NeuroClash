import express from 'express'
import { ObjectId } from 'mongodb'
import { getCollection } from '../../database.js'
import { resStatusJson } from '../../helpers.js'
import {
  findQuizById,
  findQuizzes,
  groupQuizzesByCategory,
  populateQuiz,
  QUESTIONS_COLLECTION,
  QUIZ_COLLECTION,
} from '../../services/service.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const quizzes = await findQuizzes()
    resStatusJson(res, { json: quizzes }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/categorized', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || null
    const categorizedQuizzes = await groupQuizzesByCategory(
      await findQuizzes(limit)
    )

    resStatusJson(res, { json: categorizedQuizzes }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/quiz/:id', async (req, res) => {
  const { id } = req.params

  try {
    const quiz = await findQuizById(id)
    if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

    const questions = await Promise.all(
      quiz.questionIds.map(
        async (questionIds) =>
          await QUESTIONS_COLLECTION.findOne({
            _id: new ObjectId(questionIds),
          })
      )
    )

    if (!questions || !questions.length)
      return resStatusJson(res, { message: 'Quiz questions not found' }, 404)

    const { questionIds, ...quizRest } = quiz
    resStatusJson(res, { json: { ...quizRest, questions } }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/quiz-meta/:id', async (req, res) => {
  const { id } = req.params

  try {
    const quiz = await findQuizById(id)
    if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

    resStatusJson(res, { json: quiz }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/top-quiz', async (req, res) => {
  try {
    const quiz = await QUIZ_COLLECTION.findOne()
    if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

    const populatedQuiz = await populateQuiz(quiz)
    resStatusJson(res, { json: populatedQuiz }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

export default router
