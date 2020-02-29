import * as express from 'express';
import getMessage from '../handlers/getMessage';
import addMessage from '../handlers/addMessage';


const init = (): express.Router => {
  const messagesRouter = express.Router();
  messagesRouter.get('/messages', (req, res) => getMessage(req, res));
  messagesRouter.post('/message', (req, res) => addMessage(req, res));

  return messagesRouter;
};

export default init;