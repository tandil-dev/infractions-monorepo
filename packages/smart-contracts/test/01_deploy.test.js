/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('./InfractionFactory.sol');
const Infraction = artifacts.require('./Infraction.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('infractionFactory', () => {
  let infractionFactory;

  before(async () => {
    infractionFactory = await InfractionFactory.deployed();
  });

  describe('Deployment', async () => {
    it('Deploys successfully', async () => {
      const { address } = infractionFactory;
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });
});

contract('Infraction', () => {
  let infraction;

  before(async () => {
    infraction = await Infraction.deployed();
  });

  describe('Deployment', async () => {
    it('Deploys successfully', async () => {
      const { address } = infraction;
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });
});
