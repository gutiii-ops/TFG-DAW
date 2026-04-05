const bcrypt = require('bcrypt')
const { users } = require('../data/mockData')

const validTokens = new Map()

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email y contraseña son obligatorios' })
  }

  const user = users.find((item) => item.user_email === email)

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const token = `mock-token-user-${user.user_id}`
  validTokens.set(token, user.user_id)

  return res.json({ token, userId: user.user_id })
}

const validateToken = (token) => {
  return validTokens.get(token) || null
}

module.exports = {
  login,
  validateToken
}
