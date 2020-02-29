import * as express from 'express';
import signin from '../../../handlers/auth/v1/signin';
import signup from '../../../handlers/auth/v1/signup';
import refresh from '../../../handlers/auth/v1/refresh';


const init = (): express.Router => {
  const authRouter = express.Router();
  authRouter.post('/signin', (req, res) => signin(req, res));
  authRouter.post('/signup', (req, res) => signup(req, res));
  authRouter.post('/refresh', (req, res) => refresh(req, res));

  return authRouter;
};

export default init;