import { Express } from 'express';
import Message from '../../../models/Message';

export default async (req: Express.Request, res: any)=>{
  const messages = await Message.findAll();
  res.send(messages);
}