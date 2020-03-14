import { Schema, model } from 'mongoose';

export default model('user', new Schema({
  username: String,
  password: String, // todo don't use plain pass
  email: String
}));