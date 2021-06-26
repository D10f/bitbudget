const request = require('supertest');
const app = require('../app');
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

test('Should create a new expense and add an Id to the wallet', async () => {
  const response = await request(app)
    .post(`/expense/${walletOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from('123'),
      range: '0621'
    })
    .expect(201);

  // Assert the expense has been created
  expect(response.body).toHaveProperty('_id', expect.any(String));

  // Assert the wallet has been updated
  const wallet = await Wallet.findById(walletOne._id).lean();
  expect(wallet['0621'].length).toBe(1);
});

test('Should add multiple expenses to same wallet and range', async () => {
  const exp1 = await request(app)
    .post(`/expense/${walletOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from('123'),
      range: '0621'
    })
    .expect(201);

  const exp2 = await request(app)
    .post(`/expense/${walletOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from('456'),
      range: '0621'
    })
    .expect(201);

  // Assert wallet has been updated
  const wallet = await Wallet.findById(walletOne._id).lean();
  expect(wallet['0621'].length).toBe(2);

  // Assert wallet contains correct ids
  // formatting due to jest error "serializes to same string" otherwise
  expect(wallet['0621'].toString()).toBe(`${exp1.body._id},${exp2.body._id}`)
});

test('Should fail to add expense to non-existing wallet', async () => {
  const response = await request(app)
    .post(`/expense/123456789012`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from('123'),
      range: '0621'
    })
    .expect(400);

  expect(response.body).toBe('No wallet found with that id');
});

test('Should update existing expense', async () => {
  const response = await request(app)
    .put(`/expense/${expOneId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from(`${Math.random()}`),
    })
    .expect(202);

  // Assert expense exists
  const expense = await Expense.findById(response.body._id);
  expect(expense).not.toBeNull();
});

test('Should fail to update non existing expense', async () => {
  const response = await request(app)
    .put(`/expense/123456789012`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from(`${Math.random()}`),
    })
    .expect(400);

  // Assert error message is correct
  expect(response.body).toBe('Cannot find expense with that id');
});

test('Should fail to update expense sending invalid fields', async () => {
  const response = await request(app)
    .put(`/expense/${expOneId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      data: Buffer.from(`${Math.random()}`),
      range: '0621'
    })
    .expect(400);

  // Assert error message is correct
  expect(response.body).toBe('Invalid fields provided for update');
});

test('Should delete expense and remove reference from wallet', async () => {
  await request(app)
    .delete(`/expense/${expThreeId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  // Assert expense is deleted
  const expense = await Expense.findById(expThreeId);
  expect(expense).toBeNull();

  // Assert wallet does not contain expense id
  // Uses same operations as in Wallet model
  const wallet = await Wallet.findById(walletThree._id).lean();
  delete wallet._id;
  delete wallet.__v;

  let match = null;
  Object.entries(wallet).forEach(entry => {
    const [ key, value ] = entry;
    if (value.find(id => id === walletThree._id)) {
      match = true;
    }
  });

  expect(match).toBe(null);
});

test('Should fail to delete non existing expense', async () => {
  const response = await request(app)
    .delete(`/expense/123456789012`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400);

  expect(response.body).toBe('Cannot find expense with that id');
});
