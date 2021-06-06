const fs = require('fs');
const mongoose = require('mongoose');
const { promisify } = require('util');
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

imageSchema.post('remove', async function() {
  await unlink(this.location);
});

module.exports = Image;
