import { navigate } from '../router/index.js'
import { createQuiz } from '../services/quizService.js'
import { getCurrentUser } from '../services/userService.js'
import '../components/QuizDataForm.js'
import { addStylesheet } from '../utils.js'
import { handleQuizDataForm, QuizDataForm } from '../components/QuizDataForm.js'

export default function CreateQuiz() {
  addStylesheet('quiz-form-css', '/components/quiz-form.css')
  queueMicrotask(() => init())

  return /*html*/ `
    <div class="split-view create-quiz-view">
      <header id="header" class="header">
        <div>
        <h1 class="view-header">Loading Create Quiz...</h1>
        <p class="description">Create your quiz. Fill in all fields and add between 3 to 10 questions.</p>
        </div>
      </header>
      ${QuizDataForm()}
    </div>
  `
}

const init = async () => {
  document.querySelector('.view-header').textContent = `Create Quiz`

  const onSubmit = async ({ meta, questions, deletedQuestionIds }) => {
    const res = await createQuiz({ meta, questions })
    if (!res.ok) {
      return { errorMessage: res.data?.message }
    }

    navigate('/')
  }

  const { addQuestion } = handleQuizDataForm(
    document.querySelector('.create-quiz-view'),
    onSubmit
  )

  for (let i = 0; i < 3; i++) addQuestion()
}
