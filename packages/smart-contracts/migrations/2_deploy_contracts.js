const InfractionFactory = artifacts.require('InfractionFactory');
const RewardsTandil = artifacts.require('RewardsTandil');
const Roles = artifacts.require('Roles');

module.exports = async (deployer) => {
  await deployer.deploy(RewardsTandil);
  await deployer.deploy(Roles);
  await deployer.deploy(InfractionFactory, RewardsTandil.address);
};
