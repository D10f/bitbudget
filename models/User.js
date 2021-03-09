const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Snapshot = require('./Snapshot');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, '[DB_ERR] You must provide a username'],
    trim: true
  },
  password: {
    type: String,
    required: [true, '[DB_ERR] You must provide a password']
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

userSchema.virtual('userSnapshots', {
  ref: 'Snapshot',
  localField: '_id',
  foreignField: 'author'
});

userSchema.pre('save', async function(next) {

  // Hash the plaintext password only if it has been modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.pre('remove', async function(next){
  await Snapshot.deleteMany({ author: this._id });
  next();
});

userSchema.methods.generateAuthToken = function(){

  const token = jwt.sign(
    { _id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: '7 days'}
  );

  this.tokens = [...this.tokens, { token }];

  return token;
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject._id;
  delete userObject._v;
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.createdAt;
  delete userObject.updatedAt;

  return userObject;
};

userSchema.statics.loginWithUsernameAndPassword = async (username, password) => {

  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
}

const User = mongoose.model('user', userSchema);

module.exports = User;
