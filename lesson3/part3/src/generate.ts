import config from './config';
import * as mongoose from 'mongoose';
import Message from './models/Message';
import * as _ from 'lodash';

const init = async () => {

  await mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  for (let i = 0; i < 100000; i++) {
    await Message.create({
      userId: _.random(1, 20),
      message: Math.random().toString(16).substr(2)
    });
  }

};

module.exports = init().catch(e => {
  console.error(e);
  process.exit(0);
});