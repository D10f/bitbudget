const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
  data: {
    type: Buffer
  }
});

WalletSchema.methods.toJSON = function () {
  const walletObject = this.toObject();
  delete walletObject.__v;
  return walletObject;
};

const Wallet = mongoose.model('wallet', WalletSchema);

module.exports = Wallet;
