const mongoose = require('mongoose');
const Expense = require('./Expense');

const WalletSchema = mongoose.Schema({});

/* Removes unnecessary data that should not be sent to the client */
WalletSchema.methods.toJSON = function () {
  const walletObject = this.toObject();
  delete walletObject.__v;
  return walletObject;
};

/**
* Makes sure that when a new expense is added by date range, that key exists
* @param {function} next Calls the next expense middleware
*/
WalletSchema.pre('findOneAndUpdate', async function(next) {
  const docToUpdate = await this.model.findOne(this.getQuery());

  Object.keys(this._update).forEach(key => {
    if (!docToUpdate[key]) {
      WalletSchema.add({ [key]: [String] });
    }
  });
});

/**
* Deletes every expense id held in the wallet
* @param {function} next Calls the next express.js middleware
*/
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

/**
* Retrieves a range of expense ids from a given query, and returns the expenses.
* @param  {object} query The query string provided to the REST endpoint
* @return {array}        An array of expense objects retrieves from the database.
*/
WalletSchema.methods.getExpenses = async function(query) {

  const wallet = this.toObject();

  const expenseIds = Object.values(query)
    .map(date => wallet[date])
    .flat();

  return await Expense.find().where('_id').in(expenseIds).lean();
};

/**
* Deletes an expense from the wallet list of ranges
* @param  {string} walletId  The wallet id holding the reference to the expense.
* @param  {string} expenseId The id of the expense that has been deleted.
* @return {void}
*/
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

/**
* Updates the current wallet by moving an expenseId into a different range. This
* function is called when an expense has been updated to a different date.
* @param  {string} walletId  The wallet id holding the reference to the expense.
* @param  {string} expenseId The id of the expense that has been updated.
* @param  {string} oldRange  The current range where the expense id can be found.
* @param  {string} newRange  The new range where the expense id should be in.
* @return {void}
*/
WalletSchema.statics.updateRanges = async function(walletId, expenseId, oldRange, newRange) {
  const wallet = await Wallet.findById(walletId).lean();
  delete wallet._id;
  delete wallet.__v;

  // Remove expenseId from existing range
  wallet[oldRange] = wallet[oldRange].filter(id => id !== expenseId);

  // Add expenseId to the updated range. Check for existing range property first.
  wallet[newRange] = wallet[newRange]
    ? [ ...wallet[newRange], expenseId ]
    : [ expenseId ];

  await Wallet.findByIdAndUpdate(walletId, wallet);
};

const Wallet = mongoose.model('wallet', WalletSchema);

module.exports = Wallet;
