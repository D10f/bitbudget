const mongoose = require('mongoose');
const crypto = require('crypto');
const Expense = require('./Expense');

const WalletSchema = mongoose.Schema({
  data: {
    type: Buffer
  }
});

// Makes sure that when a new expense is added by date range, that key exists
WalletSchema.pre('findOneAndUpdate', async function(next) {
  const docToUpdate = await this.model.findOne(this.getQuery());

  Object.keys(this._update).forEach(key => {
    if (!docToUpdate[key]) {
      WalletSchema.add({ [key]: [String] });
    }
  });
});

WalletSchema.pre('remove', function(next) {
  const walletObject = this.toObject();
  delete walletObject._id;
  delete walletObject.__v;

  Object.values(walletObject).forEach(monthYearEntry => (
    monthYearEntry.length && monthYearEntry.forEach(async expenseId => {
      const expense = await Expense.findByIdAndRemove(expenseId);
    })
  ));

  next();
});

WalletSchema.methods.toJSON = function () {
  const walletObject = this.toObject();
  delete walletObject.__v;
  return walletObject;
};

WalletSchema.methods.getExpenses = async function(query) {

  const wallet = this.toObject();

  const expenseIds = Object.values(query)
    .map(date => wallet[date])
    .flat();

  return await Expense.find().where('_id').in(expenseIds).lean();
};

WalletSchema.statics.deleteExpense = async function(walletId, expenseId) {
  const wallet = await Wallet.findById(walletId).lean();
  delete wallet._id;
  delete wallet.__v;

  // Finds expenseId and removes it from correct date range
  Object.entries(wallet).forEach(entry => {
    const [ key, value ] = entry;
    const match = value.find(id => id === expenseId);
    if (match) {
      wallet[key] = value.filter(id => id !== expenseId);
    }
  });

  await Wallet.findByIdAndUpdate(walletId, wallet);
};

const Wallet = mongoose.model('wallet', WalletSchema);

module.exports = Wallet;
