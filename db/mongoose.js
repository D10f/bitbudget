const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

module.exports = mongoose.connect(MONGODB_URI, options)
  .then(() => console.log('Connection to DB established'))
  .catch(err => {
    console.error(`There is an error! ${err.message}`);
    process.exit(1);
  });
