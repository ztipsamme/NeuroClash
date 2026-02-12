import { QuizCard } from '../components/QuizCard.js'
import QuizList from '../components/QuizList.js'
import { addStylesheet, slugify } from '../core/utils.js'
import { getQuizzes, getTopQuiz } from '../services/quizService.js'
import { getCurrentUser } from '../services/userService.js'

export default function Home() {
  addStylesheet('home-css', '/components/home.css')

  queueMicrotask(() => init())

  return /* html */ `
  <div id="home-view">
    <h1 class="sr-only">Home</h1>
    <div class="hero split-view bleed-width">
      <section class="hero-section ">
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

  const categorizedLists = await getQuizzes(`/?groupBy=category&groupLimit=6`)

  categorizedLists.forEach(async (l) => {
    const content = /*html*/ `
      <section class="quiz-list-container">
      <header>
        <h3 class="quiz-list-title">${l.categoryName}</h3>
        <a href="/quizzes/${slugify(l.categoryName)}">
        View more
      </a>
      </header>
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
        ${QuizCard({
          title,
          description,
          category,
          createdBy: createdBy ? createdBy.username : '',
          url: `/quiz/${_id}`,
          actionText: 'Play quiz',
        })}
        `
}
