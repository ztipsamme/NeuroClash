import '../components/QuizDataForm.js'
import { navigate } from '../router/index.js'
import {
  deleteQuiz,
  getQuizWithQuestionsById,
  updateQuiz,
} from '../services/quizService.js'

export default function EditQuiz({ id }) {
  queueMicrotask(() => init(id))

  return /*html*/ `
    <main class="content-layout">
      <h1>Loading Edit Quiz...</h1>
      <quiz-data-form></quiz-data-form>
    </main>
  `
}

const init = async (id) => {
  const quiz = await getQuizWithQuestionsById(id)

  if (!quiz) return

  document.querySelector('h1').textContent = `Edit Quiz: ${id}`

  const formEl = document.querySelector('quiz-data-form')

  formEl.shadowRoot.querySelector('[name="title"]').value = quiz.title
  formEl.shadowRoot.querySelector('[name="description"]').value =
    quiz.description
  formEl.shadowRoot.querySelector('[name="category"]').value = quiz.category
  formEl.shadowRoot.querySelector('[type="submit"]').textContent = 'Update quiz'

  formEl.setQuestions(quiz.questions)

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.className = 'button delete-quiz-button danger'
  deleteButton.textContent = 'Delete quiz'

  deleteButton.addEventListener('click', async () => {
    const res = await deleteQuiz(id)

    if (!res.ok) {
      formEl.error.hidden = false
      formEl.error.textContent = res.data.message
      return
    }
    navigate('/my-quizzes')
  })

  formEl.shadowRoot.append(deleteButton)

  formEl.addEventListener('formSubmit', async (e) => {
    const data = e.detail
    console.log('submit')
    data.meta._id = id

    const res = await updateQuiz(data)

    if (!res.ok) {
      formEl.error.hidden = false
      formEl.error.textContent = res.data.message
      return
    }
    navigate('/my-quizzes')
  })
}
