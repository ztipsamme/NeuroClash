import { createPlayableQuiz, getQuizById } from '../services/quizService.js'
import { addStylesheet } from '../utils.js'

export default function Quiz({ id }) {
  addStylesheet('quiz-css', '/components/quiz.css')

  queueMicrotask(() => init(id))

  return /* html */ `
    <div id="quiz-view" class="quiz-view">
      <div class="quiz-container card">
        <h1 id="quiz-title">Loading quiz...</h1>
        <div class="quiz-content">
          <p id="quiz-created-by" class="quiz-created-by"></p>
          <p id="quiz-description" class="quiz-description"></p>
          <button id="start-quiz-button">Start Quiz</button>
        </div>
      </div>
    </div>
  `
}

const init = async (id) => {
  try {
    const quiz = await getQuizById(id)
    const quizContent = document.querySelector('.quiz-content')
    const startQuizButton = quizContent.querySelector('#start-quiz-button')

    document.querySelector('#quiz-title').textContent = quiz.title
    quizContent.querySelector('#quiz-description').textContent =
      quiz.description
    quizContent.querySelector('#quiz-created-by').textContent =
      `Created by ${quiz.createdBy.username}`

    startQuizButton.addEventListener('click', () => {
      quizContent.innerHTML = /*html */ `
        <span id="quiz-timer" class="quiz-timer"></span>
        <form id="quiz-play-form" class="quiz-play-form">
          <h2 class="question-statement"></h2>
          <div class="answers"></div>
        </form>
      `
      PlayQuiz(id)
    })
  } catch (err) {
    document.querySelector('#quiz-view').innerHTML = '<p>Quiz not found</p>'
  }
}

const PlayQuiz = async (id) => {
  const quiz = await createPlayableQuiz(id)
  if (!quiz) return

  const quizContent = document.querySelector('.quiz-content')
  const timer = quizContent.querySelector('#quiz-timer')
  const form = quizContent.querySelector('#quiz-play-form')
  const statementEl = form.querySelector('.question-statement')
  const answers = form.querySelector('.answers')
  let currentQuestion = null

  quizContent.classList.add('play-quiz-container')

  const renderQuestion = () => {
    currentQuestion = quiz.getCurrentQuestion()

    if (!currentQuestion) return

    statementEl.textContent = currentQuestion.statement
    answers.innerHTML = currentQuestion.answers
      .map(
        (answer, idx) =>
          `<button type="button" data-index="${idx}" class="answer">${answer.text}</button>`
      )
      .join('')

    timer.textContent = 'Time: 00s'

    // quiz.startTimer(
    //   (seconds) => (timer.textContent = `Time: ${seconds}s`),
    //   () => lockAndResolveQuestion()
    // )
  }

  renderQuestion()

  answers.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn || btn.disabled) return

    lockAndResolveQuestion(btn)
  })

  const lockAndResolveQuestion = (clickedBtn = null) => {
    quiz.stopTimer?.()

    const correctIdx = currentQuestion.answers.findIndex((a) => a.isCorrect)
    const buttons = answers.querySelectorAll('button')
    const correctBtn = buttons[correctIdx]

    if (clickedBtn) {
      const isCorrect = quiz.isCorrect(Number(clickedBtn.dataset.index))
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
      // renderQuestion()
    }, 800)
  }
}
