const dotenv = require('dotenv');
dotenv.config();

export default {
  rest: {
    port: process.env.PORT || 8080
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost/test'
  },
  auth: {
    accessTokenExpiration: process.env.AUTH_ACCESS_TOKEN_EXPIRATION ? parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION) : 300 * 1000,
    refreshTokenExpiration: process.env.AUTH_REFRESH_TOKEN_EXPIRATION ? parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION) : 900 * 1000
  }
}