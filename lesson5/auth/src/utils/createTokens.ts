import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export default (userId: string, userMail: string) => {

  const accessToken = jwt.sign({
    data: { userId, userMail }
  }, config.auth.secret, { expiresIn: config.auth.accessTokenExpiration });

  const refreshToken = crypto.createHash('sha256')
    .update(Math.random().toString(16).substr(2))
    .digest()
    .toString('hex');

  return {
    accessToken,
    refreshToken
  }
}