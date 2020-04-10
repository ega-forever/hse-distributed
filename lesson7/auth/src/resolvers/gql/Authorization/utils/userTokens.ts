import { Repository } from 'typeorm';
import { tokenTypes } from '../../../../constants/authTokenTypes';
import TokenCtrl from '../../../../controllers/TokenCtrl';
import { Account } from '../../../../models/account/Account';
import { AccountToken } from '../../../../models/account/AccountToken';
import { AccountTokenOutput } from '../../../../models/account/output/AccountTokenOutput';

export const buildAccountTokenOutput = async (
  accountTokenRepository: Repository<AccountToken>,
  account: Account,
  tokenCtrl: TokenCtrl
): Promise<AccountTokenOutput> => {

  const refreshToken = tokenCtrl.produce(tokenTypes.refresh, account, null);

  const token = {
    account: { id: account.id },
    refresh: refreshToken
  };

  const accountToken = accountTokenRepository.create(token);
  await accountTokenRepository.save(accountToken);

  const accessToken = tokenCtrl.produce(tokenTypes.account, account, accountToken.id);

  return {
    ...token,
    access: accessToken
  };

};
