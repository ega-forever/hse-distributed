import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Message {

  @Field(type => String)
  @ObjectIdColumn()
  public id: ObjectID;

  @Field()
  @Column()
  public recipientId: number;

  @Field()
  @Column()
  public senderId: number;

  @Field()
  @Column()
  public message: string;

  @Field()
  @Column({ type: 'bigint' })
  public createdAt: number;

  @BeforeInsert()
  public setInitialData() {
    this.createdAt = Date.now();
  }

}
