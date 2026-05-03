const productService = require('../../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAvailableProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts
};
