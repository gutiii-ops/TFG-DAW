const { products } = require('../data/mockData')

const getProducts = (req, res) => {
  return res.json(products)
}

module.exports = {
  getProducts
}
