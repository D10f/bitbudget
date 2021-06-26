const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
  data: {
    type: Buffer
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

ExpenseSchema.pre('remove', async function(next) {
  // Both models depend on each other, import here to solve circular dep. problem
  const Wallet = require('./Wallet');
  await Wallet.deleteExpense(this.wallet, this._id.toString());

  next();
});

const Expense = mongoose.model('expense', ExpenseSchema);

module.exports = Expense;
