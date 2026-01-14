import Home from '../views/Home.js'
import QuizLanding from '../views/QuizLanding.js'
// import Landing from '../views/Landing.js'
// import SignIn from '../views/SignIn.js'
// import MyQuizzes from '../views/MyQuizzes.js'
import SignUp from '../views/SignUp.js'
// import Settings from '../views/Settings.js'

export const routes = [
  {
    path: '/',
    view: Home,
  },
  {
    path: '/quiz:id',
    view: QuizLanding,
  },
  // {
  //   path: '/landing',
  //   view: Landing,
  //   layout: MainLayout,
  // },
  // {
  //   path: '/my-quizzes',
  //   view: MyQuizzes,
  //   layout: MainLayout,
  // },
  // {
  //   path: '/settings',
  //   view: Settings,
  //   layout: MainLayout,
  // },
  // {
  //   path: '/sign-in',
  //   view: SignIn,
  // },
  {
    path: '/sign-up',
    view: SignUp,
  },
]
