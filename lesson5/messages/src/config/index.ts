const dotenv = require('dotenv');
dotenv.config();

export default {
  rest: {
    port: process.env.PORT || 8081
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost/messages'
  },
  auth: {
    uri: process.env.AUTH_URI || 'http://localhost:8080'
  },
  amqp: {
    uri: process.env.AMQP_URI || 'amqp://guest:guest@localhost:5672',
    exchange: process.env.AMQP_EXCHANGE || 'events',
    topic: process.env.AMQP_TOPIC || 't_notifications'
  },
  logger: {
    level: process.env.LOGGER_LEVEL ? parseInt(process.env.LOGGER_LEVEL) : 30
  }
}