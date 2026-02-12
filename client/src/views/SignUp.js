import { addStylesheet } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { createUser } from '../services/userService.js'

export default function SignUp() {
  addStylesheet(
    'sign-in-and-sign-up-css',
    '/components/sign-in-and-sign-up.css'
  )

  queueMicrotask(() => init())

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
  <div id="sign-up-view" class="sign-up-view split-view center-content bleed-content align-main-content-with-top">
    <img alt="Man illustration" class="auth-image"/>

    <div class="sign-up-content">
      <h1><strong>Sign up</strong> to play some amazing quizzes!</h1>

      <form id="signUpForm" class="signUpForm">
        <label for="username" class="sr-only">Username:</label>
        <input type="text" name="username" placeholder="Username"/>

        <label for="email" class="sr-only">Email:</label>
        <input type="text" name="email" placeholder="Email"/>

        <label for="birthday" class="sr-only">Birthday (YYYY-MM-DD):</label>
        <input type="text" name="birthday" placeholder="Birthday"/>
        
        <label for="password" class="sr-only">Password:</label>
        <input type="text" name="password" placeholder="Password"/>

        <p class="errorMessage" hidden="true"></p>
        <button type="submit">Sign up</button>
      </form>

      <p>Already have an account? Welcome back friend, <a href="/sign-in" class="tertiary">sign in here!</a></p>
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

  const form = document.querySelector('#signUpForm')
  dateMask(form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    let formData = {
      username: form.username.value,
      email: form.email.value,
      birthday: form.birthday.value,
      password: form.password.value,
    }

    const errMessage = form.querySelector('.errorMessage')

    if (Object.values(formData).some((v) => !v)) {
      errMessage.hidden = false
      errMessage.textContent = 'Please enter all details'
    } else {
      errMessage.hidden = true
    }

    try {
      const res = await createUser(formData)

      if (!res.ok) {
        errMessage.hidden = false
        errMessage.textContent = res.data.message
        return
      }

      navigate('/sign-in')
    } catch (error) {
      console.log('Server error: ' + error.message)
    }
  })
}

const dateMask = (form) => {
  const input = form.querySelector('input[name="birthday"]')

  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 3) value = value.slice(0, 4) + '-' + value.slice(4)
    if (value.length > 6) value = value.slice(0, 7) + '-' + value.slice(7, 9)

    e.target.value = value
  })
}
