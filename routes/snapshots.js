const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { newSnapshotCheck } = require('../middleware/validator');
const Snapshot = require('../models/Snapshot');

const router = express.Router();

/**
* @route  POST /snapshot
* @desc   Creates a new snapshot for a user's current state
* @access private
*/
router.post('/snapshot', auth, async (req, res) => {
  try {
    snapshot = new Snapshot({ data: req.body, author: req.user._id });
    await snapshot.save();

    res.status(201).send('Snapshot Created Successfully');
  } catch (err) {
    console.log(err, err.message);
    res.status(500).send({ message: err.message });
  }

});

/**
* @route  GET /snapshot
* @desc   Retrieves latest snapshot for authenticated user
* @access private
*/
router.get('/snapshot', auth, async (req, res) => {

  try {
    const snapshot = await Snapshot
      .findOne({ author: req.user.id })
      .sort({ createdAt: -1 });

    if (!snapshot) {
      throw new Error('No snapshots found for this user');
    }

    res.status(200).send({ snapshot });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).send({ message: err.message });
  }

});

module.exports = router;
