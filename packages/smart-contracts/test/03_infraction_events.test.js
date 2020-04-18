/* eslint-env node, mocha */
const Infraction = artifacts.require('./Infraction.sol');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Infraction', () => {
  let infraction;

  describe('Events', async () => {
    beforeEach(async () => {
      infraction = await Infraction.new();
    });
    it('Happy path =)', async () => {
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
      expectEvent(await infraction.communityRejects(), 'rejectedByCommunity');
      expectEvent(await infraction.addProofs(), 'newComunityProofs');
      expectEvent(await infraction.communityApproves(), 'approvedByComunity');
      expectEvent(await infraction.departamentRejects(), 'rejectedByDepartment');
      expectEvent(await infraction.addProofs(), 'newDepartmentProofs');
      expectEvent(await infraction.departamentApproves(), 'approvedByDepartment');
      expectEvent(await infraction.courtRejects(), 'rejectedByCourt');
      expectEvent(await infraction.addProofs(), 'newCourtProofs');
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
      infraction = await Infraction.new();
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
      assert.equal(stage, 0);
      await expectRevert(infraction.reject(), 'Only previously rejected');
    });
    it('onlyIssued', async () => {
      const stage = await infraction.stage();
      assert.equal(stage, 0);
      await expectRevert(infraction.setPaid(), 'Only issued');
    });
  });
});
