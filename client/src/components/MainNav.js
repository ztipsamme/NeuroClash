import { Icon, WebComponentConstructorBase } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { getCurrentUser, signOut } from '../services/userService.js'

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

    this.mainNav = this.shadowRoot.querySelector('#main-nav')
    this.authNav = this.shadowRoot.querySelector('#auth-nav')

    this.currentPath = window.location.pathname
    this.isCurrentPath = (path) => (this.currentPath === path ? 'active' : '')

    this.mainLinks = [
      { label: 'Home', icon: Icon('Home'), path: '/' },
      { label: 'Create Quiz', icon: Icon('Home'), path: '/create-quiz' },
    ]

    this.authLinks = [
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

    this.mainNav.innerHTML = this.renderLinks(
      this.mainLinks,
      this.isCurrentPath
    )
  }

  async connectedCallback() {
    const userResult = await getCurrentUser()
    if (userResult.ok) {
      this.authNav.innerHTML = `<button class="ghost secondary">Sign Out</button>`
    } else {
      this.authNav.innerHTML = this.renderLinks(
        this.authLinks,
        this.isCurrentPath
      )
    }

    this.shadowRoot.addEventListener('click', async (e) => {
      const link = e.target.closest('[data-link]')
      if (link) {
        e.preventDefault()
        navigate(link.getAttribute('href'))
      }

      const btn = e.target.closest('button')
      if (btn) {
        await signOut()
        navigate('/sign-in')
      }
    })
  }

  renderLinks(links, isCurrentPath) {
    return links
      .map(
        ({ label, icon, path, classes }) => /* html */ `
          <a href="${path}" data-link
             class="${isCurrentPath(path)} ${classes || 'secondary'}">
            ${icon ? `${icon} ` : ''}${label}
          </a>
        `
      )
      .join('')
  }
}

window.customElements.define('main-nav', MainNav)
