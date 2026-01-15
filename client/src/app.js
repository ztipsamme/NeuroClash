import './components/index.js'
import { initEvents } from './core/events.js'
import { initRouter } from './router/index.js'

const initApp = async () => {
  initEvents()
  initRouter()
}

document.addEventListener('DOMContentLoaded', initApp())
