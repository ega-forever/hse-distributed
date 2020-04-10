import { ApolloServer } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as bunyan from 'bunyan';
import { formatError } from 'common.libs/build/errors/ErrorFormatter';
import { AuthService } from 'common.libs/build/services/auth/services/AuthService';
import * as express from 'express';
import * as cors from 'express-cors';
import 'reflect-metadata';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import * as projectConfig from '../package.json';
import config from './config';
import { DEFAULT } from './constants/connections';
import { DI } from './constants/DI';
import logMiddleware from './middleware/logger';
import { entities } from './models';
import { createSchema } from './resolvers/gql';
import http = require('http');

const logger = bunyan.createLogger({ name: 'messages.service' });

TypeORM.useContainer(Container);

const bootstrap = async () => {
  const app = express();
  app.use(bodyParser.json({ limit: '3mb' }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cors());
  app.use(logMiddleware);

  Container.set({ id: DI.logger, factory: () => logger });

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

  const authService = new AuthService(config.services.auth.uri);
  const schema: any = await createSchema(resolvers as any, authService.createAuthChecker.bind(authService));

  const server = new ApolloServer({
    schema,
    formatError,
    introspection: config.gql.introspection,
    playground: config.gql.playground ? {
      endpoint: '/playground'
    } : false,
    context: ({ req }) => {
      return {
        req,
        authorization_token: req.headers.authorization,
        refresh_token: req.headers['refresh-token']
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
};

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(0);
});
