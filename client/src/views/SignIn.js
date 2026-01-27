import { addStylesheet } from '../utils.js'

export default function SignIn() {
  addStylesheet(
    '.sign-in-view',
    'sign-in-view',
    '/components/sign-in-and-sign-up.css'
  )

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
  <div id="sign-in-view" class="sign-in-view split-view center-content">
    <img alt="Man illustration" class="auth-image"/>

    <div class="sign-in-content">
      <h1><strong>Sign in</strong> to play some amazing quizzes!</h1>
      <sign-in-form></sign-in-form>
      <p>No account? No worries, <a href="/sign-up" class=" secondary">sign up here!</a></p>
    </div>
  </div>`
}
