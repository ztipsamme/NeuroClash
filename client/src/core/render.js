export function render(route, params = {}) {
  const app = document.querySelector('#app')

  app.innerHTML = /* html */ `
    <div class="main-layout">      
      <main-nav></main-nav>
      <div id="view" class="content-layout">${route.view(params)}</div>
    </div>
  `
}
