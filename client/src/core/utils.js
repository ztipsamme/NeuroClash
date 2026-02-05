export const applyStyles = (shadowRoot, stylesheets = []) => {
  stylesheets.forEach((s) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = s
    shadowRoot.appendChild(link)
  })
}

export const WebComponentConstructorBase = (component, template, styles) => {
  component.attachShadow({ mode: 'open' })
  applyStyles(component.shadowRoot, styles)
  component.shadowRoot.appendChild(template.content.cloneNode(true))
}

export const Icon = (iconName) => {
  const icon = lucide.createElement(lucide[iconName])
  return icon.outerHTML
}
