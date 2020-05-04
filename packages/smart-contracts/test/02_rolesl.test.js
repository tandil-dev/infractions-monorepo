/* eslint-env node, mocha */
const Roles = artifacts.require('Roles');

require('chai')
  .use(require('chai-as-promised'))
  .should();

// eslint-disable-next-line no-unused-vars
contract('Roles', ([owner, admin, inspector, judge, ...accounts]) => {
  const DEFAULT_ADMIN_ROLE = '0x00';
  const INSPECTOR_ROLE = web3.utils.keccak256('INSPECTOR_ROLE');
  const JUDGE_ROLE = web3.utils.keccak256('JUDGE_ROLE');

  let roles;
  beforeEach(async () => {
    roles = await Roles.deployed();
  });

  it('Owner should be DEFAULT_ADMIN_ROLE', async () => {
    const hasAdminRole = await roles.hasRole(DEFAULT_ADMIN_ROLE, owner);
    assert.equal(hasAdminRole, true);
  });
  it('Owner should be able to grant DEFAULT_ADMIN_ROLE', async () => {
    await roles.grantRole(DEFAULT_ADMIN_ROLE, admin);
    const hasAdminRole = await roles.hasRole(DEFAULT_ADMIN_ROLE, admin);
    assert.equal(hasAdminRole, true);
  });

  it('DEFAULT_ADMIN_ROLE should able to grant INSPECTOR_ROLE', async () => {
    await roles.grantRole(INSPECTOR_ROLE, inspector);
    const hasInspectoRole = await roles.hasRole(INSPECTOR_ROLE, inspector);
    assert.equal(hasInspectoRole, true);
  });
  it('Inspector should not be DEFAULT_ADMIN_ROLE', async () => {
    const hasRole = await roles.hasRole(DEFAULT_ADMIN_ROLE, inspector);
    assert.equal(hasRole, false);
  });

  it('DEFAULT_ADMIN_ROLE should able to grant JUDGE_ROLE', async () => {
    await roles.grantRole(JUDGE_ROLE, judge);
    const hasJudgeRole = await roles.hasRole(JUDGE_ROLE, judge);
    assert.equal(hasJudgeRole, true);
  });
});
