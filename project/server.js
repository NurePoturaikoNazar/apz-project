require('dotenv').config();
const app = require('./src/app');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server Aquila running on http://${host}:${port}`);
  console.log(`API Reference: http://${host}:${port}/api/reference`);
});
