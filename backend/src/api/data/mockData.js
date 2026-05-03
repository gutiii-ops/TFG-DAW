const bcrypt = require('bcrypt')

const passwordHash = bcrypt.hashSync('123456', 10)

const users = [
  {
    user_id: 1,
    user_name: 'Lucía',
    user_surname: 'García',
    user_phone: '+34 600 123 456',
    user_email: 'lucia.garcia@example.com',
    user_IdDocument: '12345678Z',
    user_date: '2025-01-15',
    user_region: 'Madrid',
    password_hash: passwordHash
  }
]

const roles = [
  { role_id: 1, role_name: 'Admin', role_description: 'Administrador del sistema' },
  { role_id: 2, role_name: 'Coach', role_description: 'Entrenador' },
  { role_id: 3, role_name: 'User', role_description: 'Usuario regular' }
];

const user_roles = [
  { user_id: 1, role_id: 1 } // Lucía tiene rol 1 (Admin)
];

const products = [
  {
    product_id: 1,
    product_name: 'Camiseta Gym',
    product_category: 1,
    product_price: 24.99
  },
  {
    product_id: 2,
    product_name: 'Proteína Whey',
    product_category: 2,
    product_price: 49.9
  },
  {
    product_id: 3,
    product_name: 'Guantes de Levantamiento',
    product_category: 3,
    product_price: 34.5
  },
  {
    product_id: 4,
    product_name: 'Botella Reutilizable',
    product_category: 4,
    product_price: 12.5
  }
]

const orders = [
  {
    order_id: 1,
    user_id: 1,
    order_date: '2026-04-01T11:30:00.000Z',
    total_price: 87.48
  },
  {
    order_id: 2,
    user_id: 1,
    order_date: '2026-03-15T15:45:00.000Z',
    total_price: 24.99
  }
]

const order_details = [
  {
    detail_id: 1,
    order_id: 1,
    product_id: 3,
    quantity: 1,
    unit_price: 34.5
  },
  {
    detail_id: 2,
    order_id: 1,
    product_id: 4,
    quantity: 1,
    unit_price: 12.5
  },
  {
    detail_id: 3,
    order_id: 1,
    product_id: 2,
    quantity: 1,
    unit_price: 40.48
  },
  {
    detail_id: 4,
    order_id: 2,
    product_id: 1,
    quantity: 1,
    unit_price: 24.99
  }
]

module.exports = {
  users,
  roles,
  user_roles,
  products,
  orders,
  order_details
}
