const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Wallet = require('../../models/Wallet');
const Expense = require('../../models/Expense');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  username: 'Mike Myers',
  email: 'michaelmyers@example.com',
  password: 'mikewhat55!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  username: 'Oscar Myers',
  email: 'oscarmyers@example.com',
  password: 'oscarwhooo6!',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
};

const walletOne   = { _id: new mongoose.Types.ObjectId() };
const walletTwo   = { _id: new mongoose.Types.ObjectId() };
const walletThree = { _id: new mongoose.Types.ObjectId() };

const expOneId   = new mongoose.Types.ObjectId();
const expTwoId   = new mongoose.Types.ObjectId();
const expThreeId = new mongoose.Types.ObjectId();

const expenseOne   = {
  _id: expOneId,
  data: Buffer.from('123'),
  wallet: walletOne._id
};

const expenseTwo   = {
  _id: expTwoId,
  data: Buffer.from('456'),
  wallet: walletTwo._id
};

const expenseThree = {
  _id: expThreeId,
  data: Buffer.from('789'),
  wallet: walletThree._id
};

const setupDatabaseForUserTest = async () => {
  await User.deleteMany();
  await Wallet.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};

const setupDatabaseForWalletTest = async () => {
  await User.deleteMany();
  await Wallet.deleteMany();
  await Expense.deleteMany();
  await new User(userOne).save();
  await new Wallet(walletOne).save();
  await new Wallet(walletTwo).save();
  await new Wallet(walletThree).save();
  await new Expense(expenseOne).save();
  await new Expense(expenseTwo).save();
  await new Expense(expenseThree).save();

  // need to update first in order for schema to accept unregistered fields
  // otherwise expenses are not registered and therefore cannot test if they
  // are deleted alongside the wallet
  await Wallet.findByIdAndUpdate(
    walletThree._id,
    {
      _id: walletThree._id,
      ['0621']: [ expOneId ],
      ['0222']: [ expTwoId, expThreeId ]
    }
  );
};

module.exports = {
  userOneId,
  userTwoId,
  userOne,
  userTwo,
  walletOne,
  walletTwo,
  walletThree,
  expOneId,
  expTwoId,
  expThreeId,
  expenseOne,
  expenseTwo,
  expenseThree,
  setupDatabaseForUserTest,
  setupDatabaseForWalletTest
};
