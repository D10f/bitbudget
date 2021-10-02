const app = require('./app');

const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => console.log(`Listening to port ${PORT}`));
