const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

let itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 4,
    max: 100,
  },
  description: {
    type: String,
    required: true,
    min: 4,
    max: 500,
  },
  costprice: {
    type: Number,
    required: true,
  },
  sellingprice: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

let chartSchema = mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  costprice: {
    type: Number,
    required: true,
  },
  salesprice: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

let Chart = mongoose.model('Chart', chartSchema);
module.exports.Chart = Chart;

let Item = mongoose.model('Item', itemSchema);
module.exports.Item = Item;

let User = mongoose.model('User', userSchema);
module.exports.User = User;
