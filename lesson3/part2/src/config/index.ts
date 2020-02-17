const dotenv = require('dotenv');
dotenv.config();

export default {
  rest: {
    port: process.env.PORT || 8080
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    db: process.env.DB_DB || 'postgres',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD
  }
}