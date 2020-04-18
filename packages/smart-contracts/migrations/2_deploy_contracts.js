const InfractionFactory = artifacts.require('InfractionFactory');
const Infraction = artifacts.require('Infraction');

module.exports = function deployContracts(deployer) {
  deployer.deploy(InfractionFactory);
  deployer.deploy(Infraction);
};
