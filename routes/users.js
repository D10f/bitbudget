const express = require('express');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const { signupCheck, loginCheck } = require('../middleware/validator');
const auth = require('../middleware/auth');

const router = express.Router();

/**
* @route  POST /signup
* @desc   Register a new user
* @access public
*/
router.post('/user/signup', signupCheck, async (req, res) => {

  const { username, password, email } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json('That user already exists.');
    }

    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json('That email already exists.');
    }

    const newUser = new User({ username, password, email });
    const token = newUser.generateAuthToken();
    await newUser.save();

    const newWallet = new Wallet();
    await newWallet.save();

    res.status(201).send({ user: newUser, token, wallet: newWallet._id });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }

});

/**
* @route  POST login
* @desc   Authenticate and login user
* @access public
*/
router.post('/user/login', loginCheck, async (req, res) => {

  const { username, password } = req.body;

  try {
    const user = await User.loginWithUsernameAndPassword(username, password);
    const token = user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

/**
* @route  PUT /user
* @desc   Updates an existing user
* @access private
*/
router.put('/user/update', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'password'];
  const isValidRequest = updates.every(field => allowedUpdates.includes(field));

  if (!isValidRequest) {
    return res.status(400).json('Invalid fields provided for update.');
  }

  // Protects against undefined and empty string password updates
  if (!updates.length || (updates.includes('password') && !req.body['password'])) {
    return res.status(400).json('Please enter a password at least 8 characters long');
  }

  // Protects against updating emails to already existing addresses
  const needCheckEmail = req.body['email'] && req.body['email'] !== '';
  if (needCheckEmail) {
    const exists = await User.findOne({email: req.body['email'] });
    if (exists) return res.status(400).json('That address is already in use');
  }

  try {
    const user = req.user;
    updates.forEach(update => user[update] = req.body[update]);

    await user.save();
    res.send(user);

  } catch(err) {
    res.status(400).json(err.message);
  }
});

/**
* @route  GET /logout
* @desc   Logs current user out of the session
* @access private
*/
router.get('/user/logout', auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();

  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
