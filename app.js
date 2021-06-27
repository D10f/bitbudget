const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('./db/mongoose');

// Used to process custom request headers and cross-site origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  res.setHeader('X-Content-Type-Options', "nosniff");
  next();
});

app.use(bodyParser.raw({ limit: '2mb' }));
app.use(bodyParser.json());
app.use(require('./routes/users'));
app.use(require('./routes/wallets'));
app.use(require('./routes/expenses'));
app.use(require('./routes/images'));

module.exports = app;
