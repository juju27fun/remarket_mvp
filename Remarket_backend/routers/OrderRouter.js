const express = require('express');
const {
  getAllOrders,
  getOrderSummary,
  getUserOrders,
  createOrder,
  getOrderById,
  payOrder,
  deleteOrder,
  deliverOrder,
  removeItemFromProductMiddleware,
} = require('../controlers/OrderControlers.js');
const expressAsyncHandler = require('express-async-handler');
const { isAdmin, isAuth, isSellerOrAdmin } = require('../utils.js');

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isSellerOrAdmin, expressAsyncHandler(getAllOrders));
orderRouter.get('/summary', isAuth, isAdmin, expressAsyncHandler(getOrderSummary));
orderRouter.get('/mine', isAuth, expressAsyncHandler(getUserOrders));
orderRouter.post('/', isAuth, removeItemFromProductMiddleware, expressAsyncHandler(createOrder)); //remove should be reserved to later operations
orderRouter.get('/:id', isAuth, expressAsyncHandler(getOrderById));
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(payOrder));
orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(deleteOrder));
orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(deliverOrder));

module.exports = orderRouter;