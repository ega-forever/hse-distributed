import MessageRoutesV1 from './routes/messages/v1';
import MessageRoutesV2 from './routes/messages/v2';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import { Sequelize } from 'sequelize-typescript';

const init = async () => {

  const sequelize = new Sequelize({
    database: config.db.db,
    dialect: 'postgres',
    username: config.db.user,
    password: config.db.password,
    port: config.db.port,
    host: config.db.host,
    models: [__dirname + '/models']
  });

  const app = express();
  app.use(bodyParser.json());

  await sequelize.sync({ force: true });
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