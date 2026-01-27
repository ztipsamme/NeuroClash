export const addStylesheet = (querySelector, id, stylesheet) => {
  if (!document.querySelector(querySelector)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `/styles${stylesheet}`
    document.head.appendChild(link)
  }
}
