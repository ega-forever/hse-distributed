import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { tokenTypes } from 'common.libs/build/services/auth/constants/authTokenTypes';
import IContext from '../../../interfaces/IContext';
import { Message } from '../../../models/message/Message';

@Resolver()
export default class MessagesMutations {

  @InjectRepository(Message)
  private readonly messageRepository: MongoRepository<Message>;

  @Authorized(tokenTypes.account)
  @Mutation(returns => Message)
  public async sendMessage(
    @Arg('message', type=> String) message: string,
    @Arg('recipientId', type=> Number) recipientId: number,
    @Ctx() context: IContext
  ): Promise<Message> {
    const messageObj = this.messageRepository.create({
      message,
      recipientId,
      senderId: context.user.accountId
    });

    await this.messageRepository.save(messageObj);
    return messageObj;
  }
}
