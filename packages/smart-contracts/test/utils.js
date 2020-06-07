const Infraction = artifacts.require('Infraction');

const DATA_HASH = 'dataHash123';
const DOMAIN_IMAGE_HASH = 'domainImageUrl';

const getNewInfraction = async (infractionFactory, dataHash, domainImageHash) => {
  const { receipt } = await infractionFactory
    .createInfraction(dataHash || DATA_HASH, domainImageHash || DOMAIN_IMAGE_HASH);

  const { infractionAddress } = receipt.logs[1].args; // logs[0] is ownable
  return Infraction.at(infractionAddress);
};


module.exports = {
  getNewInfraction,
  DATA_HASH,
  DOMAIN_IMAGE_HASH,
};
