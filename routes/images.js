const express = require('express');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const auth = require('../middleware/auth');
const Image = require('../models/Image');

const mkdir = promisify(fs.mkdir);
const router = express.Router();

/**
* @route  POST /image/:filename/:expenseId
* @desc   Creates a new image associated with an owner and collectionId
* @access private
*/
router.post('/image/:filename/:expenseId', auth, async (req, res) => {
  try {
    // Create the directory for the this user's images arranged by collections
    const uploadsDir = path.resolve(
      __dirname,
      `../uploads/${req.user._id}`
    );
    const fileLocation = path.resolve(uploadsDir, req.params.filename);

    // Create directory for uploaded images if it does not exist.
    await mkdir(uploadsDir, { recursive: true });

    // Write data to file
    const writer = fs.createWriteStream(fileLocation);

    writer.write(req.body);
    writer.close(async () => {
      const img = new Image({
        location: fileLocation,
        author: req.user._id,
        expenseId: req.params.expenseId
      });

      await img.save();

      const downloadUrl = `http://localhost:5000/image/${img._id}`
      res.status(201).send(downloadUrl); // send back url
    });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).send(err.message);
  }
});

/**
* @route  GET /image/:id
* @desc   Returns an image
* @access private
*/
router.get('/image/:id', auth, async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);

    if (!img) {
      throw new Error('Image does not exist or could not be found.');
    }

     pipeline(
      fs.createReadStream(img.location),
      res,
      (err) => {
        if (err) console.error(err);
      }
    );

  } catch (err) {
    console.log(err, err.message);
    res.status(400).send(err.message);
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
      throw new Error('Image does not exist or could not be found.');
    }

    console.log('removing this image');
    await img.remove();
    res.send();

  } catch (err) {
    console.log(err, err.message);
    res.status(400).send(err.message);
  }
});

module.exports = router;
