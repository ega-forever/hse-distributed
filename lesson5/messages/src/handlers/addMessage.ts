import responses from '../constants/responses';
import Message from '../models/Message';
import config from '../config';

export default async (req, res) => {
  await Message.create({
    message: req.body.message,
    date: new Date(),
    userId: req.userId
  });

  await req.amqp.publish(
    config.amqp.exchange,
    config.amqp.topic,
    Buffer.from(JSON.stringify({
      userId: req.userId,
      mail: req.userMail,
      header: 'notification',
      text: req.body.message
    }))
  );// todo form message

  res.send({ status: responses.messages.created });
}