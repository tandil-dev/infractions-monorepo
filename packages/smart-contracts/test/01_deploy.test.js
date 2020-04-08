/* eslint-env node, mocha */
const Infractions = artifacts.require('./Infractions.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Infractions', () => {
  let infraction;

  before(async () => {
    infraction = await Infractions.deployed();
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
