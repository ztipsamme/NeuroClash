import { Icon, WebComponentConstructorBase } from '../core/utils.js'
import { getQuizzes } from '../services/quizService.js'

const template = document.createElement('template')
template.innerHTML = /* html */ `
  <section class="quiz-list"></section>
`

export default class QuizList extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template)
    this.pencil = Icon('Pencil')
  }

  async connectedCallback() {
    const quizzes = await getQuizzes()
    this.render(quizzes)
  }

  render(quizzes) {
    const container = this.shadowRoot.querySelector('.quiz-list')
    const url = window.location.pathname.includes('/my-quizzes')

    container.innerHTML = quizzes
      .map(
        (q) => /* html */ `
      <quiz-card
        title="${q.title}"
        description="${q.description}"
        category="${q.category}"
        createdBy="${q.createdBy ? q.createdBy.username : ''}"
        url="${url ? `/my-quizzes/edit/${q._id}` : `/quiz/${q._id}`}"
        dialog="${url ? 'Edit quiz' : 'Play quiz'}"
        >
      </quiz-card>
    `
      )
      .join('')
  }
}

window.customElements.define('quiz-list', QuizList)
