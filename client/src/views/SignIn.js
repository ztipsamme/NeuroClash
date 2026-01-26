export default function SignIn() {
  if (!document.querySelector('.sign-in-view')) {
    const link = document.createElement('link')
    link.id = 'sign-in-view'
    link.rel = 'stylesheet'
    link.href = '/styles/components/sign-in-and-sign-up.css'
    document.head.appendChild(link)
  }

  return /* html */ `
  <main id="sign-in-view" class="sign-in-view split-view center-content">
    <img src="/public/mansvg.svg" alt="Man illustration" class="auth-image"/>

    <div>
      <h1><strong>Sign in</strong> to play some amazing quizzes!</h1>
      <sign-in-form></sign-in-form>
      <p>No account? No worries, <a href="/sign-up" class=" secondary">sign up here!</a></p>
    </div>
  </main>`
}
