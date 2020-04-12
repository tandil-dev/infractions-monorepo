const { gql } = require("apollo-server");

const typeDefs = gql`
  input UserCredentials {
    email: String!
    password: String!
  }
  type Login {
    token: String
  }
`;

module.exports = {
  typeDefs,
};
