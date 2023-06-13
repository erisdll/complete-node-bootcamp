const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const app = require('./app')
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});