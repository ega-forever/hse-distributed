import config from './config';
import * as amqp from 'amqplib';
import * as bunyan from 'bunyan';
import MailService from './services/MailService';

const logger = bunyan.createLogger({ name: 'notifications', level: config.logger.level });

const init = async () => {

  const mailService = new MailService();

  const conn = await amqp.connect(config.amqp);
  const channel = await conn.createChannel();
  await channel.assertQueue(config.amqp.queue);
  await channel.assertExchange(config.amqp.exchange, 'topic');
  await channel.bindQueue(config.amqp.queue, config.amqp.exchange, config.amqp.topic);

  channel.consume(config.amqp.queue, async (msg) => {
    const data: { userId: string, mail: string, header: string, text: string } = JSON.parse(msg.content.toString());
    logger.info(data);

    await mailService.send({
      to: data.mail,
      subject: data.header,
      text: data.text
    });

    // message text
    // email

    channel.ack(msg);
  });


};

module.exports = init().catch(e => {
  logger.error(e);
  process.exit(0);
});