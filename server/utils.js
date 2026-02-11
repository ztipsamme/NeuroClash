export const ValidatePassword = (password) =>
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&*()\-=+])(?=\S+$).{8,20}$/.test(
    password
  )

export const ValidateUsername = (username) =>
  /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/.test(username)

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

export const ValidateQuiz = ({ meta, questions }) => {
  const metaValid = Object.values(meta).every((v) => v !== '' && v != null)

  const questionsValid = questions.every((q) => {
    if (!q.statement || !q.category || !q.answers || q.answers.length === 0)
      return false

    return q.answers.every((a) => a.text && typeof a.isCorrect === 'boolean')
  })

  return metaValid && questionsValid
}

export const ValidateUser = (userId, req) => userId === req.user.userId

export const kebabToNormal = (str) =>
  str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export function deslugify(slug) {
  if (!slug) return ''

  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
