const express = require('express');
const {
  getProducts,
  getCategories,
  seedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  addItemToProductHandler,
  removeItemFromProductHandler,
} = require('../controlers/ProductControlers.js');
const expressAsyncHandler = require('express-async-handler');
const { isAdmin, isAuth, isSellerOrAdmin } = require('../utils.js');

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(getProducts));
productRouter.get('/categories', expressAsyncHandler(getCategories));
productRouter.get('/seed', expressAsyncHandler(seedProducts));
productRouter.get('/:id', expressAsyncHandler(getProductById));
productRouter.post('/',  isAuth, isSellerOrAdmin, expressAsyncHandler(createProduct));// isAuth, isSellerOrAdmin, 
productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(updateProduct));
productRouter.put('/add/:id', isAuth, isSellerOrAdmin, expressAsyncHandler(addItemToProductHandler));
productRouter.put('/sold/:id', isAuth, isSellerOrAdmin, expressAsyncHandler(removeItemFromProductHandler));
productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(deleteProduct));
productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(createReview));

module.exports = productRouter;
