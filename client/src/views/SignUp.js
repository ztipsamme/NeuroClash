export default function SignUp() {
  return /* html */ `
   <main>
    <h1><strong>Sign up</strong> to play some amazing quizzes!</h1>
    <form id="signUpForm" class="form-stack">
        <label for="username" class="sr-only">Username:</label>
        <input type="text" name="username" placeholder="Username"/>
        <label for="password" class="sr-only">Password:</label>
        <input type="password" name="password" placeholder="Password"/>
        <button class="md" type="submit">Sign up</button>
    </form>
  </main>`
}
