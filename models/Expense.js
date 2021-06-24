const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
  data: {
    type: Buffer
  }
});

const Expense = mongoose.model('expense', ExpenseSchema);

module.exports = Expense;
