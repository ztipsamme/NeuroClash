import { Icon, WebComponentConstructorBase } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { isSignedIn, signOut } from '../services/userService.js'

const template = document.createElement('template')

template.innerHTML = /* html */ `
  <aside>
    <div class="logo">NeuroClash</div>
    <nav id="main-nav"></nav>
    <nav id="auth-nav"></nav>
  </aside>
`
export default class MainNav extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template, [
      '/styles/components/main-nav.css',
    ])

    const currentPath = window.location.pathname
    const isCurrentPath = (path) => (currentPath === path ? 'active' : '')

    const mainNav = this.shadowRoot.querySelector('#main-nav')
    const authNav = this.shadowRoot.querySelector('#auth-nav')

    const mainLinks = [{ label: 'Home', icon: Icon('Home'), path: '/' }]

    const authLinks = [
      {
        label: 'Sign In',
        path: '/sign-in',
        classes: 'button ghost secondary',
      },
      {
        label: 'Sign Up',
        path: '/sign-up',
        classes: 'button ghost',
      },
    ]

    mainNav.innerHTML = this.renderLinks(mainLinks, isCurrentPath)

    if (isSignedIn()) {
      authNav.insertAdjacentHTML(
        'beforeend',
        `<button class="ghost secondary">Sign Out</button>`
      )
    } else {
      authNav.innerHTML = this.renderLinks(authLinks, isCurrentPath)
    }
  }

  renderLinks(links, isCurrentPath) {
    return links
      .map(
        ({ label, icon, path, classes, hidden }) => /* html */ `
          <a href="${path}" data-link
             class="${isCurrentPath(path)} ${classes || 'secondary'}"
             hidden>
            ${icon ? `${icon} ` : ''}${label}
          </a>
        `
      )
      .join('')
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]')
      if (link) {
        e.preventDefault()
        navigate(link.getAttribute('href'))
      }

      const btn = e.target.closest('button')
      if (btn) {
        signOut()
        navigate('/sign-in')
      }
    })
  }
}

window.customElements.define('main-nav', MainNav)
