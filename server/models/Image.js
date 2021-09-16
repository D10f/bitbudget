const mongoose = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');
const unlink = promisify(fs.unlink);

const ImageSchema = mongoose.Schema({
  fileLocation: {
    type: String,
    required: [true, '[DB_ERR] Image location not found!']
  }
});

ImageSchema.pre('remove', async function(next) {
  await unlink(this.fileLocation);
  next();
});

const Image = mongoose.model('image', ImageSchema);

module.exports = Image;
