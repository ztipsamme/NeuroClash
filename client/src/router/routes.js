import CreateQuiz from '../views/CreateQuiz.js'
import EditQuiz from '../views/EditQuiz.js'
import Home from '../views/Home.js'
import MyQuizzes from '../views/MyQuizzes.js'
import Quiz from '../views/Quiz.js'
import QuizResult from '../views/QuizResult.js'
import Quizzes from '../views/Quizzes.js'
import SignIn from '../views/SignIn.js'
import SignUp from '../views/SignUp.js'

export const routes = [
  {
    path: '/',
    view: Home,
    isProtected: true,
  },
  {
    path: '/my-quizzes',
    view: MyQuizzes,
    isProtected: true,
  },
  {
    path: '/my-quizzes/create-quiz',
    view: CreateQuiz,
    isProtected: true,
  },
  {
    path: '/my-quizzes/edit/:id',
    view: EditQuiz,
    isProtected: true,
  },
  {
    path: '/quizzes/:categoryName',
    view: Quizzes,
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
