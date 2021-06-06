const fs = require('fs');
const { promisify } = require('util');
const mongoose = require('mongoose');

const unlink = promisify(fs.unlink);

const imageSchema = mongoose.Schema({
  location: {
    type: String,
    required: [true, '[DB_ERR] Image location not found!']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, '[DB_ERR] No user associated with this image'],
    ref: 'user'
  },
  expenseId: {
    type: String,
    required: [true, '[DB_ERR] No expense associated with this image']
  },
}, { timestamps: true });

const Image = mongoose.model('image', imageSchema);

imageSchema.pre('remove', async function(next) {
  console.log(`deleting image at ${this.location}`)
  unlink(this.location);
  next();
});

module.exports = Image;
