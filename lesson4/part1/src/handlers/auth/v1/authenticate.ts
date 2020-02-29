import responses from '../../../constants/responses';
import User from '../../../models/User';

export default async (req, res) => {

  const user = await User.findOne({ username: req.body.username });

  // @ts-ignore
  if (!user || user.password !== req.body.password) {
    return res.status(403).send({ status: responses.auth.invalidGrand });
  }

  req.session.userId = user.id;
  res.send({ status: responses.generic.success });
}