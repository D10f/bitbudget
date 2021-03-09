const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, '[MONGODB_ERR] You must provide an expense title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, '[MONGODB_ERR] You must provide an amount'],
  },
  category: {
    type: String,
    required: [true, '[MONGODB_ERR] You must select a category']
  },
  location: {
    type: String
  },
  createdAt: {
    type: Number,
    required: [true, '[MONGODB_ERR] You must provide a date for this expense']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  wallet: {
    type: String,
    required: [true, '[MONGODB_ERR] You must provide a wallet for this expense']
  }
}, { timestamps: true });

const Expense = mongoose.model('expense', ExpenseSchema);

module.exports = Expense;
