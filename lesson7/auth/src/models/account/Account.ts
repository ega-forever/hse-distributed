import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AccountToken } from './AccountToken';

@ObjectType()
@Entity()
export class Account {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column({ unique: true })
  public email: string;

  @Field()
  @Column()
  public name: string;

  @Column()
  public passwordHash: string;

  @Column()
  public passwordSalt: string;


  @Field(type => [AccountToken])
  @OneToMany(type => AccountToken, token => token.account, { cascade: true })
  public accessToken?: AccountToken[];

  @Field()
  @Column({ type: 'bigint' })
  public createdAt: number;

  @Field()
  @Column({ type: 'bigint' })
  public updatedAt: number;

  @BeforeInsert()
  public setInitialData() {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  @BeforeUpdate()
  public setUpdatedDate() {
    this.updatedAt = Date.now();
  }

}
