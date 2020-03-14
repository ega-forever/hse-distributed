import responses from '../constants/responses';
import User from '../models/User';
import Session from '../models/Session';
import config from '../config';
import createTokens from '../utils/createTokens';

export default async (req, res) => {

  const user = await User.findOne({ username: req.body.username });

  // @ts-ignore
  if (!user || user.password !== req.body.password) {
    return res.status(403).send({ status: responses.auth.invalidGrand });
  }

  // @ts-ignore
  const tokens = createTokens(user.id, user.email);

  await Session.create({
    refreshToken: tokens.refreshToken,
    refreshTokenExpireAt: Date.now() + config.auth.refreshTokenExpiration,
    userId: user.id
  });

  res.send({
    access: tokens.accessToken,
    refresh: tokens.refreshToken
  });
}