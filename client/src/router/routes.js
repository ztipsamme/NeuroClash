import Home from '../views/Home.js'
import QuizLanding from '../views/QuizLanding.js'
import SignIn from '../views/SignIn.js'
import SignUp from '../views/SignUp.js'

export const routes = [
  {
    path: '/',
    view: Home,
    isProtected: true,
  },
  {
    path: '/quiz:id',
    view: QuizLanding,
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
