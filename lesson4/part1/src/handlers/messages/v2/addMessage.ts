import responses from '../../../constants/responses';
import Message from '../../../models/Message';

export default async (req, res) => {
  await Message.create({
    message: req.body.message,
    date: new Date(),
    userId: req.session.userId
  });
  res.send({ status: responses.messages.created });
}