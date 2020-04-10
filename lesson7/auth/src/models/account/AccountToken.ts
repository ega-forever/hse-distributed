import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Account } from './Account';

@ObjectType()
@Entity()
export class AccountToken {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Account)
  public account: Account;

  @RelationId((token: AccountToken) => token.account) // you need to specify target relation
  public accountId: number;

  @Field()
  @Column({ type: 'text' })
  public refresh: string;

  @Column({ type: 'bigint' })
  public createdAt?: number;

  @BeforeInsert()
  public setCreatedAt() {
    this.createdAt = Date.now();
  }
}
