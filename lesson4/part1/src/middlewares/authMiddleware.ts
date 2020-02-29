import responses from '../constants/responses';

export default async (req, res) => {

  if (!req.session.user_id) {
    return res.status(401).send({ status: responses.generic.fail });
  }

  req.next();
}