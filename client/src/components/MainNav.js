import { WebComponentConstructorBase } from '../core/utils.js'
import { navigate } from '../router/index.js'

const template = document.createElement('template')

template.innerHTML = /* html */ `
  <nav class="main-nav">
  </nav>
`
export default class MainNav extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template, [
      '/styles/components/main-nav.css',
    ])

    const currentPath = window.location.pathname
    const isCurrentPath = (path) => (currentPath === path ? 'active' : '')

    const container = this.shadowRoot.querySelector('.main-nav')
    container.innerHTML = [
      { label: 'Home', path: '/' },
      // { label: 'My quizzes', path: '/my-quizzes' },
      // { label: 'Sign In', path: '/sign-in', classes: 'ghost secondary' },
      { label: 'Sign Up', path: '/sign-up', classes: 'ghost' },
    ]
      .map(
        ({ label, path, classes }) => /*html*/ `
        <a href="${path}" data-link data-path="${path}"
           class="${isCurrentPath(path)} ${classes || ''}">
          ${label}
        </a>
      `
      )
      .join('')
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]')
      if (!link) return

      e.preventDefault()
      navigate(link.getAttribute('href'))
    })
  }
}

window.customElements.define('main-nav', MainNav)
