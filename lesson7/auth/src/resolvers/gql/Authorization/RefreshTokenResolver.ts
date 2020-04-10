import { Error as ApolloError } from 'common.libs/build/errors/Error';
import { errorTypes as commonErrorTypes } from 'common.libs/build/errors/ErrorTypes';
import { Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import config from '../../../config';
import { tokenTypes } from '../../../constants/authTokenTypes';
import errorsTypes from '../../../constants/errorsTypes';
import IContext from '../../../interfaces/IContext';
import { Account } from '../../../models/account/Account';
import { AccountToken } from '../../../models/account/AccountToken';
import { AccountTokenOutput } from '../../../models/account/output/AccountTokenOutput';
import { buildAccountTokenOutput } from './utils/userTokens';

@Resolver()
export default class RefreshTokenResolver {

  @InjectRepository(Account)
  private readonly accountRepository: Repository<Account>;
  @InjectRepository(AccountToken)
  private readonly accountTokenRepository: Repository<AccountToken>;

  @Authorized(tokenTypes.refresh)
  @Mutation(returnType => AccountTokenOutput)
  public async refreshAccessToken(
    @Ctx() { refresh, refresh_token, tokenCtrl }: IContext
  ): Promise<Partial<AccountTokenOutput>> {

    const refreshToken = refresh_token.replace('Bearer ', '');

    const isTokenExist = await this.accountTokenRepository.count({
      refresh: refreshToken,
      account: { id: refresh.accountId }
    });

    if (!isTokenExist) {
      throw new ApolloError(errorsTypes.wrongToken, commonErrorTypes.auth.unauthorized);
    }

    await this.accountTokenRepository.createQueryBuilder()
      .delete()
      .where({
        createdAt: LessThan(Date.now() - config.auth.jwtExpirationSeconds[tokenTypes.refresh] * 1000)
      })
      .orWhere('refresh = :refresh', { refresh: refreshToken })
      .execute();

    const account = await this.accountRepository.findOne({ id: refresh.accountId });
    return buildAccountTokenOutput(this.accountTokenRepository, account, tokenCtrl);
  }
}
