/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('InfractionFactory');

const { getNewInfraction } = require('./utils');

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
    const infractionFactory = await InfractionFactory.deployed();
    infraction = await getNewInfraction(infractionFactory);
  });

  describe('Deployment', async () => {
    it('Deploys successfully', async () => {
      const { address } = infraction;
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('Should have factory address', async () => {
      const factoryAddress = await infraction.factory();
      assert.notEqual(factoryAddress, '');
      assert.notEqual(factoryAddress, 0x0);
      assert.notEqual(factoryAddress, null);
      assert.notEqual(factoryAddress, undefined);
    });
  });
});
