const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
require('../db/mongoose');

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

const walletOne = { _id: new mongoose.Types.ObjectId() };
const walletTwo = { _id: new mongoose.Types.ObjectId() };

const walletData = {
  name: 'fuelOnly',
  budget: 40,
  currency: 'EUR'
};

beforeEach(async () => {
  await User.deleteMany();
  await Wallet.deleteMany();
  await new User(userOne).save();
  await new Wallet(walletOne).save();
  await new Wallet(walletTwo).save();
});

test('Should retrieve wallet information by id', async () => {
  const response = await request(app)
    .get(`/wallet/${walletOne._id.toString()}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body).toMatchObject({ _id: walletOne._id.toString() })
});

test('Should fail to retrieve wallet by id', async () => {
  const response = await request(app)
    .get('/wallet/123456789012')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400);

  // expect(response.body).toBe('No wallet found by that ID');
});
//
// test('Should create a new wallet', async () => {
//   const response = await request(app)
//     .post('/wallet')
//     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//     .send(walletData)
//     .expect(201);
//
//   console.log(response.body);
// });
