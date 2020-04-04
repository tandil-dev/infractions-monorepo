const { gql } = require('apollo-server');

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers,
}