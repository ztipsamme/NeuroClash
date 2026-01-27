import QuizList from '../components/QuizList.js'
import { getMyQuizzes } from '../services/quizService.js'

export default function MyQuizzes() {
  queueMicrotask(() => init())

  return /* html */ `
  <div class="my-quizzes">
    <h1>My Quizzes</h1>
    <a href="/my-quizzes/create-quiz" class="button secondary">New Quiz</a>
  </div>`
}

const init = async () => {
  const quizzes = await QuizList(await getMyQuizzes())

  document.querySelector('.my-quizzes').insertAdjacentHTML('beforeend', quizzes)
}
