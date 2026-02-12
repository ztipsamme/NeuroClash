import express from 'express'
import { ObjectId } from 'mongodb'
import { resStatusJson } from '../../helpers.js'
import {
  findQuizById,
  findQuizzes,
  findUserByUserId,
  groupQuizzesByCategory,
  populateQuiz,
  QUESTIONS_COLLECTION,
  QUIZ_COLLECTION,
} from '../../services/service.js'
import { deslugify } from '../../utils.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const {
    category,
    sort = 'createdAt',
    order = 'asc',
    limit,
    groupBy,
    groupLimit,
  } = req.query

  try {
    const filter = {}

    if (category)
      filter.category = { $regex: `^${deslugify(category)}$`, $options: 'i' }

    const sortOption = {
      [sort]: order === 'desc' ? -1 : 1,
    }

    let quizzes = await findQuizzes({
      filter,
      sort: sortOption,
      limit: groupBy ? undefined : Number(limit),
    })

    if (groupBy === 'category')
      quizzes = await groupQuizzesByCategory(quizzes, groupLimit)

    resStatusJson(res, { json: quizzes }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/top-quiz', async (req, res) => {
  try {
    const quiz = await QUIZ_COLLECTION().findOne()
    if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

    resStatusJson(res, { json: await populateQuiz(quiz) }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const quiz = await findQuizById(id)
    if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

    const questions = await Promise.all(
      quiz.questionIds.map(
        async (questionIds) =>
          await QUESTIONS_COLLECTION().findOne({
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

router.get('/:id/meta', async (req, res) => {
  const { id } = req.params

  try {
    const quiz = await findQuizById(id)
    if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

    resStatusJson(res, { json: quiz }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

export default router
