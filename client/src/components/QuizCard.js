import { WebComponentConstructorBase } from '../core/utils.js'
import './QuizCard.js'

const template = document.createElement('template')
template.innerHTML = /* html */ `  
  <article class="quiz-card">
    <h2 class="quiz-title"></h2>
    <p class="quiz-category"></p>
    <p class="quiz-description"></p>
    <p class="quiz-created-by"></p>
    <button class="sm">Start Quiz</button>
  </article>
`
export default class QuizCard extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template)
  }

  static get observedAttributes() {
    return ['title', 'description']
  }

  attributeChangedCallback() {
    const content = [
      { selector: '.quiz-title', attribute: 'title' },
      { selector: '.quiz-category', attribute: 'category' },
      { selector: '.quiz-description', attribute: 'description' },
      { selector: '.quiz-created-by', attribute: 'createdBy' },
    ]

    content.forEach((e) => {
      this.shadowRoot.querySelector(e.selector).textContent = this.getAttribute(
        e.attribute
      )
    })
  }
}

window.customElements.define('quiz-card', QuizCard)
