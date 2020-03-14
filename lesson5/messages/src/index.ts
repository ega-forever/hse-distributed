import Routes from './routes';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import * as mongoose from 'mongoose';
import AuthMiddleware from './middlewares/authMiddleware';
import * as amqp from 'amqplib';
import amqpMiddleware from './middlewares/amqpMiddleware';
import * as bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'notifications', level: config.logger.level });

const init = async () => {

  await mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const conn = await amqp.connect(config.amqp);
  const channel = await conn.createChannel();
  await channel.assertExchange(config.amqp.exchange, 'topic');

  const app = express();
  app.use(bodyParser.json());

  const messageRouter = Routes();

  app.use('/', amqpMiddleware.bind(this, channel), AuthMiddleware, messageRouter);

  app.listen(config.rest.port, () => {
    logger.info(`started at ${ config.rest.port }`);
  });


};

module.exports = init().catch(e => {
  logger.error(e);
  process.exit(0);
});