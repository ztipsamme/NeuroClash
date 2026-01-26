export default function SignUp() {
  if (!document.querySelector('.sign-up-view')) {
    const link = document.createElement('link')
    link.id = 'sign-up-view'
    link.rel = 'stylesheet'
    link.href = '/styles/components/sign-in-and-register.css'
    document.head.appendChild(link)
  }

  return /* html */ `
  <main id="sign-up-view" class="sign-up-view split-view center-content">
    <img src="/public/mansvg.svg" alt="Man illustration" class="auth-image"/>

      <div>
        <h1><strong>Sign up</strong> to play some amazing quizzes!</h1>
        <sign-up-form></sign-up-form>
        <p>Already have an account? Welcome back friend, <a href="/sign-in" class=" secondary">sign in here!</a></p>
      </div>
  </main>`
}
