const { gql } = require("apollo-server");

const typeDefs = gql`
  type cualquiera{
    nombre: String
  }
`;

module.exports = {
  typeDefs,
};
