import responses from '../constants/responses';
import Session from '../models/Session';
import config from '../config';
import createTokens from '../utils/createTokens';
import User from '../models/User';

export default async (req, res) => {

  const session = await Session.findOne({
    refreshToken: req.headers.refresh,
    refreshTokenExpireAt: {
      $gte: Date.now()
    }
  });

  if(!session){
    return res.status(401).send({status: responses.auth.invalidGrand})
  }

  await session.remove();

  // @ts-ignore
  const user = await User.findOne({id: session.userId});

  // @ts-ignore
  const tokens = createTokens(session.userId, user.email);

  await Session.create({
    refreshToken: tokens.refreshToken,
    refreshTokenExpireAt: Date.now() + config.auth.refreshTokenExpiration,
    // @ts-ignore
    userId: session.userId
  });

  res.send({
    access: tokens.accessToken,
    refresh: tokens.refreshToken
  });
}