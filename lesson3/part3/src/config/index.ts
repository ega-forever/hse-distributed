const dotenv = require('dotenv');
dotenv.config();

export default {
  rest: {
    port: process.env.PORT || 8080
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost/test'
  }
}