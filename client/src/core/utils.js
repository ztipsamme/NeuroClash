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

export const toCamelCase = (str) =>
  str
    .toLowerCase()
    .split(/[\s-_]+/)
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export const toNormal = (str) =>
  str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const addStylesheet = (id, stylesheet) => {
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `/styles${stylesheet}`
  document.head.appendChild(link)
}
