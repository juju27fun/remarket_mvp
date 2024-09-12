const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/OrderModel.js');
const User = require('../models/UserModel.js');
const Product = require('../models/ProductModel.js');
const { sendOrderEmail } = require('../utils.js'); // Importer Nodemailer utils

const getAllOrders = expressAsyncHandler(async (req, res) => {
  const seller = req.query.seller || '';
  const sellerFilter = seller ? { seller } : {};
  const orders = await Order.find({ ...sellerFilter }).populate('user', 'name');
  res.send(orders);
});

const getOrderSummary = expressAsyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });
});

const getUserOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});
 
const createOrder = expressAsyncHandler(async (req, res) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: 'Cart is empty' });
  } else {
    const order = new Order({
      seller: req.body.orderItems[0].seller,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  }
});

const getOrderById = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

const payOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    try {
      // Utiliser sendOrderEmail pour envoyer l'email de confirmation
      sendOrderEmail(order);
    } catch (err) {
      console.log(err);
    }
    res.send({ message: 'Order Paid', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

const deleteOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const deleteOrder = await order.remove();
    res.send({ message: 'Order Deleted', order: deleteOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

const deliverOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

const removeItemFromProductMiddleware = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const sellerId = req.body.sellerId; // Ou obtenez-le d'une autre manière appropriée

    if (!productId || !sellerId) {
      return res.status(400).json({ message: 'Product ID and Seller ID are required' });
    }

    const updatedProduct = await Product.removeItemFromProduct(productId, sellerId);
    
    // Stockez le produit mis à jour dans l'objet req pour une utilisation ultérieure
    req.updatedProduct = updatedProduct;

    // Passez au middleware suivant ou au gestionnaire de route
    next();
  } catch (error) {
    // Passez l'erreur au middleware de gestion d'erreurs
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderSummary,
  getUserOrders,
  createOrder,
  getOrderById,
  payOrder,
  deleteOrder,
  deliverOrder,
  removeItemFromProductMiddleware,
};
