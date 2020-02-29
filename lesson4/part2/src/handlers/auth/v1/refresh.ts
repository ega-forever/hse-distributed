import responses from '../../../constants/responses';
import Session from '../../../models/Session';
import config from '../../../config';
import createTokens from '../../../utils/createTokens';

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
  const tokens = createTokens();

  await Session.create({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpireAt: Date.now() + config.auth.accessTokenExpiration,
    refreshTokenExpireAt: Date.now() + config.auth.refreshTokenExpiration,
    // @ts-ignore
    userId: session.userId
  });

  res.send({
    access: tokens.accessToken,
    refresh: tokens.refreshToken
  });
}