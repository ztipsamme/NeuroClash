import '../components/QuizDataForm.js'
import { handleQuizDataForm, QuizDataForm } from '../components/QuizDataForm.js'
import { addStylesheet } from '../core/utils.js'
import {
  getQuizWithQuestionsById,
  updateQuiz,
} from '../services/quizService.js'

export default function EditQuiz({ id }) {
  addStylesheet('quiz-form-css', '/components/quiz-form.css')

  queueMicrotask(() => init(id))

  return /*html*/ `
    <div class="split-view edit-quiz-view">
      <header id="header" class="header">
        <div>
        <h1 class="view-header">Loading Edit Quiz...</h1>
        <p class="description">Edit your quiz. Editing will not effect completed playthroughs of the quiz. Fill in all fields and add between 3 to 10 questions.</p>
        </div>
      </header>
       ${QuizDataForm()}
    </div>
  `
}

const init = async (id) => {
  const quiz = await getQuizWithQuestionsById(id)
  if (!quiz) return

  document.querySelector('.view-header').textContent =
    `Edit Quiz: ${quiz.title}`

  const onSubmit = async ({ meta, questions, deletedQuestionIds }) => {
    const res = await updateQuiz({ meta, questions, deletedQuestionIds })
    if (!res.ok) {
      return { errorMessage: res.data?.message }
    }
  }

  const { addQuestion } = handleQuizDataForm(
    document.querySelector('.edit-quiz-view'),
    onSubmit,
    quiz
  )
}
