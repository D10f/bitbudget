const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Expense = require('../models/Expense');

/**
* @route  GET /expenses
* @desc   Get all expenses for current user
* @access private
*/
router.get('/expenses', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ author: req.user.id });
    res.send(expenses);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

/**
* @route  GET /expenses/:id
* @desc   Returns a particular expense data
* @access private
*/
router.get('/expenses/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      throw new Error('No expense found by that ID');
    }

    res.json(expense);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

/**
* @route  POST /expenses
* @desc   Creates a new expense
* @access private
*/
router.post('/expenses', auth, async (req, res) => {
  const {
    title,
    amount,
    createdAt,
    wallet,
    description = '',
    location = '',
    category = 'Other',
  } = req.body;

  try {
    const expense = new Expense({
      title,
      description,
      amount,
      location,
      category,
      createdAt,
      wallet,
      author: req.user.id
    });
    await expense.save();
    res.status(201).send(expense);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

/**
* @route  PUT /expenses/:id
* @desc   Updates an existing expense
* @access private
*/
router.put('/expenses/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!expense) {
      return res.status(400).send({ message: 'Cannot find expense with that id' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'amount', 'createdAt', 'location'];
    const isValidRequest = updates.every(field => allowedUpdates.includes(field));

    if (!isValidRequest) {
      return res.status(400).send({ message: 'Invalid fields provided for update' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(201).send(expense);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

/**
* @route  DELETE /expenses/:id
* @desc   Deletes an existing expense
* @access private
*/
router.delete('/expenses/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!expense) {
      return res.status(400).send({ message: 'Cannot find expense with that id' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.status(200).send({ message: 'Expense deleted' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;
