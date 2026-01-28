import QuizList from '../components/QuizList.js'
import { Icon } from '../core/utils.js'
import {
  getCategorizedQuizzes,
  getMyQuizzes,
  getTopQuiz,
} from '../services/quizService.js'
import { getCurrentUser } from '../services/userService.js'
import { addStylesheet } from '../utils.js'

export default function Home() {
  addStylesheet('.home-view', 'home-view', '/components/home.css')
  queueMicrotask(() => init())

  return /* html */ `
  <div id="home-view">
    <h1 class="sr-only">Home</h1>
    <div class="hero split-view">
      <section class="hero-section">
        <h2 class="greeting hero-text"></h2>
        <img src="/public/man-horizontal.svg" alt="Man illustration" class="hero-image"/>
      </section>

      <section id="top-quiz" class="featured">
      </section>
    </div>
    <section class="quizzes-by-category">
      <h2 class="sr-only">Quizzes by category</h2>
      <div class="quiz-lists-container">
      </div>
    </section>
  </div>`
}

const init = async () => {
  const currentUser = (await getCurrentUser()).data
  const greeting = document.querySelector('.greeting')
  greeting.innerHTML = /*html*/ `Welcome back, <strong>${currentUser.username}</strong>!`

  await setFeaturedQuiz()

  const quizzesByCategory = document.querySelector('.quiz-lists-container')

  const categorizedLists = await getCategorizedQuizzes(6)

  categorizedLists.forEach(async (l) => {
    const content = /*html*/ `
      <section class="quiz-list-container">
        <h3 class="quiz-list-title">${l.categoryName}</h3>
        ${await QuizList(l.list)}
      </section>
      `
    quizzesByCategory.insertAdjacentHTML('beforeend', content)
  })
}

const setFeaturedQuiz = async () => {
  const { _id, title, description, category, createdBy } = await getTopQuiz()

  const featuredQuiz = document.querySelector('.featured')
  featuredQuiz.innerHTML = /*html*/ `
        <header>
          <h2>Most popular quiz</h2>
          <p>Beat the high score</p>
        </header>
        <quiz-card
          title="${title}"
          description="${description}"
          category="${category}"
          createdBy="${createdBy ? createdBy.username : ''}"
          url="/quiz/${_id}"
          dialog="Play quiz"
          >
          <slot slot="link-icon">${Icon('Play')}</slot>
          <slot slot="link-text">Play Quiz</slot>
        </quiz-card>
        `
}
