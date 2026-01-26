import MainLayout from '../layouts/MainLayout.js'

export function render(route, params = {}) {
  const app = document.querySelector('#app')

  app.innerHTML = MainLayout(route.view(params))
}
