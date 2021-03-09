const { v4: uuidv4 } = require('uuid');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { signupCheck, loginCheck } = require('../middleware/validator');
const auth = require('../middleware/auth');

const router = express.Router();

/**
* @route  POST /signup
* @desc   Register a new user
* @access public
*/
router.post('/signup', signupCheck, async (req, res) => {

  // res.set('Access-Control-Allow-Origin', '*');

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'That user already exists' });
    }

    user = new User({ username, password });
    const token = user.generateAuthToken();
    // const wallet = {
    //   id: uuidv4(),
    //   name: 'Default Wallet',
    //   budget: 0,
    //   currency: '$',
    //   isCurrent: true
    // };

    // user.wallets = [wallet];

    await user.save();

    res.status(201).send({ user, token });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).send({ message: err.message });
  }

});

/**
* @route  POST login
* @desc   Authenticate and login user
* @access public
*/
router.post('/login', loginCheck, async (req, res) => {

  const { username, password } = req.body;

  try {
    const user = await User.loginWithUsernameAndPassword(username, password);
    const token = user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }

});

/**
* @route  PUT /user
* @desc   Updates an existing user
* @access private
*/
router.put('/user', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['password'];
  const isValidRequest = updates.every(field => allowedUpdates.includes(field));

  if (!isValidRequest) {
    return res.status(400).send({ message: 'Invalid fields provided for update' });
  }

  try {
    const user = req.user;
    updates.forEach(update => user[update] = req.body[update]);

    await user.save()
    res.send(user)

  } catch(err) {
    // 400 cause client sent us invalid data (error returned from validator)
    res.status(400).send(err)
  }
});

/**
* @route  GET /logout
* @desc   Logs current user out of the session
* @access private
*/
router.get('/users/logout', auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();

  } catch (err) {
    res.status(500).send()
  }
})

/**
* @route  GET users/me
* @desc   Get logged in user
* @access private
*/
router.get('/users/me', auth, (req, res) => {
  return res.send(req.user);
});


module.exports = router;
