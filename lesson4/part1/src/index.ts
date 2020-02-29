import MessageRoutesV1 from './routes/messages/v1';
import MessageRoutesV2 from './routes/messages/v2';
import AuthRoutesV1 from './routes/auth/v1';
import AuthMiddleware from './middlewares/authMiddleware';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import * as mongoose from 'mongoose';
import * as session from 'cookie-session';

const init = async () => {

  await mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const app = express();
  app.use(bodyParser.json());
  app.use(session({
    keys: ['123'],
    maxAge: 86400 * 1000
  }));

  const messageRouterV1 = MessageRoutesV1();
  const messageRouterV2 = MessageRoutesV2();
  const authRouterV1 = AuthRoutesV1();

  app.use('/messages/v1', AuthMiddleware, messageRouterV1);
  app.use('/messages/v2', AuthMiddleware, messageRouterV2);
  app.use('/auth/v1', authRouterV1);

  app.listen(config.rest.port, () => {
    console.log(`started at ${ config.rest.port }`);
  });


};

module.exports = init().catch(e=>{
  console.error(e);
  process.exit(0);
});