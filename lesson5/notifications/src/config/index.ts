const dotenv = require('dotenv');
dotenv.config();

export default {
  amqp: {
    uri: process.env.AMQP_URI || 'amqp://guest:guest@localhost:5672',
    exchange: process.env.AMQP_EXCHANGE || 'events',
    queue: process.env.AMQP_QUEUE || 'notifications',
    topic: process.env.AMQP_TOPIC || 't_notifications'
  },
  logger: {
    level: process.env.LOGGER_LEVEL ? parseInt(process.env.LOGGER_LEVEL) : 30
  },
  mail: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 0,
    secureConnection: process.env.MAIL_SECURE_CONNECTION ? !!parseInt(process.env.MAIL_SECURE_CONNECTION, 10) : true
  },
}