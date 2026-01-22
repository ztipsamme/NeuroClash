export const getCurrentUser = async () => {
  const res = await fetch('http://localhost:8000/auth/me', {
    credentials: 'include',
  })

  const data = await res.json()
  return { ok: res.ok, data: data.user }
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
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  return { ok: res.ok, data }
}

export const signOut = async () => {
  await fetch('http://localhost:8000/auth/sign-out', {
    method: 'POST',
    credentials: 'include',
  })
}
