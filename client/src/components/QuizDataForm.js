import { getCurrentUser } from '../services/userService.js'
import { deleteQuiz } from '../services/quizService.js'
import { FormGroup } from './FormGroup.js'
import { QuestionCard } from './QuestionCard.js'
import { navigate } from '../router/index.js'

export function QuizDataForm() {
  return /*html*/ `
    <form class="quiz-data-form center">
      <fieldset class="card">
        <legend>Title and description</legend>
        ${FormGroup({ label: 'Title', name: 'title', description: 'Give your quiz a title.' })}
        ${FormGroup({ label: 'Description', name: 'description', description: 'Describe what your quiz is about.' })}
        ${FormGroup({ label: 'Category', name: 'category', description: 'What category does your quiz belong to?' })}
      </fieldset>

      <section>
        <ul class="question-cards"></ul>
        <button type="button" class="secondary" id="add-btn">Add question</button>    
      </section>

      <p class="error-message" hidden></p>

      <div class="submit-and-delete">
        <button type="submit">Submit</button>
        <button slot="delete-quiz" class="button delete-quiz-button danger">
          Delete quiz
        </button>
      </div>
    </form>
  `
}

export const handleQuizDataForm = (container, onSubmit, quiz = null) => {
  const isEdit = Boolean(quiz)
  const form = container.querySelector('.quiz-data-form')
  const questionCards = form.querySelector('.question-cards')
  const addBtn = form.querySelector('#add-btn')
  const questionList = form.querySelector('.question-cards')
  const error = form.querySelector('.error-message')
  const deleteQuizBtn = form.querySelector('.delete-quiz-button')

  let deletedQuestionIds = []
  let questions = []

  const updateUI = () => {
    const cards = [...questionCards.children]
    cards.forEach((card, i) => {
      card.querySelector('legend').textContent = `Question ${i + 1}`
      card.querySelector('[data-delete]').disabled = cards.length <= 3
    })
    addBtn.disabled = cards.length >= 10
  }

  const addQuestion = () => {
    questionList.insertAdjacentHTML('beforeend', QuestionCard(questions.length))
    questions.push({})
    updateUI()
  }

  const onDelete = (e) => {
    const btn = e.target.closest('[data-delete]')
    if (!btn) return
    const card = btn.closest('.card')
    if (card.dataset.id) deletedQuestionIds.push(card.dataset.id)
    card.remove()
    questions.pop()
  }

  const setMeta = () => {
    form.querySelector('[name="title"]').value = quiz.title
    form.querySelector('[name="description"]').value = quiz.description
    form.querySelector('[name="category"]').value = quiz.category
    form.querySelector('[type="submit"]').textContent = 'Update quiz'
  }

  const setQuestions = () => {
    questionCards.innerHTML = ''
    deletedQuestionIds = []

    questions.forEach((q) => {
      addQuestion()
      const card = questionCards.lastElementChild

      card.dataset.id = q._id

      card.querySelector('[name="statement"]').value = q.statement
      card.querySelector('[name="correct"]').value = q.answers.find(
        (a) => a.isCorrect
      ).text

      const incorrect = card.querySelectorAll('[name="incorrect"]')
      q.answers
        .filter((a) => !a.isCorrect)
        .forEach((a, i) => (incorrect[i].value = a.text))
    })
  }

  const setErrorMessage = (errorMessage) => {
    if (errorMessage) {
      error.hidden = false
      error.textContent = errorMessage
    }
  }

  if (isEdit) {
    questions = quiz.questions
    setMeta()
    setQuestions()
    updateUI()
  }

  addBtn.addEventListener('click', addQuestion)

  questionList.addEventListener('click', (e) => {
    onDelete(e)
    updateUI()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const user = await getCurrentUser()
    if (!user.data) return

    const formData = new FormData(form)
    const meta = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      createdBy: user.data.userId,
    }
    if (isEdit) meta._id = quiz?._id

    const collectedQuestions = [...questionList.children].map((card) => {
      const incorrect = card.querySelectorAll('[name="incorrect"]')

      const question = {
        statement: card.querySelector('[name="statement"]').value,
        category: meta.category,
        createdBy: user.data.userId,
        answers: [
          {
            text: card.querySelector('[name="correct"]').value,
            isCorrect: true,
          },
          ...[...incorrect].map((i) => ({ text: i.value, isCorrect: false })),
        ],
      }

      if (isEdit) question._id = card.dataset.id

      return question
    })

    if (onSubmit) {
      const data = await onSubmit({
        meta,
        questions: collectedQuestions,
        deletedQuestionIds,
      })

      setErrorMessage(data?.errorMessage)
    }
  })

  deleteQuizBtn.addEventListener('click', async () => {
    const res = await deleteQuiz(quiz._id)

    if (!res.ok) {
      setErrorMessage(data?.errorMessage)
      return
    }
    navigate('/my-quizzes')
  })

  return { addQuestion }
}
