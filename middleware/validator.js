const { body, check, validationResult } = require('express-validator');

exports.signupCheck = [
  body('username', 'Please enter a username').not().isEmpty(),
  body('password', 'Please enter a password at least 8 characters long').isLength({ min: 8 }),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      return res.status(400).json(errorMsg);
    }
    next();
  }
];

exports.loginCheck = [
  body('username', 'Please enter a username').not().isEmpty(),
  body('password', 'Please enter a password').not().isEmpty(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      return res.status(400).json(errorMsg);
    }
    next();
  }
];

// exports.addExpenseCheck = [
//   body('title', 'Please enter a title for this expense').not().isEmpty(),
//   body('amount', 'Please enter an amount for this expense ').not().isEmpty(),
//   body('wallet', 'Please provide a wallet for this expense ').not().isEmpty(),
//   body('createdAt', 'Please provide a date for this expense ').not().isEmpty(),
//   function (req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];
//
// exports.addWalletCheck = [
//   body('name', 'Please enter a name for this wallet').not().isEmpty(),
//   body('currency', 'Please choose a currency for this wallet').not().isEmpty(),
//   function (req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];
//
// exports.newSnapshotCheck = [
//   body('You must provide data for this snapshot').not().isEmpty(),
//   function (req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];
