const { users } = require('../data/mockData')

const getUser = (req, res) => {
  const userId = Number(req.params.id)
  const user = users.find((item) => item.user_id === userId)

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  return res.json(user)
}

const updateUser = (req, res) => {
  const userId = Number(req.params.id)
  const userIndex = users.findIndex((item) => item.user_id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  const currentUser = users[userIndex]

  if (req.userId && Number(req.userId) !== userId) {
    return res
      .status(403)
      .json({ error: 'No autorizado para actualizar este usuario' })
  }

  const allowedFields = [
    'user_name',
    'user_surname',
    'user_phone',
    'user_email',
    'user_region',
    'user_IdDocument',
    'user_date'
  ]

  const updates = Object.keys(req.body).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = req.body[key]
    }
    return acc
  }, {})

  users[userIndex] = {
    ...currentUser,
    ...updates
  }

  return res.json(users[userIndex])
}

module.exports = {
  getUser,
  updateUser
}
