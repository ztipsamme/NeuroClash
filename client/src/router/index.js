import { render } from '../core/render.js'
import { isSignedIn } from '../services/userService.js'
import NotFound from '../views/NotFound.js'
import { routes } from './routes.js'

export function initRouter() {
  window.addEventListener('popstate', handleRoute)
  handleRoute()
}

function handleRoute() {
  const path = window.location.pathname
  const route = routes.find((r) => r.path === path) || {
    view: NotFound,
  }

  if (route.isProtected && !isSignedIn()) {
    alert('You must be signed in to view this page.')
    navigate('/sign-in')
    return
  }

  render(route)
}

export function navigate(url) {
  history.pushState(null, null, url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
