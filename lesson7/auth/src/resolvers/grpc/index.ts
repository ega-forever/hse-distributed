import * as grpc from 'grpc';
import TokenCtrl from '../../controllers/TokenCtrl';
import TokenValidationResolver from './TokenValidationResolver';

export const addGRPCServices = (server: grpc.Server, tokenCtrl: TokenCtrl) => {

  const tokenValidationResolver = new TokenValidationResolver(tokenCtrl);
  tokenValidationResolver.register(server);

};
