const uuid = require("uuid");
const { JWT } = require('jose');
const { gql } = require("apollo-server");

const SECRET_KEY = process.env.secret || "SECRET_KEY"

const typeDefs = gql`
  extend type Mutation {
    addUser: User
    login(token: String): Login
  }
`;

const resolvers = {
  Mutation: {
    addUser: () => null,
    login: (parent, { token }, context) => {
      console.log(context.userData)
      
      return {
        token: JWT.sign(
          { id: uuid.v4(), otroDato: "hola mundo" },
          SECRET_KEY,
          { expiresIn: "24h" }
        ),
      };
    },
  },
};


module.exports = {
  typeDefs,
  resolvers,
};

