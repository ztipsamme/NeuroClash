import { navigate } from '../router/index.js'
import { createQuiz } from '../services/quizService.js'
import { getCurrentUser } from '../services/userService.js'
import '../components/QuizDataForm.js'

export default function CreateQuiz() {
  queueMicrotask(() => init())

  return /*html*/ `
    <div class="split-view create-quiz-view">
      <header id="header" class="header">
        <div>
        <h1 class="view-header">Loading Create Quiz...</h1>
        <p class="description">Create your quiz. Fill in all fields and add between 3 to 10 questions.</p>
        </div>
      </header>
      <quiz-data-form></quiz-data-form>
    </div>
  `
}

const init = async () => {
  const header = document.querySelector('#header')
  header.querySelector('.view-header').textContent = `Create Quiz`

  const formEl = document.querySelector('quiz-data-form')

  formEl.addEventListener('formSubmit', async (e) => {
    const data = e.detail
    const user = await getCurrentUser()
    if (!user.data) return

    data.meta.createdBy = user.data.userId
    data.questions.forEach((q) => (q.createdBy = user.data.userId))

    const res = await createQuiz(data)
    if (!res.ok) {
      formEl.error.hidden = false
      formEl.error.textContent = res.data.message
      return
    }

    navigate('/')
  })
}
