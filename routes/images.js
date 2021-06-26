const express = require('express');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const Image = require('../models/Image');

const mkdir = promisify(fs.mkdir);
const router = express.Router();

/**
* @route  GET /image/:id
* @desc   Returns an image
* @access private
*/
router.get('/image/:id', auth, async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);

    if (!img) {
      return res.status(400).json('Image not found.');
    }

    pipeline(
      fs.createReadStream(img.fileLocation),
      res,
      (err) => {
        if (err) console.error(err);
      }
    );

  } catch (err) {
    res.status(500).json(err.message);
  }
});

/**
* @route  POST /image
* @desc   Creates a new image associated with a wallet, user or expense document
* @access private
*/
router.post('/image', auth, async (req, res) => {
  try {
    // Create the directory for the this user's images arranged by collections
    const uploadsDir = path.resolve(__dirname, `../uploads/${req.user._id}`);
    const fileLocation = path.resolve(uploadsDir, uuidv4());

    // Create directory for uploaded images if it does not exist.
    await mkdir(uploadsDir, { recursive: true });

    const writer = fs.createWriteStream(fileLocation);
    writer.write(req.body);
    writer.close(async () => {
      const img = new Image({ fileLocation });
      await img.save();
      res.status(201).json(img._id.toString());
    });


  } catch (err) {
    console.error(err)
    res.status(500).json(err.message);
  }
});

/**
* @route  DELETE /image/:id
* @desc   Deletes an image
* @access private
*/
router.delete('/image/:id', auth, async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);

    if (!img) {
      return res.status(400).json('Image not found.');
    }

    await img.remove();
    res.send();

  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
