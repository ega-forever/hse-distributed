import { Schema, model } from 'mongoose';

export default model('message', new Schema({
  message: String,
  date: Date,
  userId: Number
}));