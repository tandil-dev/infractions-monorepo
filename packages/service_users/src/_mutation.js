const { gql } = require('apollo-server');

const typeDefs = gql`
  extend type Mutation {
    addUser: User
  }
`;

const resolvers = {
  Mutation: {
    addUser: () => null,
  },
};

module.exports = {
  typeDefs,
  resolvers,
}
