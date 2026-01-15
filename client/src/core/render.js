export function render(route) {
  const app = document.querySelector('#app')

  app.innerHTML = /* html */ `
    <div class="main-layout">      
      <main-nav></main-nav>
      <div id="view">${route.view()}</div>
    </div>
  `
}
