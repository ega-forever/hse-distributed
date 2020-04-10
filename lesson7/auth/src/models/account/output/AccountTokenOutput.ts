import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AccountTokenOutput {

  @Field({ nullable: true })
  public access?: string;

  @Field({ nullable: true })
  public refresh?: string;

}
