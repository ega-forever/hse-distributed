import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { tokenTypes } from 'common.libs/build/services/auth/constants/authTokenTypes';
import IContext from '../../../interfaces/IContext';
import { Message } from '../../../models/message/Message';

@Resolver()
export default class MessagesResolver {

  @InjectRepository(Message)
  private messageRepository: MongoRepository<Message>;

  @Authorized(tokenTypes.account)
  @Query(returns => [Message])
  public async messages(
    @Ctx() context: IContext,
    @Arg('skip', type => Number, { nullable: true }) skip?: number,
    @Arg('limit', type => Number, { nullable: true }) limit?: number
  ): Promise<Message[]> {
    return await this.messageRepository.find({
      where: {
        $or: [
          {recipientId: context.user.accountId},
          {senderId: context.user.accountId}
        ]
      },
      skip,
      take: !limit || limit > 50 ? 50 : limit
    });
  }
}
