import CreateQuiz from '../views/CreateQuiz.js'
import Home from '../views/Home.js'
import Quiz from '../views/Quiz.js'
import QuizResult from '../views/QuizResult.js'
import SignIn from '../views/SignIn.js'
import SignUp from '../views/SignUp.js'

export const routes = [
  {
    path: '/',
    view: Home,
    isProtected: true,
  },
  {
    path: '/create-quiz',
    view: CreateQuiz,
    isProtected: true,
  },
  {
    path: '/quiz/:id',
    view: Quiz,
    isProtected: true,
  },
  {
    path: '/quiz/:id/result',
    view: QuizResult,
    isProtected: true,
  },
  {
    path: '/sign-in',
    view: SignIn,
  },
  {
    path: '/sign-up',
    view: SignUp,
  },
]
