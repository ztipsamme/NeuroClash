import { addStylesheet } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { signInUser } from '../services/userService.js'

export default function SignIn() {
  addStylesheet(
    'sign-in-and-sign-up-css',
    '/components/sign-in-and-sign-up.css'
  )

  queueMicrotask(() => init())

  return /* html */ `
  <div id="sign-in-view" class="sign-in-view split-view center-content bleed-content">
    <img alt="Man illustration" class="auth-image"/>

    <div class="sign-in-content">
      <h1><strong>Sign in</strong> to play some amazing quizzes!</h1>
      <form id="signInForm" class="signInForm">
        <label for="username" class="sr-only">Username:</label>
        <input type="text" name="username" placeholder="Username"/>
        
        <label for="password" class="sr-only">Password:</label>
        <input type="text" name="password" placeholder="Password"/>

        <p class="errorMessage" hidden="true"></p>
        <button type="submit">Sign in</button>
      </form>
      <p>No account? No worries, <a href="/sign-up" class="tertiary">sign up here!</a></p>
    </div>
  </div>`
}

const init = () => {
  const img = document.querySelector('.auth-image')

  const updateImage = () => {
    img.src =
      window.innerWidth <= 900
        ? '/public/man-horizontal.svg'
        : '/public/man-vertical.svg'
  }

  updateImage()
  window.addEventListener('resize', updateImage)

  const form = document.querySelector('#signInForm')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = form.username.value
    const password = form.password.value

    const errMessage = form.querySelector('.errorMessage')

    if (!username || !password) {
      errMessage.hidden = false
      errMessage.textContent = 'Please enter your username and password'
    } else {
      errMessage.hidden = true
    }

    try {
      const res = await signInUser({ username, password })

      if (!res.ok) {
        errMessage.hidden = false
        errMessage.textContent = res.data.message
        return
      }

      navigate('/')
    } catch (error) {
      console.log('Server error: ' + error.message)
    }
  })
}
