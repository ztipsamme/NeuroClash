import { createPlayableQuiz, getQuizById } from '../services/quizService.js'

const landing = /*html*/ `
      <h1 id="quiz-title">Loading quiz...</h1>
      <p id="quiz-description"></p>
      <p id="quiz-meta"></p>
      <button id="play-quiz" class="sm">Start Quiz</button>
      <div>
        <button class="button ">primary</button>
        <button class="button primary">primary</button>
        <button class="button secondary">secondary</button>
        <button class="button success">success</button>
        <button class="button danger">danger</button>
        <button class="button ghost">ghost</button>
        <a href="#" class="button">a</>
        <a href="#" class="button ghost">a ghost</>
        <a href="#" class="">link</>
      <div>
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
  if (!document.getElementById('quiz-css')) {
    const link = document.createElement('link')
    link.id = 'quiz-css'
    link.rel = 'stylesheet'
    link.href = '/styles/components/quiz.css' // sökväg till din CSS-fil
    document.head.appendChild(link)
  }

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
  const quiz = await createPlayableQuiz(id)
  if (!quiz) return

  document.querySelector('#quiz-title').textContent = `Play Quiz: ${quiz.title}`

  const timer = document.querySelector('#quiz-timer')
  const form = document.querySelector('#quiz-play-form')
  const statementEl = form.querySelector('.question-statement')
  const answers = form.querySelector('.answers')
  let currentQuestion = null

  const renderQuestion = () => {
    currentQuestion = quiz.getCurrentQuestion()

    if (!currentQuestion) return

    statementEl.textContent = currentQuestion.Statement
    answers.innerHTML = currentQuestion.Answers.map(
      (answer, idx) =>
        `<button type="button" data-index="${idx}" class="answer ghost">${answer.Text}</button>`
    ).join('')

    quiz.startTimer(
      (seconds) => (timer.textContent = `Time: ${seconds}s`),
      () => lockAndResolveQuestion()
    )
  }

  renderQuestion()

  answers.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn || btn.disabled) return

    lockAndResolveQuestion(btn)
  })

  const lockAndResolveQuestion = (clickedBtn = null) => {
    quiz.stopTimer?.()

    const correctIdx = currentQuestion.Answers.findIndex((a) => a.IsCorrect)
    const buttons = answers.querySelectorAll('button')
    const correctBtn = buttons[correctIdx]

    if (clickedBtn) {
      const isCorrect = quiz.IsCorrect(Number(clickedBtn.dataset.index))
      clickedBtn.classList.add(isCorrect ? 'correct' : 'incorrect')
      clickedBtn.classList.remove('ghost')
      correctBtn.classList.add('correct')
    } else {
      buttons.forEach((b) => {
        b.classList.add('incorrect')
        b.classList.remove('ghost')
        correctBtn.classList.add('correct')
        correctBtn.classList.remove('incorrect')
      })
    }

    buttons.forEach((b) => (b.disabled = true))

    setTimeout(() => {
      quiz.result()
      renderQuestion()
    }, 800)
  }
}
