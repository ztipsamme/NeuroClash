import { render } from '../core/render.js'
import { getCurrentUser } from '../services/userService.js'
import NotFound from '../views/NotFound.js'
import { routes } from './routes.js'

export async function initRouter() {
  window.addEventListener('popstate', handleRoute)
  await handleRoute()
}

async function handleRoute() {
  const path = window.location.pathname

  for (const route of routes) {
    const params = matchRoute(route.path, path)

    if (params) {
      const user = await getCurrentUser()
      console.log({ user: user })
      if (route.isProtected && !user.ok) {
        navigate('/sign-in')
        return
      }

      render(route, params)
      return
    }
  }

  render({ view: NotFound })
}

export function navigate(url) {
  history.pushState(null, null, url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function matchRoute(routePath, urlPath) {
  const routePaths = routePath.split('/')
  const urlPaths = urlPath.split('/')

  if (routePaths.length !== urlPaths.length) return null

  const params = {}

  for (let i = 0; i < routePaths.length; i++) {
    const route = routePaths[i]
    const url = urlPaths[i]

    if (route.startsWith(':')) {
      const key = route.slice(1)
      params[key] = url
    } else if (route !== url) {
      return null
    }
  }

  return params
}
