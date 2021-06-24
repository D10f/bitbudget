const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connection to DB established');
}).catch(err => {
  console.error(`There is an error! ${err.message}`);
  process.exit(1);
});
