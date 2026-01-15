export const isSignedIn = () => {
  const token = localStorage.getItem('authToken')
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch (e) {
    return false
  }
}

export const createUser = async ({ username, email, birthday, password }) => {
  const res = await fetch('http://localhost:8000/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, birthday, password }),
  })

  const data = await res.json()

  return { ok: res.ok, data }
}

export const signInUser = async ({ username, password }) => {
  const res = await fetch('http://localhost:8000/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  const token = data.token

  if (token) {
    localStorage.setItem('authToken', token)
  }

  return { ok: res.ok, data }
}

export const signOut = () => {
  const token = localStorage.getItem('authToken')

  if (token) {
    localStorage.removeItem('authToken')
  }

  return true
}
