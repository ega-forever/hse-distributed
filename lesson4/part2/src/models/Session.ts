import { Schema, model } from 'mongoose';
import config from '../config';

export default model('session', new Schema({
  accessToken: String,
  accessTokenExpireAt: Date,
  refreshToken: String,
  refreshTokenExpireAt: { type: Date, expires: config.auth.refreshTokenExpiration },
  userId: String
}));