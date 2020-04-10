import * as grpc from 'grpc';
import { tokenTypes } from '../constants/authTokenTypes';
import IToken from '../interfaces/IToken';
import { definitions } from '../../../grpc';
import {Error as ApolloError} from '../../../errors/Error';
import { errorTypes } from '../../../errors/ErrorTypes';

export class AuthService {

  private readonly client;

  constructor(uri: string) {

    const { token_validation: tokenValidationProto } = grpc.loadPackageDefinition(definitions.services.auth.tokenValidation());

    // @ts-ignore
    this.client = new tokenValidationProto.TokenValidation(uri, grpc.credentials.createInsecure());
  }

  public async createAuthChecker({ context }, roles: tokenTypes[]): Promise<boolean> {

    const isAnyRoleExist = roles.find(role => tokenTypes[role]);

    if (!isAnyRoleExist) {
      throw new ApolloError(null, errorTypes.auth.forbidden);
    }

    const tokenTypeMap = {
      [tokenTypes.account]: context.authorization_token,
      [tokenTypes.refresh]: context.refresh_token
    };

    const isAnyTokenSupplied = !!Object.values(tokenTypeMap).find(token => token);

    if (!isAnyTokenSupplied) {
      throw new ApolloError(null, errorTypes.auth.unauthorized);
    }

    const tokensMap = {};

    for (const role of roles) {
      if (!tokenTypeMap[role]) {
        continue;
      }

      tokensMap[role] = await this.validate(role, tokenTypeMap[role]);
    }

    const isAnyValidToken = !!Object.values(tokensMap).find(token => token);

    if (!isAnyValidToken) {
      throw new ApolloError(null, errorTypes.auth.unauthorized);
    }

    context.user = tokensMap[tokenTypes.account];
    context.refresh = tokensMap[tokenTypes.refresh];
    return true;
  }

  private async validate(type: string, token: string): Promise<IToken> {

    const result: { error: string, accountId: string, tokenId: string, email: string } = await new Promise((res, rej) =>
      this.client.validate({ type, token }, (err, data) => err ? rej(err) : res(data))
    );

    if (result.error) {
      throw new ApolloError(null, errorTypes.auth.unauthorized);
    }

    return {
      accountId: parseInt(result.accountId, 10),
      tokenId: parseInt(result.tokenId, 10),
      email: result.email
    };
  }

}
