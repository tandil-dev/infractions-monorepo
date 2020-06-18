/* eslint-disable radix */
/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('InfractionFactory');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const { getNewInfraction } = require('./utils');

const { BN } = web3.utils;

require('chai')
  .use(require('chai-as-promised'))
  .should();

const url = 'https://somoeUrl.io/someJson.json';

contract('Infraction', (accounts) => {
  let infraction;
  beforeEach(async () => {
    const infractionFactory = await InfractionFactory.deployed();
    infraction = await getNewInfraction(infractionFactory);
  });
  it('Happy path =)', async () => {
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
  });
  it('Happy path with rejections', async () => {
    const requitedVotes = await infraction.requitedVotes();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(false, { from: accounts[i] });
    }
    expectEvent(await infraction.addProof(url), 'newProof', { url });

    const requitedVotesSecondTime = await infraction.requitedVotes();
    const initialSecondTime = parseInt(requitedVotes) + 1;
    const limitSecondTime = parseInt(requitedVotes) + parseInt(requitedVotesSecondTime) + 1;
    // eslint-disable-next-line no-plusplus
    for (let i = initialSecondTime; i <= limitSecondTime; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(true, { from: accounts[i] });
    }

    expectEvent(await infraction.departamentRejects(), 'rejectedByDepartment');
    expectEvent(await infraction.addProof(url), 'newProof', { url });
    expectEvent(await infraction.departamentApproves(), 'approvedByDepartment');
    expectEvent(await infraction.courtRejects(), 'rejectedByCourt');
    expectEvent(await infraction.addProof(url), 'newProof', { url });
    expectEvent(await infraction.courtApproves(30), 'approvedByCourt');
    expectEvent(await infraction.setPaid(), 'paid');
  });


  it('communityRejects', async () => {
    const requitedVotes = await infraction.requitedVotes();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(false, { from: accounts[i] });
    }

    expectEvent(await infraction.reject(), 'rejected');
  });
  it('departamentRejects', async () => {
    const requitedVotes = await infraction.requitedVotes();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(true, { from: accounts[i] });
    }
    expectEvent(await infraction.departamentRejects(), 'rejectedByDepartment');
    expectEvent(await infraction.reject(), 'rejected');
  });
  it('courtRejects', async () => {
    const requitedVotes = await infraction.requitedVotes();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(true, { from: accounts[i] });
    }
    await infraction.departamentApproves();
    expectEvent(await infraction.courtRejects(), 'rejectedByCourt');
    expectEvent(await infraction.reject(), 'rejected');
  });
  it('onlyRejected', async () => {
    const stage = await infraction.stage();
    assert.equal(stage, 0);
    await expectRevert(infraction.reject(), 'Only previously rejected');
  });
  it('onlyIssued', async () => {
    const stage = await infraction.stage();
    assert.equal(stage, 0);
    await expectRevert(infraction.setPaid(), 'Only issued');
  });
});
