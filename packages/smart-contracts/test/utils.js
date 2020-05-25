const Infraction = artifacts.require('Infraction');

const IPFS_HASH = 'hash123';
const VIDEO_URL = 'videoUrl';
const IMAGE_URL = 'imageUrl';

const getNewInfraction = async (infractionFactory, ipfsHash, videoUrl, imageUrl) => {
  const { receipt } = await infractionFactory
    .createInfraction(ipfsHash || IPFS_HASH, videoUrl || VIDEO_URL, imageUrl || IMAGE_URL);

  const { infractionAddress } = receipt.logs[1].args; // logs[0] is ownable
  return Infraction.at(infractionAddress);
};


module.exports = {
  getNewInfraction,
  IPFS_HASH,
  VIDEO_URL,
  IMAGE_URL,
};
