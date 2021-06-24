const express = require('express');
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');
const Expense = require('../models/Expense');

const router = express.Router();

/**
* @route  GET /wallets/:id
* @desc   Returns the specified wallet data
* @access private
*/
router.get('/wallet/:id', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      return res.status(400).json('No wallet found by that ID');
    }

    res.send(wallet);
  } catch (err) {
    console.error(err)
    res.status(500).json(err.message);
  }
});

/**
* @route  POST /wallet
* @desc   Creates a new wallet
* @access private
*/
router.post('/wallet', auth, async (req, res) => {

  if (!req.body.data) {
    return res.status(400).json('No data provided for this wallet');
  }

  try {
    const data = Buffer.from(req.body.data);
    console.log(data)
    const wallet = new Wallet(data);
    await wallet.save();
    res.status(201).send(wallet);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/**
* @route  POST /wallet/search/:id
* @desc   Returns expenses for the specified wallet using the body query params
* @access private
*/
router.post('/wallet/search/:id', auth, async (req, res) => {
  console.log('sfdsdfsd')
  // A string array containing the dates to retrieve in a ['MMYY'] format
  // e.g., [1221, 0122, 0222] matches Dec 2021, Jan 2022 and Feb 2022
  const { query } = req.body;

  // Convert the string array into an object to define the projected properties
  // from the MongoDB document e.g., {1221: 1, 0122: 1, 0222: 1}
  // const projectedProperties = query.reduce((acc, val) => {
  //   return acc[val] ? acc : { ...acc, acc[val]: 1 };
  // }, {});

  console.log(projectedProperties);
  return projectedProperties;

  try {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      return res.status(400).json('Cannot find wallet with that id');
    }

    let results = [];
    results = query.map(date => {

    });

    res.status(200).send(results);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/**
* @route  PUT /wallets/:id
* @desc   Updates an existing wallet
* @access private
*/
router.put('/wallets/:id', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!wallet) {
      return res.status(400).send({ message: 'Cannot find wallet with that id' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'budget'];
    const isValidRequest = updates.every(field => allowedUpdates.includes(field));

    if (!isValidRequest) {
      return res.status(400).send({ message: 'Invalid fields provided for update' });
    }

    wallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(201).send(wallet);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

/**
* @route  DELETE /wallets/:id
* @desc   Deletes an existing wallet
* @access private
*/
router.delete('/wallets/:id', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!wallet) {
      return res.status(400).send({ message: 'Cannot find wallet with that id' });
    }

    await Wallet.findByIdAndRemove(req.params.id);

    res.status(200).send({ message: 'Wallet deleted' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;
