import { Icon, WebComponentConstructorBase } from '../core/utils.js'
import './QuizCard.js'

const template = document.createElement('template')
template.innerHTML = /* html */ `  
  <a href="" class="quiz-card card quiz-link">
    <header>
      <h3 class="quiz-title"></h3>
      <p class="quiz-category"></p>
    </header>
    <p class="quiz-description"></p>

    <footer>
      <p class="quiz-created-by-container">
        <span>Created by</span>
        <span class="quiz-created-by"></span>
      </p>
      </footer>
    <div class="quiz-dialog"></div>
  </a>
`
export default class QuizCard extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template, [
      '/styles/components/quiz-card.css',
    ])
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
      { selector: '.quiz-dialog', attribute: 'dialog' },
    ]

    content.forEach(({ selector, attribute, prop }) => {
      const el = this.shadowRoot.querySelector(selector)
      const value = this.getAttribute(attribute)
      if (selector === '.quiz-created-by' && !value) {
        const createdBy = this.shadowRoot.querySelector(
          '.quiz-created-by-container'
        )

        createdBy.remove()
      }

      if (!el || !value) return

      if (prop === 'href') {
        el.setAttribute('href', value)
      } else {
        el.textContent = value
      }
    })
  }

  connectedCallback() {
    const card = this.shadowRoot.querySelector('.quiz-card')

    card.addEventListener('mouseover', (e) => {
      card.show()
    })
  }
}

window.customElements.define('quiz-card', QuizCard)
