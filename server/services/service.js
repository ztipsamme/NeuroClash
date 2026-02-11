import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { getCollection } from '../database.js'

export const QUIZ_COLLECTION = () => getCollection('quizzes')
export const QUESTIONS_COLLECTION = () => getCollection('questions')
export const USERS_COLLECTION = () => getCollection('users')

export const findQuizById = async (id) => {
  const quiz = await QUIZ_COLLECTION().findOne({ _id: new ObjectId(id) })
  return await populateQuiz(quiz)
}

export const findQuizzesByUser = async (userId) => {
  const quizzes = await QUIZ_COLLECTION().find({}).toArray()
  return quizzes.filter((q) => q.createdBy.toString() === userId)
}

export const findUserByUserId = async (id) =>
  await USERS_COLLECTION().findOne({
    _id: new ObjectId(id) || id,
  })

export const findUserByUsername = async (username) => {
  return await USERS_COLLECTION().findOne({
    username: username,
  })
}

export const populateQuiz = async (quiz) => {
  const creator = await findUserByUserId(quiz.createdBy)

  return {
    ...quiz,
    createdBy: creator || null,
  }
}

export const findQuizzes = async ({ filter, sort, limit }) => {
  let quizzes = await QUIZ_COLLECTION().find(filter).sort(sort)

  if (limit >= 0) quizzes = await quizzes.limit(limit)

  quizzes = await quizzes.toArray()

  return await Promise.all(
    quizzes.map(async (quiz) => await populateQuiz(quiz))
  )
}

export const findUsers = async (limit = null) => {
  let users = USERS_COLLECTION().find({})
  if (limit) users = users.limit(limit)

  return await users.toArray()
}

export const findQuizzesByUserId = async (userId) => {
  let quizzes = await QUIZ_COLLECTION().find({}).toArray()
  quizzes = quizzes.filter((q) => q.createdBy.toString() === userId)

  return Promise.all(quizzes.map(({ createdBy, ...p }) => p))
}

export const addQuiz = async (meta, questions, session) => {
  return await QUIZ_COLLECTION().insertOne(
    {
      ...meta,
      questionIds: Object.values(
        (await QUESTIONS_COLLECTION().insertMany(questions, { session }))
          .insertedIds
      ),
    },
    { session }
  )
}

export const addUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10)
  await USERS_COLLECTION().insertOne({ ...user, password: hashedPassword })
}

export const deleteQuiz = async (quizId, session) => {
  await QUIZ_COLLECTION().deleteOne({ _id: new ObjectId(quizId) }, { session })
}

export const deleteQuestions = async (questionIds, session) => {
  if (questionIds.length) {
    await QUESTIONS_COLLECTION().deleteMany(
      {
        _id: { $in: questionIds.map((id) => new ObjectId(id)) },
      },
      { session }
    )
  }
}

export const deleteUser = async (userId) => {
  await USERS_COLLECTION().deleteOne({ _id: new ObjectId(userId) })
}

export const updateQuestions = async (
  questions,
  deletedQuestionIds,
  session
) => {
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
    await QUESTIONS_COLLECTION().bulkWrite(updates, { session })
  }

  const inserted = newQuestions.length
    ? await QUESTIONS_COLLECTION().insertMany(newQuestions, { session })
    : { insertedIds: {} }

  await deleteQuestions(deletedQuestionIds, session)

  const existingIds = existingQuestions.map((q) => new ObjectId(q._id))
  const newIds = Object.values(inserted.insertedIds)

  return [...existingIds, ...newIds]
}

export const updateQuiz = async (
  { meta, questions, deletedQuestionIds },
  session
) => {
  await QUIZ_COLLECTION().updateOne(
    { _id: new ObjectId(meta._id) },
    {
      $set: {
        title: meta.title,
        description: meta.description,
        category: meta.category,
        questionIds: await updateQuestions(
          questions,
          deletedQuestionIds,
          session
        ),
      },
    },
    { session }
  )
}

export const groupQuizzesByCategory = async (quizzes, groupLimit) => {
  const categoryMap = new Map()

  for (const quiz of quizzes) {
    const categoryName = quiz.category || 'Uncategorized'
    if (!categoryMap.has(categoryName)) categoryMap.set(categoryName, [])

    const list = categoryMap.get(categoryName)

    if (!groupLimit || list.length < groupLimit) {
      list.push(quiz)
    }
  }

  return Array.from(categoryMap, ([categoryName, list]) => ({
    categoryName,
    list,
  }))
}

export const isCurrentUser = async (userId, req) => {
  return req.user.userId === userId
}
