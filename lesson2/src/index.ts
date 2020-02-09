import MessageRoutes from './routes/messages';
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
    models: [__dirname + '/models']
  });

  const app = express();
  app.use(bodyParser.json());

  await sequelize.sync({ force: true });
  const messageRouter = MessageRoutes();

  app.use('/', messageRouter);

  app.listen(config.rest.port, () => {
    console.log(`started at ${ config.rest.port }`);
  });


};

module.exports = init().catch(e=>{
  console.error(e);
  process.exit(0);
});