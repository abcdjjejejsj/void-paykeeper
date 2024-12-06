const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_type: {
    type: String,
    required: true
  },
  shop_name: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: { type: Number, default: 0 }, // New field for balance
  transactions: { type: Array, default: [] }, // New field for transactions
  pendingDebt: { type: Number, default: 0 } // New field for pending debt
});



const User = mongoose.model('User', userSchema);

module.exports = User;
