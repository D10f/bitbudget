const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  location: {
    type: String,
    required: [true, '[DB_ERR] Image location not found!']
  }
});

const Image = mongoose.model('image', ImageSchema);

module.exports = Image;
