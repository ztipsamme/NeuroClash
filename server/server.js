import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectToDatabase } from './database.js'
import authRoutes from './routes/auth.js'
import quizRoutes from './routes/quizzes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(cookieParser())
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
