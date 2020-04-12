const { ApolloServer } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const inputs = require("./_input");
const mutations = require("./_mutation");
const queries = require("./_query");
const types = require("./_type");

const server = new ApolloServer({
  schema: buildFederatedSchema([inputs, queries, mutations, types]),
  context: ({ req }) => {
    const context = {};
    if (req && req.headers && req.headers["x-user-data"]) {
      context.userData = JSON.parse(req.headers["x-user-data"]);
    } else {
      console.log("no context");
    }
    return context;
  },
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
