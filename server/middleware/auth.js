const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json('You are not authorized, please login.');
  }
};

module.exports = auth;