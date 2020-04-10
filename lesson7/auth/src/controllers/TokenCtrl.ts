import { Error as ApolloError } from 'common.libs/build/errors/Error';
import { errorTypes } from 'common.libs/build/errors/ErrorTypes';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import config from '../config';
import { tokenTypes } from '../constants/authTokenTypes';
import IToken from '../interfaces/IToken';
import { Account } from '../models/account/Account';

export default class TokenCtrl {

  public createAuthChecker({ context }, roles): boolean {

    const isAnyRoleExist = roles.find(role => tokenTypes[role]);

    if (!isAnyRoleExist) {
      throw new ApolloError(null, errorTypes.auth.AUTHORIZATION_FORBIDDEN_ERROR);
    }

    const tokenTypeMap = {
      [tokenTypes.account]: context.authorization_token,
      [tokenTypes.refresh]: context.refresh_token
    };

    const isAnyTokenSupplied = !!Object.values(tokenTypeMap).find(token => token);

    if (!isAnyTokenSupplied) {
      throw new ApolloError(null, errorTypes.auth.unauthorized);
    }

    const tokensMap = _.chain(tokenTypeMap)
      .toPairs()
      .filter(pair => roles.includes(pair[0]))
      .map(pair => [pair[0], this.parse(pair[0], pair[1])])
      .fromPairs()
      .value();

    const isAnyValidToken = !!Object.values(tokensMap).find(token => token);

    if (!isAnyValidToken) {
      throw new ApolloError(null, errorTypes.auth.unauthorized);
    }

    context.user = tokensMap[tokenTypes.account];
    context.refresh = tokensMap[tokenTypes.refresh];

    return true;
  }

  public parse(tokenType: string, authString: string): IToken {

    if (!authString) return null;

    const token = authString.replace('Bearer ', '');
    let parsedToken: any = null;
    try {
      parsedToken = jwt.verify(token, this.getSecret(tokenType));
    } catch (e) {
      return null;
    }
    if (parsedToken.sub !== tokenType) return null;
    return parsedToken;
  }

  public produce(tokenType: tokenTypes, account: Account, id: number): string {

    const expiration = config.auth.jwtExpirationSeconds[tokenType];
    const secret = this.getSecret(tokenType);

    const payload: IToken = {
      sub: tokenType,
      accountId: account.id,
      tokenId: id,
      email: account.email
    };

    return jwt.sign(
      payload,
      secret,
      { expiresIn: expiration }
    );
  }

  private getSecret = (type) => {
    const secrets = {
      [tokenTypes.account]: config.auth.jwtSecret.account,
      [tokenTypes.refresh]: config.auth.jwtSecret.refresh
    };
    return secrets[type];
  }

}
