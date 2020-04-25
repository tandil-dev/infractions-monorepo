const { gql } = require('apollo-server');




const typeDefs = gql`
  extend type Query {
    me: User
  }
`;

//FUNCTIONS
const verifyPermissions = (userData) => {
  if(!userData.id) throw new Error("no user Data!")
}

//RESOLVERS
const resolvers = {
  Query: {
    me: (parent, params, context) => {
      verifyPermissions(context.userData)
      return users[0]
    }
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
