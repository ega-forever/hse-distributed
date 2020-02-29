import * as crypto from "crypto";
import Session from '../models/Session';
import config from '../config';

export default ()=>{
  const accessToken = crypto.createHash('sha256')
    .update(Math.random().toString(16).substr(2))
    .digest()
    .toString('hex');

  const refreshToken = crypto.createHash('sha256')
    .update(Math.random().toString(16).substr(2))
    .digest()
    .toString('hex');

  return {
    accessToken,
    refreshToken
  }
}