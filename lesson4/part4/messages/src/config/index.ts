const dotenv = require('dotenv');
dotenv.config();

export default {
  rest: {
    port: process.env.PORT || 8081
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost/test'
  },
  auth: {
    uri: process.env.AUTH_URI || 'http://localhost:8080'
  }
}