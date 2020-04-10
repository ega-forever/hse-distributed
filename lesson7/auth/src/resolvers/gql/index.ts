import { AuthChecker, buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { accountResolvers } from './account';
import { authResolvers } from './Authorization';

export const createSchema = (extra = [], authChecker: AuthChecker) => {
  return buildSchema({
    authChecker,
    resolvers: [
      ...extra,
      ...accountResolvers,
      ...authResolvers
    ],
    container: Container
  });
};
