import responses from '../constants/responses';
import config from '../config';
import * as request from 'request-promise';

export default async (req, res) => {

  if (!req.headers.authorization) {
    return res.status(401).send({ status: responses.generic.fail });
  }

  const response = await request({
    method: 'POST',
    uri: `${ config.auth.uri }/validate`,
    json: {
      token: req.headers.authorization
    }
  }).catch(() => null);

  if(response === null){
    return res.status(500).send({ status: responses.generic.fail });
  }

  if(response.status === responses.generic.fail){
    return res.status(401).send({ status: responses.generic.fail });
  }

  // @ts-ignore
  req.userId = response.data.userId;

  req.next();
}