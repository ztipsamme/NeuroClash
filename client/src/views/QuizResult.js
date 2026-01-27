import { getQuizById, getQuizResult } from '../services/quizService.js'

export default function QuizResult({ id }) {
  queueMicrotask(() => init(id))

  return /* html */ `
    <div id="quiz-result">
      <h1 id="quiz-title">Loading quiz...</h1>

      <table>
        <tr>
          <th>Time</th>
          <th>Correct</th>
          <th>Incorrect</th>
        </tr>
        <tr>
          <th id="quiz-time"></th>
          <th id="quiz-correct"></th>
          <th id="quiz-incorrect"></th>
        </tr>
      </table>
      <a href="/">Back to Home</a>
    </div>
  `
}

const init = async (id) => {
  try {
    const quiz = await getQuizById(id)
    const result = await getQuizResult(id)

    document.querySelector('#quiz-title').textContent = `Result: ${quiz.title}`

    document.querySelector('#quiz-time').textContent = result.totalTimePlayed
    document.querySelector('#quiz-correct').textContent = result.correctAnswers
    document.querySelector('#quiz-incorrect').textContent =
      result.incorrectAnswers
  } catch (err) {
    document.querySelector('#quiz-result').innerHTML = '<p>Quiz not found</p>'
  }
}
