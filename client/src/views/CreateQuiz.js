import { createQuiz } from '../services/quizService.js'
import { navigate } from '../router/index.js'
import { getCurrentUser } from '../services/userService.js'

const inputField = ({ label, name, description, value = '' }) => /* html */ `
            <label for="${name}">
              <span>${label}*</span>
              <span class="description">${description}</span>
            </label>
            <input type="text" name="${name}" value="${value}"/>
            `

const metaDataFields = [
  { label: 'Title', name: 'title', description: 'Give your quiz a title.' },
  {
    label: 'Description',
    name: 'description',
    description: 'Describe what your quiz is about.',
  },
  {
    label: 'Category',
    name: 'category',
    description: 'What category does your quiz belong to?',
  },
]

const questionDataFields = [
  {
    label: 'Statement',
    name: 'statement',
    description: 'Enter the question.',
  },
  {
    label: 'Correct answer',
    name: 'correct',
    description: 'Enter the correct answer to the question.',
  },
]

const minQuestions = 3
const maxQuestions = 10

export default function CreateQuiz() {
  if (!document.getElementById('quiz-css')) {
    const link = document.createElement('link')
    link.id = 'quiz-css'
    link.rel = 'stylesheet'
    link.href = '/styles/components/create-quiz.css' // sökväg till din CSS-fil
    document.head.appendChild(link)
  }

  queueMicrotask(() => init())

  return /* html */ `
  <main class="content-layout">
    <h1>Create Quiz</h1>
    <form id="create-quiz-form" lass="center">
        <fieldset class="card">  
            <legend>Title and description</legend>   
            ${metaDataFields.map((e) => /*html*/ `<div class="input-container">${inputField(e)}</div>`).join('')}
        </fieldset>

        <section id="create-quiz-form-question">
            <ul class="question-cards"></ul>
            <button type="button" id="add-btn" class="secondary">Add question</button>
        </section>
       
        <p class="errorMessage" hidden="true"></p>
        <button type="submit">Create Quiz</button>
    </form>
    `
}

const init = async () => {
  const form = document.querySelector('#create-quiz-form')
  const questionCards = form.querySelector('.question-cards')
  const addButton = form.querySelector('#add-btn')
  const errMessage = form.querySelector('.errorMessage')

  const getCards = () => questionCards.querySelectorAll('.card')

  const questionFieldset = (idx) => /*html*/ `
        <li class="card">
          <fieldset>
              <legend>Question ${idx + 1}</legend> 

              ${questionDataFields.map((e) => /*html*/ `<div class="input-container">${inputField(e)}</div>`).join('')}

              <div class="input-container">
                  <label for="incorrect">
                    <span>Incorrect answers*</span>
                    <span class="description">Enter all incorrect answers below.</span>
                  </label>

                  <input type="text" name="incorrect" placeholder="Incorrect answer 1"/>
                  <input type="text" name="incorrect" placeholder="Incorrect answer 2"/>
                  <input type="text" name="incorrect" placeholder="Incorrect answer 3"/>
              </div>
              <button type="button" data-delete class="delete-quiz-button">Delete question</button>
          </fieldset>
        </li>`

  const updateAddButton = () => {
    addButton.disabled = getCards().length >= maxQuestions
  }

  const updateDeleteButtons = () => {
    const cards = getCards()

    cards.forEach((card) => {
      const deleteButton = card.querySelector('[data-delete]')
      if (!deleteButton) return

      deleteButton.disabled = cards.length <= minQuestions
    })
  }

  const reindexQuestions = () => {
    getCards().forEach((card, idx) => {
      card.querySelector('legend').textContent = `Question ${idx + 1}`
    })
  }

  const updateUi = () => {
    reindexQuestions()
    updateDeleteButtons()
    updateAddButton()
  }

  for (let i = 0; i < minQuestions; i++) {
    questionCards.insertAdjacentHTML('beforeend', questionFieldset(i))
  }
  updateDeleteButtons()

  questionCards.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('[data-delete]')
    if (!deleteButton) return

    deleteButton.closest('.card').remove()
    updateUi()
  })

  addButton.addEventListener('click', () => {
    questionCards.insertAdjacentHTML(
      'beforeend',
      questionFieldset(getCards().length)
    )

    updateUi()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const user = await getCurrentUser()

    if (!user.data) return
    const userId = user.data.userId

    const meta = {
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      createdBy: userId,
    }

    const cards = Array.from(questionCards.querySelectorAll('.card'))

    const questions = cards.map((card) => {
      const incorrectAnswers = card.querySelectorAll('input[name="incorrect"]')

      const statement = card.querySelector('input[name="statement"]').value
      const answers = [
        {
          text: card.querySelector('input[name="correct"]').value,
          isCorrect: true,
        },
        ...Array.from(incorrectAnswers).map((input) => ({
          text: input.value,
          isCorrect: false,
        })),
      ]

      return {
        statement: statement,
        category: formData.get('category'),
        answers,
        createdBy: userId,
      }
    })

    const quiz = {
      meta,
      questions,
    }

    try {
      const res = await createQuiz(quiz)

      if (!res.ok) {
        errMessage.hidden = false
        errMessage.textContent = res.data.message
        return
      }

      navigate('/')
    } catch (error) {
      errMessage.textContent = 'Server error: ' + error.message
    }
  })
}
