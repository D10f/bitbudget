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
    const wallet = await Wallet.findById(req.params.id).lean();

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
* @route  GET /wallet/s/:id
* @desc   Returns expenses for the specified wallet using a query string
* @access private
*/
router.get('/wallet/s/:id', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      return res.status(400).json('Cannot find wallet with that id');
    }

    const expenses = await wallet.getExpenses(req.query);

    res.status(200).send(expenses);
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
  try {
    const walletId = await new Wallet(req.body['data']).save();
    res.status(201).send(walletId);
  } catch (err) {
    console.log(err.message)
    res.status(500).json(err.message);
  }
});

/**
* @route  PUT /wallets/:walletId/:expenseId
* @desc   Updates an existing wallet's expense data (used for date updates)
* @access private
*/
router.put('/wallet/:walletId/:expenseId', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['data'];
  const isValidRequest = updates.every(field => allowedUpdates.includes(field));

  if (!isValidRequest) {
    return res.status(400).json('Invalid fields provided for update.');
  }

  try {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      return res.status(400).json('Cannot find wallet with that id');
    }

    updates.forEach(update => wallet[update] = req.body[update]);

    await wallet.save();
    res.status(202).send(wallet);
  } catch (err) {
    res.status(500).json( err.message );
  }
});

/**
* @route  DELETE /wallets/:id
* @desc   Deletes an existing wallet
* @access private
*/
router.delete('/wallet/:id', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      return res.status(400).json('Cannot find wallet with that id');
    }

    // await Wallet.findByIdAndRemove(req.params.id);
    await wallet.remove();

    res.status(200).json('Wallet deleted successfully');
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;
