import QuizList from '../components/QuizList.js'
import { addStylesheet, toNormal } from '../core/utils.js'
import { getQuizzes } from '../services/quizService.js'

export default function QuizzesByCategory({ categoryName }) {
  addStylesheet('home-css', '/components/home.css')

  queueMicrotask(() => init(categoryName))

  return /* html */ `
  <div id="quizzes-view">
    <h1>${toNormal(categoryName)}</h1>
    <div class="quizzes-container">
    </div>
  </div>`
}

const init = async (categoryName) => {
  const quizzesContainer = document.querySelector('.quizzes-container')
  const quizzes = await getQuizzes(`?category=${categoryName}`)
  quizzesContainer.innerHTML = /*html*/ await QuizList(quizzes)
}
