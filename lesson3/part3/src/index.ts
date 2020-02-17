import MessageRoutesV1 from './routes/messages/v1';
import MessageRoutesV2 from './routes/messages/v2';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import * as mongoose from 'mongoose';

const init = async () => {

  await mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const app = express();
  app.use(bodyParser.json());

  const messageRouterV1 = MessageRoutesV1();
  const messageRouterV2 = MessageRoutesV2();

  app.use('/', messageRouterV1);
  app.use('/v2', messageRouterV2);

  app.listen(config.rest.port, () => {
    console.log(`started at ${ config.rest.port }`);
  });


};

module.exports = init().catch(e=>{
  console.error(e);
  process.exit(0);
});