const { JWT } = require('jose');
const ethers = require('ethers');

const decodeToken = (jwt) => {

    const decodedToken = JWT.decode(jwt, { complete: true });

    if (!decodedToken) throw new Error('JWT Token format is not valid');
    const { header, payload, signature } = decodedToken;

    const lastPeriod = jwt.lastIndexOf('.');

    const signedMessage = jwt.substring(0, lastPeriod);
    const sigatureB64 = jwt.substring(lastPeriod + 1);

    const signatureB16 = (Buffer.from(sigatureB64.toString().replace('-', '+').replace('_', '/'), 'base64')).toString('hex');
    const hashedMessage = ethers.utils.hashMessage(signedMessage);
    const signingAddress = ethers.utils.recoverAddress(hashedMessage, `0x${signatureB16}`);

    if (payload.iss !== signingAddress) throw new Error("Token es false!");

    return { header, payload, signature, signingAddress };
};

module.exports = { decodeToken }