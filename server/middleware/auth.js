import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
