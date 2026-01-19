import { WebComponentConstructorBase } from '../core/utils.js'
import { getQuizzes } from '../services/quizService.js'

const template = document.createElement('template')
template.innerHTML = /* html */ `
  <section class="quiz-list"></section>
`

export default class QuizList extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template)
  }

  async connectedCallback() {
    const quizzes = await getQuizzes()
    this.render(quizzes)
  }

  render(quizzes) {
    const container = this.shadowRoot.querySelector('.quiz-list')
    container.innerHTML = quizzes
      .map(
        (q) => /* html */ `
      <quiz-card
        title="${q.Title}"
        description="${q.Description}"
        category="${q.Category}"
        created-by="${q.CreatedBy.Username}"
        url="/quiz/${q._id}">
      </quiz-card>
    `
      )
      .join('')
  }
}

window.customElements.define('quiz-list', QuizList)
