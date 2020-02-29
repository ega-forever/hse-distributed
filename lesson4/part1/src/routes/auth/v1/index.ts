import * as express from 'express';
import getMessage from '../../../handlers/messages/v1/getMessage';
import addMessage from '../../../handlers/messages/v1/addMessage';
import authenticate from '../../../handlers/auth/v1/authenticate';
import signup from '../../../handlers/auth/v1/signup';


const init = (): express.Router => {
  const authRouter = express.Router();
  authRouter.post('/auth', (req, res) => authenticate(req, res));
  authRouter.post('/signup', (req, res) => signup(req, res));

  return authRouter;
};

export default init;