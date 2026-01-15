import { WebComponentConstructorBase } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { isSignedIn, signOut } from '../services/userService.js'

const template = document.createElement('template')

template.innerHTML = /* html */ `
  <nav id="main-nav">
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

    const container = this.shadowRoot.querySelector('#main-nav')
    const nav = [
      { label: 'Home', path: '/' },
      // { label: 'My quizzes', path: '/my-quizzes' },
      {
        label: 'Sign In',
        path: '/sign-in',
        classes: 'ghost secondary',
        hidden: isSignedIn(),
      },
      {
        label: 'Sign Up',
        path: '/sign-up',
        classes: 'ghost',
        hidden: isSignedIn(),
      },
    ]
      .map(
        ({ label, path, classes, hidden }) => /*html*/ `
        <a href="${path}" data-link data-path="${path}"
           class="${isCurrentPath(path)} ${classes || ''}"
            ${hidden ? 'hidden' : ''}>
          ${label}
        </a>
      `
      )
      .join('')

    container.innerHTML = /* html */ `
      ${nav}
      ${
        isSignedIn()
          ? '<button class="md ghost secondary">Sign Out</button>'
          : ''
      }
    `
  }

  connectedCallback() {
    const links = this.shadowRoot.querySelectorAll('a')
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        navigate(link.getAttribute('href'))
      })
    })

    const signOutButton = this.shadowRoot.querySelector('button')
    if (signOutButton) {
      signOutButton.addEventListener('click', (e) => {
        e.preventDefault()
        signOut()
        navigate('/sign-in')
      })
    }
  }
}

window.customElements.define('main-nav', MainNav)
