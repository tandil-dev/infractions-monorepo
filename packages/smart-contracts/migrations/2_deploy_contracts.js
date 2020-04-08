const Infractions = artifacts.require("Infractions");

module.exports = function deployContracts(deployer) {
  deployer.deploy(Infractions);
};
