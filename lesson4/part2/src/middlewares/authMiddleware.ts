import responses from '../constants/responses';
import Session from '../models/Session';

export default async (req, res) => {

  if (!req.headers.authorization) {
    return res.status(401).send({ status: responses.generic.fail });
  }

  const session = await Session.findOne({
    accessToken: req.headers.authorization,
    accessTokenExpireAt: {
      $gte: Date.now()
    }
  });

  if (!session) {
    return res.status(401).send({ status: responses.generic.fail });
  }

  // @ts-ignore
  req.userId = session.userId;

  req.next();
}