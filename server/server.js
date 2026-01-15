import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import authRoutes from './routes/auth.js'
import quizRoutes from './routes/quizzes.js'
import { connectToDatabase } from './database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running')
})
app.use('/auth', authRoutes)
app.use('/quizzes', quizRoutes)

async function startServer() {
  try {
    console.log('Connecting to MongoDB...')
    await connectToDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
  }
}

startServer()
