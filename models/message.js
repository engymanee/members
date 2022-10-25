/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  title: String,
  timestamp: { type: Date, default: Date.now },
  body: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  pinned: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', messageSchema);
