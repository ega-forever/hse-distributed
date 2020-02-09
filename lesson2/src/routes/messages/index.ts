import * as express from 'express';
import getMessage from '../../handlers/messages/getMessage';
import addMessage from '../../handlers/messages/addMessage';


const init = (): express.Router => {
  const messagesRouter = express.Router();
  messagesRouter.get('/messages', (req, res) => getMessage(req, res));
  messagesRouter.post('/message', (req, res) => addMessage(req, res));

  return messagesRouter;
};

export default init;