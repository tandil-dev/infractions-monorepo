/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('./InfractionFactory.sol');
const Infraction = artifacts.require('./Infraction.sol');
const { expectEvent } = require('@openzeppelin/test-helpers');

require('chai')
  .use(require('chai-as-promised'))
  .should();

// eslint-disable-next-line no-unused-vars
contract('infractionFactory', ([owner, other, ...accounts]) => {
  let infractionFactory;

  before(async () => {
    infractionFactory = await InfractionFactory.deployed();
  });

  describe('Infraction Factory', async () => {
    it('Create infractions', async () => {
      const r = await infractionFactory.createInfraction();
      const address = r.logs[0];
      expectEvent(r, 'infractionCreated');
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it('Get amount of infractions by User', async () => {
      const initialAmountOfInfractions = await infractionFactory.getAmountOfInfractionByUser(other);
      assert.equal(initialAmountOfInfractions, 0);
      await infractionFactory.createInfraction({ from: other });
      await infractionFactory.createInfraction({ from: other });
      await infractionFactory.createInfraction({ from: other });
      const amountOfInfractions = await infractionFactory.getAmountOfInfractionByUser(other);
      assert.equal(amountOfInfractions, 3);
    });
    it('Get all infraction addresses', async () => {
      const amountOfInfractions = await infractionFactory.getAmountOfInfractionByUser(other);

      for (let i = 0; i < amountOfInfractions; i++) {
        const infractionAddress = await infractionFactory.getAddressByUserAndIndex(other, i);
        assert.notEqual(infractionAddress, '');
        assert.notEqual(infractionAddress, 0x0);
        assert.notEqual(infractionAddress, null);
        assert.notEqual(infractionAddress, undefined);
        const instance = await Infraction.at(infractionAddress);
        await instance.stage();
      }
    });
  });
});
