import { Error as ApolloError } from 'common.libs/build/errors/Error';
import { errorTypes as commonErrorTypes } from 'common.libs/build/errors/ErrorTypes';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { tokenTypes } from '../../../constants/authTokenTypes';
import errorsTypes from '../../../constants/errorsTypes';
import IContext from '../../../interfaces/IContext';
import { Account } from '../../../models/account/Account';

@Resolver()
export default class AccountResolver {

  @InjectRepository(Account)
  private accountRepository: Repository<Account>;

  @Authorized(tokenTypes.account)
  @Query(returns => Account, { description: 'Lets find yourself' })
  public async me(
    @Ctx() context: IContext,
    @Arg('relations', type => [String], { nullable: true }) relations?: string[]
  ): Promise<Account> {

    const account = await this.accountRepository.findOne(context.user.accountId);

    if (!account) {
      throw new ApolloError(errorsTypes.wrongCredentials, commonErrorTypes.auth.unauthorized);
    }

    return account;
  }

}
