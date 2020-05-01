const InfractionFactory = artifacts.require('InfractionFactory');

module.exports = function deployContracts(deployer) {
  deployer.deploy(InfractionFactory);
};
