import Routes from './routes';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import * as mongoose from 'mongoose';
import AuthMiddleware from './middlewares/authMiddleware';

const init = async () => {

  await mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const app = express();
  app.use(bodyParser.json());

  const messageRouter = Routes();

  app.use('/', AuthMiddleware, messageRouter);

  app.listen(config.rest.port, () => {
    console.log(`started at ${ config.rest.port }`);
  });


};

module.exports = init().catch(e=>{
  console.error(e);
  process.exit(0);
});