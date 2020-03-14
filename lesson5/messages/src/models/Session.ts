import { Schema, model } from 'mongoose';
import config from '../config';

export default model('session', new Schema({
  refreshToken: String,
  refreshTokenExpireAt: { type: Date, expires: config.auth.refreshTokenExpiration },
  userId: String
}));