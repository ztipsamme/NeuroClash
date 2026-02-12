import QuizList from '../components/QuizList.js'
import { getMyQuizzes } from '../services/quizService.js'

export default function MyQuizzes() {
  queueMicrotask(() => init())

  return /* html */ `
  <div class="my-quizzes">
    <h1>My Quizzes</h1>
    <a href="/my-quizzes/create-quiz" class="button">New Quiz</a>
      <div class="quiz-lists-container">
      </div>
  </div>`
}

const init = async () => {
  const quizzes = await QuizList(await getMyQuizzes())

  document
    .querySelector('.quiz-lists-container')
    .insertAdjacentHTML('beforeend', quizzes)
}
