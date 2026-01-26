export default function SignIn() {
  if (!document.querySelector('.sign-in-view')) {
    const link = document.createElement('link')
    link.id = 'sign-in-view'
    link.rel = 'stylesheet'
    link.href = '/styles/components/sign-in-and-sign-up.css'
    document.head.appendChild(link)
  }

  queueMicrotask(() => {
    const img = document.querySelector('.auth-image')

    const updateImage = () => {
      img.src =
        window.innerWidth <= 900
          ? '/public/man-horizontal.svg'
          : '/public/man-vertical.svg'
    }

    updateImage()
    window.addEventListener('resize', updateImage)
  })

  return /* html */ `
  <main id="sign-in-view" class="sign-in-view split-view center-content">
    <img alt="Man illustration" class="auth-image"/>

    <div class="sign-in-content">
      <h1><strong>Sign in</strong> to play some amazing quizzes!</h1>
      <sign-in-form></sign-in-form>
      <p>No account? No worries, <a href="/sign-up" class=" secondary">sign up here!</a></p>
    </div>
  </main>`
}
