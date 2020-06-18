/* eslint-env node, mocha */

const InfractionFactory = artifacts.require('InfractionFactory');
const RewardsTandil = artifacts.require('RewardsTandil');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const { getNewInfraction } = require('./utils');

const { BN } = web3.utils;

contract('Rewards Centinela', (accounts) => {
  let infraction;
  let rewards;
  beforeEach(async () => {
    const infractionFactory = await InfractionFactory.deployed();
    rewards = await RewardsTandil.deployed();
    infraction = await getNewInfraction(infractionFactory);
  });
  it('Pay rewards in UF to users', async () => {
    const requitedVotes = await infraction.requitedVotes();
    const initialStage = await infraction.stage();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(true, { from: accounts[i] });
    }

    assert.equal(initialStage.add((new BN('1'))).toString(), (await infraction.stage()).toString());

    expectEvent(await infraction.departamentApproves(), 'approvedByDepartment');
    expectEvent(await infraction.courtApproves(30), 'approvedByCourt');
    expectEvent(await infraction.setPaid(), 'paid');

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < accounts.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      const amount = await rewards.balanceOf(accounts[index]);
      assert.equal(amount, 0);
    }

    await rewards.claimReward(infraction.address);
    const reporterAmount = await rewards.balanceOf(accounts[0]);
    assert.equal(reporterAmount, 30);

    // eslint-disable-next-line no-plusplus
    for (let index = 1; index < accounts.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      const amount = await rewards.balanceOf(accounts[index]);
      assert.equal(amount, 0);
    }
  });
});
