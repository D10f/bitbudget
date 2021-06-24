const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, '[DB_ERR] You must provide a username'],
    trim: true
  },
  email: {
    type: String,
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
  }],
  settings: {
    type: Buffer
  }
});

userSchema.pre('save', async function(next) {
  // Hash the plaintext password only if it has been modified
  if (this.isModified('password')) {
    if (this.password.length < 8) {
      throw new Error('Please enter a password at least 8 characters long');
    }
    this.password = await argon2.hash(this.password);
  }

  next();
});

// userSchema.pre('remove', async function(next){
//   await Snapshot.deleteMany({ author: this._id });
//   next();
// });

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
  delete userObject.__v;
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

  const isMatch = await argon2.verify(user.password, password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
}

const User = mongoose.model('user', userSchema);

module.exports = User;
