import { WebComponentConstructorBase } from '../core/utils.js'
import './QuizCard.js'

const template = document.createElement('template')
template.innerHTML = /* html */ `  
  <article class="quiz-card">
    <h2 class="quiz-title"></h2>
    <p class="quiz-category"></p>
    <p class="quiz-description"></p>
    <p class="quiz-created-by"></p>
    <a href="" class="quiz-link sm">Play Quiz</a>
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
      { selector: '.quiz-link', attribute: 'url', prop: 'href' },
      { selector: '.quiz-link', attribute: 'link-text' },
    ]

    content.forEach(({ selector, attribute, prop }) => {
      const el = this.shadowRoot.querySelector(selector)
      const value = this.getAttribute(attribute)

      if (!el || !value) return

      if (prop === 'href') {
        el.setAttribute('href', value)
      } else {
        el.textContent = value
      }
    })
  }
}

window.customElements.define('quiz-card', QuizCard)
