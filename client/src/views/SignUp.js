import { addStylesheet } from '../core/utils.js'

export default function SignUp() {
  addStylesheet(
    'sign-in-and-sign-up-css',
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
  <div id="sign-up-view" class="sign-up-view split-view center-content bleed-content">
    <img alt="Man illustration" class="auth-image"/>

    <div class="sign-up-content">
      <h1><strong>Sign in</strong> to play some amazing quizzes!</h1>
      <sign-up-form></sign-up-form>
      <p>Already have an account? Welcome back friend, <a href="/sign-in" class=" secondary">sign in here!</a></p>
    </div>
  </div>`
}
