import { requireAuth } from '../middleware/auth.js'
import express from 'express'

const router = express.Router()

router.get('/protected', requireAuth, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user: req.user,
  })
})
