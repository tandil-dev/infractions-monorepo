/* eslint-env node, mocha */
const Infractions = artifacts.require('./Infractions.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Infractions - Ownable and Access control', ([owner, admin, inspector, ...accounts]) => {
  const DEFAULT_ADMIN_ROLE = '0x00';
  const INSPECTOR_ROLE = web3.utils.keccak256('INSPECTOR_ROLE');

  let infraction;
  beforeEach(async () => {
    infraction = await Infractions.new();
  });

  it('Owner should be DEFAULT_ADMIN_ROLE', async () => {
    const hasAdminRole = await infraction.hasRole(DEFAULT_ADMIN_ROLE, owner);
    assert.equal(hasRole, true);
  });
  it('Owner should be able to grant DEFAULT_ADMIN_ROLE', async () => {
    await infraction.grantRole(DEFAULT_ADMIN_ROLE, admin);
    const hasAdminRole = await infraction.hasRole(DEFAULT_ADMIN_ROLE, admin);
    assert.equal(hasRole, true);
  });

  it('DEFAULT_ADMIN_ROLE should able to grant INSPECTOR_ROLE', async () => {
    await infraction.grantRole(DEFAULT_ADMIN_ROLE, admin);
    const hasAdminRole = await infraction.hasRole(DEFAULT_ADMIN_ROLE, admin);
    assert.equal(hasRole, true);
    await infraction.grantRole(INSPECTOR_ROLE, inspector);
    const hasInspectoRole = await infraction.hasRole(INSPECTOR_ROLE, inspector);
    assert.equal(hasRole, true);
  });
  it('Inspector should not be DEFAULT_ADMIN_ROLE', async () => {
    const hasRole = await infraction.hasRole(DEFAULT_ADMIN_ROLE, inspector);
    assert.equal(hasRole, false);
  });
});
