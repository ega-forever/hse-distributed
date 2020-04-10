import * as contracts from 'common.libs';
import * as grpc from 'grpc';
import TokenCtrl from '../../controllers/TokenCtrl';
import IGRPCResolver from '../../interfaces/IGRPCResolver';
import { Error as ApolloError } from 'common.libs/build/errors/Error';
import { errorTypes as commonErrorTypes } from 'common.libs/build/errors/ErrorTypes';

export default class TokenValidationResolver implements IGRPCResolver {

  private readonly tokenCtrl: TokenCtrl;

  constructor(tokenCtrl: TokenCtrl) {
    this.tokenCtrl = tokenCtrl;
  }

  public register(server: grpc.Server): void {
    const { token_validation: tokenValidationProto } = grpc.loadPackageDefinition(contracts.grpc.services.auth.tokenValidation());

    // @ts-ignore
    server.addService(tokenValidationProto.TokenValidation.service, {
      validate: this.validate.bind(this)
    });
  }

  private validate(call, callback) {
    const token = this.tokenCtrl.parse(call.request.type, call.request.token);
    if (token) {
      return callback(null, { accountId: token.accountId, tokenId: token.tokenId, email: token.email, error: null });
    }

    callback(null, {
      accountId: null,
      tokenId: null,
      email: null,
      error: new ApolloError(null, commonErrorTypes.auth.unauthorized)
    });
  }
}
