import responses from '../constants/responses';
import config from '../../src/config';
import * as jwt from 'jsonwebtoken';

export default async (req, res) => {

  let decoded = null;

  try {
    decoded = jwt.verify(req.body.token, config.auth.secret);
  } catch (e) {
    return res.send({ status: responses.generic.fail });
  }

  res.send({ status: responses.generic.success, data: decoded.data });
}