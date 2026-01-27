import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import { resStatusJson } from '../helpers.js'
import { requireAuth } from '../middleware/auth.js'
import {
  addUser,
  deleteUser,
  findUserByUserId,
  findUserByUsername,
  findUsers,
  isCurrentUser,
} from '../services/service.js'
import {
  ValidateBirthday,
  ValidateEmail,
  ValidatePassword,
  ValidateUsername,
} from '../utils.js'

const router = express.Router()
let SECRET = process.env.SECRET

router.get('/', async (req, res) => {
  try {
    const users = await findUsers()
    resStatusJson(res, { json: users }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.get('/me', requireAuth, (req, res) => {
  resStatusJson(res, { json: req.user }, 200)
})

router.post('/sign-in', async (req, res) => {
  const { username, password: password } = req.body

  try {
    const user = await findUserByUsername(username)
    const validPassword = await bcrypt.compare(password, user?.password)

    if (!user || !validPassword)
      return resStatusJson(
        res,
        { message: 'Incorrect username or password' },
        403
      )

    const token = jwt.sign({ userId: user._id, username: username }, SECRET, {
      expiresIn: '1h',
    })

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    })

    resStatusJson(res, { json: { message: 'Signed in' } }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.post('/sign-up', async (req, res) => {
  const user = req.body
  const { username, email, birthday, password } = user
  const badReq = (message) => resStatusJson(res, { message: message }, 400)

  try {
    const existingUser = await findUserByUsername(username)

    if (existingUser) {
      return resStatusJson(
        res,
        {
          json: {
            message: 'The username unavailable, please try a different one.',
          },
        },
        400
      )
    }

    if (!ValidateUsername(username)) {
      console.log(ValidateUsername(username))

      return badReq('The username unavailable, please try a different one.')
    }

    if (!ValidateEmail(email)) {
      return badReq(
        'Invalid email adress. Correct format ex: youremail@mail.com'
      )
    }

    if (!ValidateBirthday(birthday)) {
      return badReq('Invalid date or date format.')
    }

    if (!ValidatePassword(password)) {
      return badReq(
        'Password does not meet all of the following requirements.:\n' +
          '- Must contain a number\n' +
          '- Must contain a capital letter\n' +
          '- Must contain one special character ex: @#$%^&\n' +
          '- Must be 8-20 characters long'
      )
    }

    await addUser(user)

    resStatusJson(res, { json: { message: 'User created' } }, 201)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.post('/sign-out', (req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    })
    resStatusJson(res, { json: { message: 'Signed out' } }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params

  try {
    const user = await findUserByUserId(id)
    const isUser = await isCurrentUser(user._id.toString(), req)

    if (!user) {
      return resStatusJson(
        res,
        {
          message: 'User not found',
        },
        404
      )
    }

    if (!isUser) {
      return resStatusJson(
        res,
        {
          message: 'Not allowed to delete this user',
        },
        403
      )
    }

    await deleteUser(id)
    resStatusJson(res, { json: { message: 'Deleted account' } }, 200)
  } catch (error) {
    resStatusJson(res, { error }, 500)
  }
})

export default router
