const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  membership_status: {
    type: String,
    enum: ['viewer', 'member', 'admin', 'god'],
    default: 'viewer',
  },
});

module.exports = mongoose.model('User', userSchema);
