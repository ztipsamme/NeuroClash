export const resStatusJson = (
  res,
  { json, message, error } = {},
  status = 400
) => {
  if (status >= 500) {
    if (error) console.error(error)
    return res.status(status).json({ message: message || 'Server error' })
  }

  if (status >= 400) {
    return res.status(status).json({ message: message || 'Bad request' })
  }

  return res.status(status).json(json)
}
