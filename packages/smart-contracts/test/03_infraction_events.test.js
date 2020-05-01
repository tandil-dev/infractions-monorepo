/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('InfractionFactory');
const Infraction = artifacts.require('Infraction');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const { getNewInfraction } = require('./utils');

require('chai')
  .use(require('chai-as-promised'))
  .should();

const url = 'https://somoeUrl.io/someJson.json';

contract('Infraction', () => {
  let infraction;

  describe('Events', async () => {
    beforeEach(async () => {
      const infractionFactory = await InfractionFactory.deployed();
      infraction = await getNewInfraction(infractionFactory);
    });
    it('Happy path =)', async () => {
      expectEvent(await infraction.setReady(), 'ready');
      expectEvent(await infraction.communityApproves(), 'approvedByComunity');
      expectEvent(await infraction.departamentApproves(), 'approvedByDepartment');
      expectEvent(await infraction.courtApproves(), 'approvedByCourt');
      expectEvent(await infraction.endVolunteerPayment(), 'volunteerPaimentPeriodEnds');
      expectEvent(await infraction.endRegularPayment(), 'regularPaimentPeriodEnds');
      expectEvent(await infraction.endOverduePayment(), 'overduePaimentPeriodEnds');
      expectEvent(await infraction.setPaid(), 'paid');
      expectEvent(await infraction.setClaimed(), 'claimed');
    });
    it('Happy path with rejections', async () => {
      expectEvent(await infraction.setReady(), 'ready');
      expectEvent(await infraction.communityRejects(), 'rejectedByCommunity');
      expectEvent(await infraction.addProof(url), 'newProof', { url });
      expectEvent(await infraction.communityApproves(), 'approvedByComunity');
      expectEvent(await infraction.departamentRejects(), 'rejectedByDepartment');
      expectEvent(await infraction.addProof(url), 'newProof', { url });
      expectEvent(await infraction.departamentApproves(), 'approvedByDepartment');
      expectEvent(await infraction.courtRejects(), 'rejectedByCourt');
      expectEvent(await infraction.addProof(url), 'newProof', { url });
      expectEvent(await infraction.courtApproves(), 'approvedByCourt');
      expectEvent(await infraction.endVolunteerPayment(), 'volunteerPaimentPeriodEnds');
      expectEvent(await infraction.endRegularPayment(), 'regularPaimentPeriodEnds');
      expectEvent(await infraction.endOverduePayment(), 'overduePaimentPeriodEnds');
      expectEvent(await infraction.setPaid(), 'paid');
      expectEvent(await infraction.setClaimed(), 'claimed');
    });
  });
  describe('Modifiers', async () => {
    beforeEach(async () => {
      const { address } = await InfractionFactory.deployed();
      infraction = await Infraction.new(address);
      infraction.setReady();
    });
    it('communityRejects', async () => {
      expectEvent(await infraction.communityRejects(), 'rejectedByCommunity');
      expectEvent(await infraction.reject(), 'rejected');
    });
    it('departamentRejects', async () => {
      await infraction.communityApproves();
      expectEvent(await infraction.departamentRejects(), 'rejectedByDepartment');
      expectEvent(await infraction.reject(), 'rejected');
    });
    it('courtRejects', async () => {
      await infraction.communityApproves();
      await infraction.departamentApproves();
      expectEvent(await infraction.courtRejects(), 'rejectedByCourt');
      expectEvent(await infraction.reject(), 'rejected');
    });
    it('onlyRejected', async () => {
      const stage = await infraction.stage();
      assert.equal(stage, 1); // Infraction is moved to ready (stage 1) in beforeAll hook
      await expectRevert(infraction.reject(), 'Only previously rejected');
    });
    it('onlyIssued', async () => {
      const stage = await infraction.stage();
      assert.equal(stage, 1); // Infraction is moved to ready (stage 1) in beforeAll hook
      await expectRevert(infraction.setPaid(), 'Only issued');
    });
  });
});
