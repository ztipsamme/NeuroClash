import '../components/QuizDataForm.js'
import { navigate } from '../router/index.js'
import {
  deleteQuiz,
  getQuizWithQuestionsById,
  updateQuiz,
} from '../services/quizService.js'
import { addStylesheet } from '../utils.js'

export default function EditQuiz({ id }) {
  addStylesheet(
    '.edit-quiz-view',
    'edit-quiz-view',
    '/components/quiz-form.css'
  )
  queueMicrotask(() => init(id))

  return /*html*/ `
    <div class="split-view edit-quiz-view">
      <header id="header" class="header">
        <div>
        <h1 class="view-header">Loading Edit Quiz...</h1>
        <p class="description">Edit your quiz. Editing will not effect completed playthroughs of the quiz. Fill in all fields and add between 3 to 10 questions.</p>
        </div>
      </header>
      <quiz-data-form>
        <button slot="delete-quiz" class="button delete-quiz-button danger">Delete quiz</button>
      </quiz-data-form>
    </div>
  `
}

const init = async (id) => {
  const quiz = await getQuizWithQuestionsById(id)

  if (!quiz) return

  const header = document.querySelector('#header')
  header.querySelector('.view-header').textContent = `Edit Quiz: ${quiz.title}`

  const formEl = document.querySelector('quiz-data-form')

  formEl.shadowRoot.querySelector('[name="title"]').value = quiz.title
  formEl.shadowRoot.querySelector('[name="description"]').value =
    quiz.description
  formEl.shadowRoot.querySelector('[name="category"]').value = quiz.category
  formEl.shadowRoot.querySelector('[type="submit"]').textContent = 'Update quiz'

  formEl.setQuestions(quiz.questions)

  document
    .querySelector('.delete-quiz-button')
    .addEventListener('click', async () => {
      const res = await deleteQuiz(id)

      if (!res.ok) {
        formEl.error.hidden = false
        formEl.error.textContent = res.data.message
        return
      }
      navigate('/my-quizzes')
    })

  formEl.addEventListener('formSubmit', async (e) => {
    const data = e.detail
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
