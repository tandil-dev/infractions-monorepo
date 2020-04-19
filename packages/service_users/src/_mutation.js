const uuid = require("uuid");
const JWT = require("jsonwebtoken");
const { gql } = require("apollo-server");
const ethers = require('ethers');

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
      const { header, payload, signature, signingAddress } = decodeToken(token);


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

const decodeToken = (jwt) => {

  const decodedToken = JWT.decode(jwt);
  console.log({decodedToken,jwt});
  if(!decodedToken) throw new Error('JWT Token format is not valid');
  const { header, payload, signature} = decodedToken;

  const lastPeriod = jwt.lastIndexOf('.');

  const signedMessage = jwt.substring(0, lastPeriod);
  const sigatureB64 = jwt.substring(lastPeriod + 1);

  const signatureB16 = (Buffer.from(sigatureB64.toString().replace('-', '+').replace('_', '/'), 'base64')).toString('hex');
  const hashedMessage = ethers.utils.hashMessage(signedMessage);
  const signingAddress = ethers.utils.recoverAddress(hashedMessage, `0x${signatureB16}`);

  if(payload.iss !== signingAddress ) throw new Error("Token es false!");

  return { header, payload, signature, signingAddress };
};
