import { GraphQLFormattedError } from 'graphql';

export default class CustomError implements GraphQLFormattedError {
  public readonly message: string;
  public readonly code: string;

  public constructor(message: string, code: string) {
    this.message = message;
    this.code = code;
  }

}