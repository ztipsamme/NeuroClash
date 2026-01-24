import { WebComponentConstructorBase } from '../core/utils.js'
import { FormGroup } from './FormGroup.js'
import { QuestionCard } from './QuestionCard.js'

const template = document.createElement('template')
template.innerHTML = /*html*/ `
<form class="quiz-data-form center">
  <fieldset class="card">
    <legend>Title and description</legend>
    ${FormGroup({ label: 'Title', name: 'title', description: 'Give your quiz a title.' })}
    ${FormGroup({ label: 'Description', name: 'description', description: 'Describe what your quiz is about.' })}
    ${FormGroup({ label: 'Category', name: 'category', description: 'What category does your quiz belong to?' })}
  </fieldset>

  <section>
    <ul class="question-cards"></ul>
    <button type="button" id="add-btn" class="secondary">Add question</button>
  </section>

  <p class="errorMessage" hidden></p>
  <button type="submit"><slot name="submit-label">Submit</slot></button>
</form>
`

const MIN_QUESTIONS = 3
const MAX_QUESTIONS = 10

export default class QuizDataForm extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template, [
      '/styles/components/create-quiz.css',
    ])
    this.deletedQuestionIds = []
  }

  connectedCallback() {
    this.form = this.shadowRoot.querySelector('form')
    this.cards = this.shadowRoot.querySelector('.question-cards')
    this.addBtn = this.shadowRoot.querySelector('#add-btn')
    this.error = this.shadowRoot.querySelector('.errorMessage')

    // for (let i = 0; i < MIN_QUESTIONS; i++) this.addQuestion()

    this.addBtn.addEventListener('click', () => this.addQuestion())
    this.cards.addEventListener('click', (e) => this.onDelete(e))
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      const data = this.collectData()
      this.dispatchEvent(
        new CustomEvent('formSubmit', {
          detail: data,
          bubbles: true,
          composed: true,
        })
      )
    })

    this.updateUI()
  }

  collectData() {
    const formData = new FormData(this.form)
    const meta = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
    }

    const questions = [...this.cards.children].map((card) => {
      const incorrect = card.querySelectorAll('[name="incorrect"]')

      return {
        _id: card.dataset.id || undefined,
        statement: card.querySelector('[name="statement"]').value,
        category: meta.category,
        answers: [
          {
            text: card.querySelector('[name="correct"]').value,
            isCorrect: true,
          },
          ...[...incorrect].map((i) => ({ text: i.value, isCorrect: false })),
        ],
      }
    })

    return {
      meta,
      questions,
      deletedQuestionIds: this.deletedQuestionIds,
    }
  }

  setQuestions(questions) {
    // rensa default-cards
    this.cards.innerHTML = ''
    this.deletedQuestionIds = []

    questions.forEach((q) => {
      this.addQuestion()
      const card = this.cards.lastElementChild

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

    this.updateUI()
  }

  addQuestion() {
    if (this.cards.children.length >= MAX_QUESTIONS) return
    this.cards.insertAdjacentHTML(
      'beforeend',
      QuestionCard(this.cards.children.length)
    )
    this.updateUI()
  }

  onDelete(e) {
    const btn = e.target.closest('[data-delete]')
    if (!btn) return
    const card = btn.closest('.card')

    if (card.dataset.id) this.deletedQuestionIds.push(card.dataset.id)

    card.remove()
    this.updateUI()
  }

  updateUI() {
    const cards = [...this.cards.children]
    cards.forEach((card, i) => {
      card.querySelector('legend').textContent = `Question ${i + 1}`
      card.querySelector('[data-delete]').disabled =
        cards.length <= MIN_QUESTIONS
    })
    this.addBtn.disabled = cards.length >= MAX_QUESTIONS
  }
}

window.customElements.define('quiz-data-form', QuizDataForm)
