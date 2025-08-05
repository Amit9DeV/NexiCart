const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      stock: {
        type: Number,
        required: true,
      },
    },
  ],
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', function (next) {
  this.modifiedAt = Date.now();
  next();
});

cartSchema.methods.calculateTotal = function () {
  return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
