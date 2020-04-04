const { gql } = require('apollo-server');


const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];

const typeDefs = gql`
  extend type Query {
    me: User
  }
`;

const resolvers = {
  Query: {
    me: () => users[0],
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
