import { navigate } from '../router/index.js'
import { createQuiz } from '../services/quizService.js'
import { getCurrentUser } from '../services/userService.js'
import '../components/QuizDataForm.js'

export default function CreateQuiz() {
  queueMicrotask(() => {
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
  })

  return /*html*/ `
    <div>
      <h1>Create Quiz</h1>
      <quiz-data-form></quiz-data-form>
    </div>
  `
}
