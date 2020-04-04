const { gql } = require('apollo-server');

const typeDefs = gql`
  input UserCredentials {
    email: String!
    password: String!
  }
`;

module.exports = {
  typeDefs,
};
