import { Express } from 'express';
import Message from '../../../models/Message';

export default async (req: Express.Request, res: any)=>{
  const messages = await Message.find();
  const count = await Message.count({});
  res.send({
    items: messages,
    count: count
  });
}