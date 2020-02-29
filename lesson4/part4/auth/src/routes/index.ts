import * as express from 'express';
import signin from '../handlers/signin';
import signup from '../handlers/signup';
import refresh from '../handlers/refresh';
import validate from '../handlers/validate';

const init = (): express.Router => {
  const authRouter = express.Router();
  authRouter.post('/signin', (req, res) => signin(req, res));
  authRouter.post('/signup', (req, res) => signup(req, res));
  authRouter.post('/refresh', (req, res) => refresh(req, res));
  authRouter.post('/validate', (req, res) => validate(req, res));

  return authRouter;
};

export default init;