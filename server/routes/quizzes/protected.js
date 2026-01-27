import express from 'express'
import { client } from '../../database.js'
import { resStatusJson } from '../../helpers.js'
import { requireAuth } from '../../middleware/auth.js'
import {
  addQuiz,
  deleteQuestions,
  deleteQuiz,
  findQuizById,
  findQuizzesByUserId,
  updateQuiz,
} from '../../services/service.js'
import { ValidateQuiz, ValidateUser } from '../../utils.js'

const router = express.Router()

router.get('/my-quizzes/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params

  try {
    const quizzes = await findQuizzesByUserId(userId)
    resStatusJson(res, { json: quizzes }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.post('/quiz', requireAuth, async (req, res) => {
  const { meta, questions } = req.body

  if (!meta || !questions)
    return resStatusJson(res, { message: 'Quiz data is missing' }, 400)

  if (!ValidateQuiz({ meta, questions }))
    return resStatusJson(res, { message: 'Please enter all details' }, 400)

  const session = client.startSession()

  try {
    session.startTransaction()
    await addQuiz(meta, questions, session)
    await session.commitTransaction()
    resStatusJson(res, { json: { message: 'Quiz created' } }, 201)
  } catch (error) {
    await session.abortTransaction()
    resStatusJson(res, { error }, 500)
  } finally {
    await session.endSession()
  }
})

router.put('/quiz/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const body = req.body
  const quiz = await findQuizById(id)

  if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)

  if (!ValidateUser(quiz.createdBy._id.toString(), req))
    return resStatusJson(
      res,
      { message: 'Not allowed to update this quiz' },
      403
    )

  if (!body.meta || !body.questions || !body.deletedQuestionIds)
    return resStatusJson(res, { message: 'Quiz data is missing' }, 400)
  if (!ValidateQuiz({ meta: body.meta, questions: body.questions }))
    return resStatusJson(res, { message: 'Please enter all details' }, 400)

  const session = client.startSession()
  try {
    session.startTransaction()
    await updateQuiz(body, session)
    await session.commitTransaction()
    resStatusJson(res, { json: { message: 'Quiz updated' } }, 200)
  } catch (error) {
    await session.abortTransaction()
    resStatusJson(res, { error }, 500)
  } finally {
    await session.endSession()
  }
})

router.delete('/quiz/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const session = client.startSession()
  const quiz = await findQuizById(id)

  if (!quiz) return resStatusJson(res, { message: 'Quiz not found' }, 404)
  if (!ValidateUser(quiz.createdBy._id.toString(), req))
    return resStatusJson(
      res,
      { message: 'Not allowed to delete this quiz' },
      403
    )

  try {
    session.startTransaction()

    if (quiz.questionIds.length) {
      await deleteQuestions(quiz.questionIds, session)
    }

    await deleteQuiz(id, session)
    await session.commitTransaction()
    resStatusJson(res, { json: { message: 'Quiz deleted' } }, 200)
  } catch (error) {
    await session.abortTransaction()
    resStatusJson(res, { error }, 500)
  } finally {
    await session.endSession()
  }
})

export default router
