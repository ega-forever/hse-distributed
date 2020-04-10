import * as bunyan from 'bunyan';
import config from '../config';
const logger = bunyan.createLogger({ name: 'core.rest.middleware', level: config.logLevel });

export default (req, res, next) => {

  logger.info({
    fromIP: req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress,
    method: req.method,
    originalUri: req.originalUrl,
    uri: req.url,
    requestData: req.body,
    referer: req.headers.referer || '',
    ua: req.headers['user-agent']
  });

  next();
};
