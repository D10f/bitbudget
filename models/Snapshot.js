const mongoose = require('mongoose');

const snapshotSchema = mongoose.Schema({
  data: {
    type: Buffer,
    required: [true, '[DB_ERR] No data provided for this snapshot']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, '[DB_ERR] No user associated with this snapshot'],
    ref: 'user'
  },
}, { timestamps: true });

const Snapshot = mongoose.model('snapshot', snapshotSchema);

module.exports = Snapshot;
