import { createQuiz, getQuizById } from '../services/quizService.js'

const landing = /*html*/ `
      <h1 id="quiz-title">Loading quiz...</h1>
      <p id="quiz-description"></p>
      <p id="quiz-meta"></p>
      <button id="play-quiz" class="sm">Start Quiz</button>
      `

const play = /*html*/ `
      <h1 id="quiz-title">Loading quiz...</h1>

      <span id="quiz-timer"></span>

      <form id="quiz-play-form">
        <p class="question-statement"></p>
        <div class="answers"></div>
      </form>
      `

export default function Quiz({ id }) {
  queueMicrotask(() => init(id))

  return /* html */ `
    <main id="quiz-view">
    </main>
  `
}

const init = async (id) => {
  try {
    const quiz = await getQuizById(id)

    const quizView = document.querySelector('#quiz-view')
    quizView.innerHTML = landing

    document.querySelector('#quiz-title').textContent = `Landing: ${quiz.Title}`
    document.querySelector('#quiz-description').textContent = quiz.Description
    document.querySelector('#quiz-meta').textContent =
      `Created by ${quiz.CreatedBy.Username}`

    document.querySelector('#play-quiz').addEventListener('click', () => {
      quizView.innerHTML = play
      PlayQuiz(id)
    })
  } catch (err) {
    document.querySelector('#quiz-view').innerHTML = '<p>Quiz not found</p>'
  }
}

const PlayQuiz = async (id) => {
  const quiz = await createQuiz(id)
  if (!quiz) return

  document.querySelector('#quiz-title').textContent = `Play Quiz: ${quiz.title}`

  const timer = document.querySelector('#quiz-timer')
  const form = document.querySelector('#quiz-play-form')
  const statementEl = form.querySelector('.question-statement')
  const answers = form.querySelector('.answers')

  const renderQuestion = (question) => {
    if (!question) return

    statementEl.textContent = question.Statement
    answers.innerHTML = question.Answers.map(
      (answer, idx) =>
        `<button type="button" data-index="${idx}" class="sm">${answer.Text}</button>`
    ).join('')

    quiz.startTimer(
      (seconds) => {
        timer.textContent = `Time: ${seconds}s`
      },
      () => {
        renderQuestion(quiz.answer())
      }
    )
  }

  renderQuestion(quiz.getCurrentQuestion())

  answers.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return

    renderQuestion(quiz.answer(Number(btn.dataset.index)))
  })
}
