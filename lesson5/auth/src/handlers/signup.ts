import responses from '../constants/responses';
import User from '../models/User';

export default async (req, res) => {

  const isUserExist = await User.count({username: req.body.username});

  if(isUserExist){
    return res.send({status: responses.auth.userExist})
  }

  await User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  res.send({ status: responses.generic.success });
}