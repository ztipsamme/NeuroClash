import { WebComponentConstructorBase } from '../core/utils.js'
import { navigate } from '../router/index.js'
import { createUser } from '../services/userService.js'

const template = document.createElement('template')

template.innerHTML = /* html */ `
  <form id="signUpForm" class="form-stack">
    ${[
      { name: 'username', type: 'text', label: 'Username' },
      { name: 'email', type: 'email', label: 'Email' },
      { name: 'birthday', type: 'text', label: 'Birthday (YYYY-MM-DD)' },
      { name: 'password', type: 'password', label: 'password' },
    ]
      .map(
        ({ name, type, label }) => /* html */ `
        <label for="${name}" class="sr-only">${label}:</label>
        <input type="${type}" name="${name}" placeholder="${label}"/>
      `
      )
      .join('')}

    <p class="errorMessage" hidden="true"></p>
    <button class="md" type="submit">Sign up</button>
  </form>
`

export default class SignUpForm extends HTMLElement {
  constructor() {
    super()
    WebComponentConstructorBase(this, template)
  }

  connectedCallback() {
    dateMask(this)

    const form = this.shadowRoot.querySelector('#signUpForm')

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
}

const dateMask = (component) => {
  const input = component.shadowRoot.querySelector('input[name="birthday"]')

  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 3) value = value.slice(0, 4) + '-' + value.slice(4)
    if (value.length > 6) value = value.slice(0, 7) + '-' + value.slice(7, 9)

    e.target.value = value
  })
}

window.customElements.define('sign-up-form', SignUpForm)
