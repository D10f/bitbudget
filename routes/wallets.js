const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addWalletCheck } = require('../middleware/validator');

const Wallet = require('../models/Wallet');

/**
* @route  GET /wallets
* @desc   Get all wallets for current user
* @access private
*/
router.get('/wallets', auth, async (req, res) => {
  try {
    const wallets = await Wallet.find({ author: req.user.id });
    res.send(wallets);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

/**
* @route  GET /wallets/:id
* @desc   Returns a particular wallet data
* @access private
*/
router.get('/wallets/:id', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      throw new Error('No wallet found by that ID');
    }

    res.json(wallet);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

/**
* @route  POST /wallets
* @desc   Creates a new wallet
* @access private
*/
router.post('/wallets', auth, addWalletCheck, async (req, res) => {
  const { name, currency, budget } = req.body;

  try {
    const wallet = new Wallet({
      name,
      currency,
      budget,
      author: req.user.id
    });

    await wallet.save();
    res.status(201).send(wallet);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

/**
* @route  PUT /wallets/:id
* @desc   Updates an existing wallet
* @access private
*/
router.put('/wallets/:id', auth, addWalletCheck, async (req, res) => {
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
