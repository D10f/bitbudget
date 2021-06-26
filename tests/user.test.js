const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { userOne, userTwo, setupDatabaseForUserTest} = require('./fixtures/db');
require('../db/mongoose');

beforeEach(setupDatabaseForUserTest);

// Test for signup success
test('Should signup a new user without email', async () => {
  const response = await request(app)
    .post('/user/signup')
    .send({
      username: 'Miguel Lopez',
      password: 'olopezo123!'
    })
    .expect(201);

    // Assert that the response contains the properties user, token and wallet
    expect(response.body).toHaveProperty('user.username', expect.any(String));
    expect(response.body).toHaveProperty('token', expect.any(String));
    expect(response.body).toHaveProperty('wallet', expect.any(String));

    // Assert that the database contains the new user
    const user = await User.findById(userOne._id);
    expect(user).not.toBeNull();

    // Assert that the password is being hashed using argon2
    expect(user.password).not.toBe('olopezo123!');
    expect(user.password.startsWith('$argon')).toBe(true);
});

// test for signup fail
// Test for signup validator response
test('Should fail to signup due to username not provided', async () => {
  const response = await request(app)
    .post('/user/signup')
    .send({
      email: 'molpez@example.com',
      password: 'olo!'
    })
    .expect(400);

  // Assert that response comes from validator middleware
  expect(response.body[0].msg).toBe('Please enter a username');
  expect(response.body[1].msg).toBe('Please enter a password at least 8 characters long');
});

test('Should fail to signup due to username being in use', async () => {
  const response = await request(app)
    .post('/user/signup')
    .send({
      username: userOne.username,
      password: userOne.password
    })
    .expect(400);

  expect(response.body).toBe('That user already exists.');
});

test('Should fail to signup due to email being in use', async () => {
  const response = await request(app)
    .post('/user/signup')
    .send({
      username: 'Not Mike Myers',
      email: 'michaelmyers@example.com',
      password: 'okayYouGotMe7!'
    })
    .expect(400);

  expect(response.body).toBe('That email already exists.');
});

// Test for login success
test('Should login existing user', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      username: userOne.username,
      password: userOne.password
    })
    .expect(200);

  // Assert successful login response
  expect(response.body).toHaveProperty('user.username', expect.any(String));
  expect(response.body).toHaveProperty('token', expect.any(String));

  // Assert unnecessary fields are not present
  expect(response.body).not.toHaveProperty('user._id');
  expect(response.body).not.toHaveProperty('user.__v');
  expect(response.body).not.toHaveProperty('user.password');
  expect(response.body).not.toHaveProperty('user.tokens');
  expect(response.body).not.toHaveProperty('user.createdAt');
  expect(response.body).not.toHaveProperty('user.updatedAt');
});

// Test for login fail
// Test for login validator response
test('Should fail to login existing user for empty fields', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      username: '',
      password: ''
    })
    .expect(400);

  // Assert that response comes from validator middleware
  expect(response.body[0].msg).toBe('Please enter a username');
  expect(response.body[1].msg).toBe('Please enter a password');
});

test('Should fail to login existing user for incorrect fields', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      username: 'completely fake',
      password: 'thispasswordisnotevenreal'
    })
    .expect(400);

  // Assert that response comes from validator middleware
  expect(response.body).toBe('Invalid credentials');
});

// Test for update email address
test('Should update email address for user with an email', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: 'somethingnew@example.com',
    })
    .expect(200);

  // Assert that email was updated
  expect(response.body).toHaveProperty('email', 'somethingnew@example.com');
});

test('Should update email address for user without an email', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      email: 'somethingnew@example.com',
    })
    .expect(200);

  // Assert that email was updated and created
  expect(response.body).toHaveProperty('email', 'somethingnew@example.com');
});

test('Should fail to update email to already existing address', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      email: userOne.email,
    })
    .expect(400);
});

test('Should fail to update an invalid field', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      username: 'Willy Wonka',
    })
    .expect(400);

  expect(response.body).toBe('Invalid fields provided for update.');
});

// Test for update password
test('Should update password', async () => {
  const response = await request(app)
  .put('/user/update')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    password: 'somewhereundertherainbow',
  })
  .expect(200);
});

test('Should fail to update password shorter than 8 characters', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      password: '123',
    })
    .expect(400);

  expect(response.body).toBe('Please enter a password at least 8 characters long');
});

test('Should fail to update password with empty string', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      password: '',
    })
    .expect(400);

  expect(response.body).toBe('Please enter a password at least 8 characters long');
});

test('Should fail to update password with undefined value', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      password: undefined,
    })
    .expect(400);

  expect(response.body).toBe('Please enter a password at least 8 characters long');
});

test('Should fail to update due to invalid token', async () => {
  const response = await request(app)
    .put('/user/update')
    .set('Authorization', 'invalid token!')
    .send({
      password: '123456789',
    })
    .expect(401);

  // Assert cannot access protected routes
  expect(response.body).toBe('You are not authorized, please login.');
});

// Test logout action
test('Should logout user', async () => {
  await request(app)
    .get('/user/logout')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.tokens).toEqual(expect.arrayContaining([]));
});
