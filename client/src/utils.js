export const addStylesheet = (id, stylesheet) => {
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `/styles${stylesheet}`
  document.head.appendChild(link)
}
