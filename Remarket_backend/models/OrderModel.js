const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
 
const OrderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1},
        image: { type: mongoose.Schema.Types.ObjectId, required: true },
        fromaccount: {type: mongoose.Schema.Types.ObjectId, required: true},
        toaccount: {type: mongoose.Schema.Types.ObjectId, required: true},
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      lat: Number,
      lng: Number,
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    paymentIntentId: { type: String }, // Stripe Payment Intent ID
    transactionId: { type: String }, // Stripe Transaction ID
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
