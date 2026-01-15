export const ValidatePassword = (password) =>
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&*()\-=+])(?=\S+$).{8,20}$/.test(
    password
  )

export const ValidateUsername = (username) =>
  /^[a-zA-Z][a-zA-Z0-9_-]{3,20}$/.test(username)

export const ValidateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

export const ValidateBirthday = (birthday) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return false

  const [year, month, day] = birthday.split('-').map(Number)

  const date = new Date(year, month - 1, day)

  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day

  const currentYear = new Date().getFullYear()
  const isReasonableYear = year >= 1900 && year <= currentYear

  return isValidDate && isReasonableYear
}
