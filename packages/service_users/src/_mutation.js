const uuid = require("uuid");
const jwt = require("jsonwebtoken");
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
      if (!validateToken(token)) throw new Error("the correct token is 123");
      return {
        token: jwt.sign(
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

const validateToken = (token) => {
  if (token === "123") return true;
  return false;
};
