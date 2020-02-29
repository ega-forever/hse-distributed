import responses from '../constants/responses';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export default async (req, res) => {

  if (!req.headers.authorization) {
    return res.status(401).send({ status: responses.generic.fail });
  }

  let decoded = null;

  try {
    decoded = jwt.verify(req.headers.authorization, config.auth.secret);
  }catch (e) {

  }

  if (!decoded) {
    return res.status(401).send({ status: responses.generic.fail });
  }

  // @ts-ignore
  req.userId = decoded.data.userId;

  req.next();
}