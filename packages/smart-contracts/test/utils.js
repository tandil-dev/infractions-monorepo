const Infraction = artifacts.require('Infraction');

const getNewInfraction = async (infractionFactory) => {
  const { receipt } = await infractionFactory.createInfraction();
  const { infractionAddress } = receipt.logs[0].args;
  return Infraction.at(infractionAddress);
};


module.exports = {
  getNewInfraction,
};
