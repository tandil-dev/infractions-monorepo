const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.secret || "SECRET_KEY";

const gateway = new ApolloGateway({
  // This entire `serviceList` is optional when running in managed federation
  // mode, using Apollo Graph Manager as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  serviceList: [
    { name: "users", url: "http://localhost:4001/graphql" },
    // { name: "reviews", url: "http://localhost:4002/graphql" },
    // { name: "products", url: "http://localhost:4003/graphql" },
    // { name: "inventory", url: "http://localhost:4004/graphql" }
  ],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set(
          "x-user-data",
          JSON.stringify((context && context.userData) || {})
        );
      },
    });
  },

  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});

(async () => {
  const server = new ApolloServer({
    gateway,

    // Apollo Graph Manager (previously known as Apollo Engine)
    // When enabled and an `ENGINE_API_KEY` is set in the environment,
    // provides metrics, schema management and trace reporting.
    engine: false,

    // Subscriptions are unsupported but planned for a future Gateway version.
    subscriptions: false,
    context: ({ req }) => {
      // get the user token from the headers
      const context = {};
      const token = req.headers.authorization || "";
      context.token = token;
      if (token) {
        try {
          const userData = jwt.verify(token, SECRET_KEY);
          context.userData = userData;
        } catch (e) {
          console.log("invalid TOKEN");
        }
      }
      return context;
    },
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
