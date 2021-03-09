const express = require('express');
const app = express();
require('./db/mongoose');

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(require('./routes/users'));
app.use(require('./routes/wallets'));
app.use(require('./routes/expenses'));
app.use(require('./routes/snapshots'));

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
