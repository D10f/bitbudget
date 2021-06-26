const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Expense = require('../models/Expense');
const {
  userOne,
  walletOne,
  walletTwo,
  walletThree,
  expOneId,
  expTwoId,
  expThreeId,
  expenseOne,
  expenseTwo,
  expenseThree,
  setupDatabaseForWalletTest
} = require('./fixtures/db');
require('../db/mongoose');

beforeEach(setupDatabaseForWalletTest);

test('Should retrieve wallet information by id', async () => {
  const response = await request(app)
    .get(`/wallet/${walletOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  // Assert that the retrieved wallet has the correct id
  expect(response.body).toMatchObject({ _id: walletOne._id.toString() })
});

test('Should fail to retrieve wallet with wrong id', async () => {
  const response = await request(app)
    .get('/wallet/123456789012')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400);

  // Assert that the route errors out with the right message
  expect(response.body).toBe('No wallet found by that ID');
});

test('Should create a new wallet', async () => {

  const walletData = {
    name: 'fuelOnly',
    budget: 40,
    currency: 'EUR'
  };

  const response = await request(app)
    .post('/wallet')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ data: JSON.stringify(walletData) })
    .expect(201);

  // Assert that the object returned back has an id
  expect(response.body).toHaveProperty('_id');
});

test('Should fail to create a wallet without any data', async () => {
  const response = await request(app)
    .post('/wallet')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({})
    .expect(400);

  // Assert that the route errors out with the right message
  expect(response.body).toBe('No data provided for this wallet');
});

test('Should fail to create a wallet with invalid data', async () => {
  const response = await request(app)
    .post('/wallet')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: {
        name: 'Summer holiday 2020',
        amount: 600,
        currency: 'EUR'
      }
    })
    .expect(400);

  // Assert that the route errors out with the right message
  expect(response.body).toBe('Invalid data type provided');
});

test("Should update wallet's data (not the expenses)", async () => {
  const response = await request(app)
    .put(`/wallet/${walletTwo._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ data: Buffer.from('hello world') })
    .expect(202);

  expect(response.body.data).not.toBeNull();
});

test("Should not update wallet invalid properties", async () => {
  const response = await request(app)
    .put(`/wallet/${walletTwo._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ budget: 'this is not allowed' })
    .expect(400);

  expect(response.body).toBe('Invalid fields provided for update.');
});

test('Should delete specified wallet and associated expenses', async () => {
  const response = await request(app)
    .delete(`/wallet/${walletThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  // Assert the wallet has been removed
  const wallet = await Wallet.findById(walletThree._id);
  expect(wallet).toBeNull();

  // Assert that all expenses associated to this wallet are removed
  const expenses = await Expense
    .find()
    .where('_id')
    .in([ expOneId, expTwoId, expThreeId ])
    .lean();

  expect(expenses.length).toBe(0);
});

test('Should retrieve expense data for a given wallet and dates', async () => {
  const response = await request(app)
    .get(`/wallet/s/${walletThree._id}?0=0621&1=0222`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(3);
});

test('Should fail to retrieve expense data with invalid date range', async () => {
  const response = await request(app)
    .get(`/wallet/s/${walletThree._id}?0=abcd&1=ffffffffff`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(0);
});

test('Should fail to retrieve expense data for non existing wallet', async () => {
  const response = await request(app)
    .get(`/wallet/s/123456789012`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400);

  expect(response.body).toEqual('Cannot find wallet with that id');
});
