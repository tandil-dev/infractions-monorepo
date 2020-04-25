const uuid = require("uuid");
const { JWT } = require('jose');
const { gql } = require("apollo-server");
const { validateLogin } = require("./db")

const SECRET_KEY = process.env.secret || "SECRET_KEY"

const typeDefs = gql`
  extend type Mutation {
    addUser: User
    loginWithMetamask(token: String): Token
    login(user: String!, password: String!): Token
  }
`;

const resolvers = {
  Mutation: {
    addUser: () => null,

    loginWithMetamask: (parent, { token }, context) => {
      console.log(context.token)
      
      return {
        token: JWT.sign(
          { id: uuid.v4(), otroDato: "hola mundo" },
          SECRET_KEY,
          { expiresIn: "24h" }
        ),
      };
    },

    login: (parent, {user, password}, context) => {
      console.log(user , password)
      if(!validateLogin(user, password)) throw new Error();
      return {
        token: JWT.sign(
          { id: uuid.v4(), otroDato: "hola mundo" },
          SECRET_KEY,
          { expiresIn: "24h" }
        ),
      };
    }
  },
};


module.exports = {
  typeDefs,
  resolvers,
};

