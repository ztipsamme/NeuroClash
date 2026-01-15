export const createUser = async ({ username, email, birthday, password }) => {
  const res = await fetch('http://localhost:8000/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, birthday, password }),
  })

  const data = await res.json()

  return { ok: res.ok, data }
}
