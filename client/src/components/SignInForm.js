import { WebComponentConstructorBase } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { signInUser } from '../services/userService.js'

const template = document.createElement('template')

template.innerHTML = /* html */ `
  <form id="signInForm">
    <label for="username" class="sr-only">Username:</label>
    <input type="text" name="username" placeholder="Username"/>
    
    <label for="password" class="sr-only">Password:</label>
    <input type="text" name="password" placeholder="Password"/>

    <p class="errorMessage" hidden="true"></p>
    <button type="submit">Sign in</button>
  </form>
`

export default class SignInForm extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template)
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector('#signInForm')

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
}

window.customElements.define('sign-in-form', SignInForm)
