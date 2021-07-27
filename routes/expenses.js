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
  const { range, data } = req.body;
  const { walletId } = req.params;

  try {

    if (!range || !data) {
      return res.status(400).json('Missing fields: "range" and/or "data"');
    }

    const wallet = await Wallet.findById(walletId).lean();

    if (!wallet){
      return res.status(400).json('No wallet found with that id');
    }

    const expense = new Expense({
      data,
      wallet: walletId
    });

    // Update wallet range properties in non-destructive way.
    wallet[range] = wallet[range]
      ? [ ...wallet[range], expense._id ]
      : [ expense._id ];

    await Wallet.findByIdAndUpdate(walletId, wallet);
    await expense.save();

    res.status(201).json(expense._id);
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

    // Optional property to update the wallet holding this expense if the date
    // of the expense has been updated.
    const { ranges } = req.body;
    if (ranges) delete req.body.ranges;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['data', 'wallet'];
    const isValidRequest = updates.every(field => allowedUpdates.includes(field));

    if (!isValidRequest) {
      return res.status(400).json('Invalid fields provided for update');
    }

    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(400).json('Cannot find expense with that id');
    }

    updates.forEach(update => expense[update] = req.body[update]);
    await expense.save();

    if (ranges) {
      const [ oldRange, newRange ] = ranges.split(',');
      await Wallet.updateRanges(expense.wallet, expense._id, oldRange, newRange);
    }

    res.status(202).send();
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
