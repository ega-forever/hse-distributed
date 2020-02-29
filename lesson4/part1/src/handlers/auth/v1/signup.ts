import responses from '../../../constants/responses';
import User from '../../../models/User';

export default async (req, res) => {

  console.log(req.body)

  const isUserExist = await User.count({username: req.body.username});

  if(isUserExist){
    return res.send({status: responses.auth.userExist})
  }

  await User.create({
    username: req.body.username,
    password: req.body.password
  });

  res.send({ status: responses.generic.success });
}