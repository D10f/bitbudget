const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '[MONGODB_ERR] You must provide a name for this wallet'],
    unique: true,
    trim: true
  },
  currency: {
    type: String,
    required: [true, '[MONGODB_ERR] You must choose a currency'],
  },
  budget: {
    type: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

const Wallet = mongoose.model('wallet', WalletSchema);

module.exports = Wallet;
