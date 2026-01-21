import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getCollection } from '../database.js'
import {
  ValidateBirthday,
  ValidateEmail,
  ValidatePassword,
  ValidateUsername,
} from '../utils.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
let SECRET = process.env.SECRET

router.get('/', async (req, res) => {
  try {
    const usersCollection = getCollection('users')
    const users = await usersCollection.find({}).toArray()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/sign-up', async (req, res) => {
  const { username, email, birthday, password } = req.body

  try {
    const usersCollection = getCollection('users')

    const existingUser = await usersCollection.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        message: 'The username unavailable, please try a different one.',
      })
    }

    if (!ValidateUsername(username)) {
      res.status(400).json({
        message:
          'Username does not meet all of the following requirements:\n' +
          '- Start with a letter\n' +
          '- Can contain letters, numbers, dashes and underscores' +
          '- Must be 3-20 characters long',
      })
      return
    }

    if (!ValidateEmail(email)) {
      res.status(400).json({
        message: 'Invalid email adress. Correct format ex: youremail@mail.com',
      })
      return
    }

    if (!ValidateBirthday(birthday)) {
      res.status(400).json({
        message: 'Invalid date or date format.',
      })
      return
    }

    if (!ValidatePassword(password)) {
      res.status(400).json({
        message:
          'Password does not meet all of the following requirements.:\n' +
          '- Must contain a number\n' +
          '- Must contain a capital letter\n' +
          '- Must contain one special character ex: @#$%^&\n' +
          '- Must be 8-20 characters long',
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await usersCollection.insertOne({
      username,
      email,
      birthday,
      password: hashedPassword,
    })

    res.status(201).json({ message: 'User created' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body

  try {
    const usersCollection = getCollection('users')
    const user = await usersCollection.findOne({ username })

    if (!user)
      return res.status(400).json({ message: 'Incorrect username or password' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(400).json({ message: 'Incorrect username or password' })
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    })

    res.status(200).json({ message: 'Signed in' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.post('/sign-out', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  })

  res.status(200).json({ message: 'Signed out' })
})

router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({
    user: req.user,
  })
})

export default router
