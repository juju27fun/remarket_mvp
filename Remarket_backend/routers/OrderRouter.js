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
  createStripePaymentIntent, // Add this import
} = require('../controlers/OrderControlers.js');
const expressAsyncHandler = require('express-async-handler');
const { isAdmin, isAuth, isSellerOrAdmin } = require('../utils.js');

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isSellerOrAdmin, expressAsyncHandler(getAllOrders));
orderRouter.get('/summary', isAuth, isAdmin, expressAsyncHandler(getOrderSummary));
orderRouter.get('/mine', isAuth, expressAsyncHandler(getUserOrders));
orderRouter.post('/', isAuth, removeItemFromProductMiddleware, expressAsyncHandler(createOrder));
orderRouter.get('/:id', isAuth, expressAsyncHandler(getOrderById));
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(payOrder));
orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(deleteOrder));
orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(deliverOrder));
orderRouter.post('/create-payment-intent', isAuth, expressAsyncHandler(createStripePaymentIntent));

module.exports = orderRouter;