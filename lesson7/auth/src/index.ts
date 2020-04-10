import { ApolloServer } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as bunyan from 'bunyan';
import * as express from 'express';
import * as cors from 'express-cors';
import * as grpc from 'grpc';
import 'reflect-metadata';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import * as projectConfig from '../package.json';
import config from './config';
import { DEFAULT } from './constants/connections';
import { DI } from './constants/DI';
import TokenCtrl from './controllers/TokenCtrl';
import IContext from './interfaces/IContext';
import logMiddleware from './middleware/logger';
import { entities } from './models';
import { createSchema } from './resolvers/gql';
import { addGRPCServices } from './resolvers/grpc';
import http = require('http');
import { formatError } from 'common.libs/build/errors/ErrorFormatter';

const logger = bunyan.createLogger({ name: 'auth.service' });

TypeORM.useContainer(Container);

const bootstrap = async () => {
  const app = express();
  app.use(bodyParser.json({ limit: '3mb' }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cors());
  app.use(logMiddleware);

  app.get('/info', (req, res) => {
    res.send({ uptime: process.uptime(), version: projectConfig.version });
  });

  app.get('/', (req, res) => res.send({ ok: 1 }));

  const options: TypeORM.ConnectionOptions = {
    entities,
    name: DEFAULT,
    ...config.db as any
  };

  await TypeORM.createConnection(options);

  const resolvers = [];

  const tokenCtrl = new TokenCtrl();
  const schema: any = await createSchema(resolvers as any, tokenCtrl.createAuthChecker.bind(tokenCtrl));

  Container.set({ id: DI.logger, factory: () => logger });

  const server = new ApolloServer({
    schema,
    formatError,
    introspection: config.gql.introspection,
    playground: config.gql.playground ? {
      endpoint: '/playground'
    } : false,
    context: ({ req }): IContext => {
      return {
        req,
        tokenCtrl,
        authorization_token: req.headers.authorization
      };
    }
  });

  server.applyMiddleware({ app, path: '/' });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(config.rest.port, () => {
    logger.info(`Server ready on port ${ config.rest.port }`);
  });
  httpServer.setTimeout(4 * 60 * 1000);

  const grpcServer = new grpc.Server();

  addGRPCServices(grpcServer, tokenCtrl);

  const grpcPort = await new Promise((res, rej) =>
    grpcServer.bindAsync(
      `0.0.0.0:${ config.grpc.port }`,
      grpc.ServerCredentials.createInsecure(),
      ((error, port) => error ? rej(error) : res(port))
    )
  );

  if (grpcPort === 0) {
    throw new Error('grpc failed to start');
  }

  grpcServer.start();
  logger.info(`grpc started on port ${ config.grpc.port }`);

};

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(0);
});
