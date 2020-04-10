import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { errorTypes } from './ErrorTypes';
import CustomError from './CustomError';
import { ApolloError } from 'apollo-server-errors';


export function formatError(error: GraphQLError): GraphQLFormattedError {

  if (error.originalError instanceof ApolloError) {
    return new CustomError(error.message, error.originalError.extensions.code);
  }

  return new CustomError(error.message, errorTypes.server);
}
