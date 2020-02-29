import { Schema, model } from 'mongoose';

export default model('session', new Schema({
  sid: String,
  userId: String
}));