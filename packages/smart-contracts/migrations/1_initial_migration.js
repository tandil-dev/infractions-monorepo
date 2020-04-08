const Migrations = artifacts.require('Migrations');

module.exports = function deployContracts(deployer) {
  deployer.deploy(Migrations);
};
