const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

ExpenseSchema.pre('remove', async function(next) {
  // Both models depend on each other, nested import solves circular dep. issue
  const Wallet = require('./Wallet');
  await Wallet.deleteExpense(this.wallet, this._id.toString());

  next();
});

const Expense = mongoose.model('expense', ExpenseSchema);

module.exports = Expense;
