import { Icon } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { getCurrentUser, signOut } from '../services/userService.js'

export default function MainLayout(content) {
  queueMicrotask(() => init())

  return /* html */ `
    <div class="main-layout">  
        <h1 class="logo">NuroClash</h1>  
        <aside class="main-nav">
        <button id="menu-btn" class="menu-btn">menu</button>

        <div class="main-nav-content">
            <nav id="view-nav"></nav>
            <nav id="auth-nav"></nav>
        </div>
        </aside>

        <div id="view" class="main-content">${content}</div>
    </div>`
}

const init = async () => {
  const layout = document.querySelector('.main-layout')
  const nav = document.querySelector('.main-nav')
  const menuBtn = nav.querySelector('#menu-btn')

  renderViewLinks()
  renderAuthLinks()

  menuBtn.addEventListener('click', (e) => {
    const layoutClasses = layout.classList
    const openNav = 'nav-open'

    if (layoutClasses.contains(openNav)) {
      layoutClasses.remove(openNav)
    } else [layoutClasses.add(openNav)]
  })
}

const renderLinks = (links) => {
  const currentPath = window.location.pathname
  const isCurrentPath = (path) => (currentPath === path ? 'active' : '')

  return links
    .map(
      ({ label, icon, path, classes }) => /* html */ `
          <a href="${path}"
             class="${isCurrentPath(path)} ${classes || 'secondary'}">
             ${icon ? `${icon} ` : ''}
             <span>${label}</span>
          </a>
        `
    )
    .join('')
}

const renderViewLinks = () => {
  const mainLinks = [
    { label: 'Home', icon: Icon('Home'), path: '/' },
    { label: 'My Quizzes', icon: Icon('Archive'), path: '/my-quizzes' },
  ]

  document.querySelector('#view-nav').innerHTML = renderLinks(mainLinks)
}

const renderAuthLinks = async () => {
  const userResult = await getCurrentUser()

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

  const authNav = document.querySelector('#auth-nav')

  if (userResult.ok) {
    authNav.innerHTML = /*html*/ `<button id="sign-out" class="ghost secondary" >Sign Out</button>`

    authNav.querySelector('#sign-out').addEventListener('click', async () => {
      await signOut()
      navigate('/sign-in')
    })
  } else {
    authNav.innerHTML = renderLinks(authLinks)
  }
}
