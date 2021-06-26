const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Wallet = require('../models/Wallet');
const Expense = require('../models/Expense');

/**
* @route  POST /expense/:walletId
* @desc   Creates a new expense associated to the specified wallet
* @access private
*/
router.post('/expense/:walletId', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.walletId).lean();

    if (!wallet){
      return res.status(400).json('No wallet found with that id');
    }

    const { range, data } = req.body;

    const expense = new Expense({
      data: req.body.data,
      wallet: req.params.walletId
    });

    // Update wallet range properties in non-destructive way.
    wallet[range] = wallet[range]
      ? [ ...wallet[range], expense._id ]
      : [ expense._id ]

    await Wallet.findByIdAndUpdate(req.params.walletId, wallet);
    await expense.save();

    res.status(201).send(expense);
  } catch (err) {
    console.error(err)
    res.status(500).json(err.message);
  }
});

/**
* @route  PUT /expenses/:id
* @desc   Updates an existing expense
* @access private
*/
router.put('/expense/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(400).json('Cannot find expense with that id');
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['data', 'wallet'];
    const isValidRequest = updates.every(field => allowedUpdates.includes(field));

    if (!isValidRequest) {
      return res.status(400).json('Invalid fields provided for update');
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(202).send(expense);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/**
* @route  DELETE /expenses/:id
* @desc   Deletes an existing expense
* @access private
*/
router.delete('/expense/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(400).json('Cannot find expense with that id');
    }

    await expense.remove();
    res.status(200).send();
  } catch (err) {
    console.error(err)
    res.status(500).json(err.message);
  }
});

module.exports = router;
