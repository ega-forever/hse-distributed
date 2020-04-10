import { Error as ApolloError } from 'common.libs/build/errors/Error';
import { errorTypes as commonErrorTypes } from 'common.libs/build/errors/ErrorTypes';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import config from '../../../config';
import { tokenTypes } from '../../../constants/authTokenTypes';
import errorsTypes from '../../../constants/errorsTypes';
import IContext from '../../../interfaces/IContext';
import { Account } from '../../../models/account/Account';
import { AccountToken } from '../../../models/account/AccountToken';
import { AccountSignInInput, AccountSignUpInput } from '../../../models/account/input/AccountInput';
import { AccountTokenOutput } from '../../../models/account/output/AccountTokenOutput';
import { cryptoUtils } from '../../../utils/cryptoUtils';
import { buildAccountTokenOutput } from '../Authorization/utils/userTokens';

@Resolver()
export default class AccountMutations {

  @InjectRepository(Account)
  private readonly accountRepository: Repository<Account>;
  @InjectRepository(AccountToken)
  private readonly accountTokenRepository: Repository<AccountToken>;

  @Mutation(returns => Boolean)
  public async signUp(
    @Arg('accountInput') input: AccountSignUpInput,
    @Ctx() context: IContext
  ): Promise<boolean> {
    const { email, password, name } = input;

    const passwordSalt = cryptoUtils.genRandomString(32);
    const passwordHash = cryptoUtils.sha512(password, passwordSalt);

    const account = this.accountRepository.create({
      email,
      name,
      passwordHash,
      passwordSalt
    });

    await this.accountRepository.save(account);
    return true;
  }

  @Mutation(returns => AccountTokenOutput)
  public async signIn(
    @Arg('accountInput') { email, password }: AccountSignInInput,
    @Ctx() context: IContext
  ): Promise<AccountTokenOutput> {
    const account = await this.accountRepository.findOne({ email });
    if (!account) throw new ApolloError(null, commonErrorTypes.auth.unauthorized);

    const generatedHash = cryptoUtils.sha512(password, account.passwordSalt);

    if (generatedHash !== account.passwordHash) {
      throw new ApolloError(errorsTypes.wrongCredentials, commonErrorTypes.auth.unauthorized);
    }

    await this.accountTokenRepository.delete({
      createdAt: LessThan(Date.now() - config.auth.jwtExpirationSeconds[tokenTypes.refresh] * 1000)
    });

    return buildAccountTokenOutput(this.accountTokenRepository, account, context.tokenCtrl);
  }
}
