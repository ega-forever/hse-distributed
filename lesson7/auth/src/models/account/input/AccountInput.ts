import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Account } from '../Account';

@InputType()
export class AccountSignInInput implements Partial<Account> {
  @Field()
  @IsEmail()
  public email: string;

  @Field()
  @MinLength(5)
  public password: string;

}

@InputType()
export class AccountSignUpInput implements Partial<Account> {
  @Field()
  @IsEmail()
  public email: string;

  @Field()
  @MinLength(5)
  public password: string;

  @Field()
  public name: string;
}
