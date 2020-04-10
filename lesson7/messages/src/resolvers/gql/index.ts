import { AuthChecker, buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { accountResolvers } from './messages';

export const createSchema = (extra = [], authChecker: AuthChecker) => {
  return buildSchema({
    authChecker,
    resolvers: [
      ...extra,
      ...accountResolvers
    ],
    container: Container
  });
};
