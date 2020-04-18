/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('./InfractionFactory.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

// eslint-disable-next-line no-unused-vars
contract('Infractions - Ownable and Access control', ([owner, admin, inspector, ...accounts]) => {
  const DEFAULT_ADMIN_ROLE = '0x00';
  const INSPECTOR_ROLE = web3.utils.keccak256('INSPECTOR_ROLE');

  let infractionFactory;
  beforeEach(async () => {
    infractionFactory = await InfractionFactory.new();
  });

  it('Owner should be DEFAULT_ADMIN_ROLE', async () => {
    const hasAdminRole = await infractionFactory.hasRole(DEFAULT_ADMIN_ROLE, owner);
    assert.equal(hasAdminRole, true);
  });
  it('Owner should be able to grant DEFAULT_ADMIN_ROLE', async () => {
    await infractionFactory.grantRole(DEFAULT_ADMIN_ROLE, admin);
    const hasAdminRole = await infractionFactory.hasRole(DEFAULT_ADMIN_ROLE, admin);
    assert.equal(hasAdminRole, true);
  });

  it('DEFAULT_ADMIN_ROLE should able to grant INSPECTOR_ROLE', async () => {
    await infractionFactory.grantRole(DEFAULT_ADMIN_ROLE, admin);
    const hasAdminRole = await infractionFactory.hasRole(DEFAULT_ADMIN_ROLE, admin);
    assert.equal(hasAdminRole, true);
    await infractionFactory.grantRole(INSPECTOR_ROLE, inspector);
    const hasInspectoRole = await infractionFactory.hasRole(INSPECTOR_ROLE, inspector);
    assert.equal(hasInspectoRole, true);
  });
  it('Inspector should not be DEFAULT_ADMIN_ROLE', async () => {
    const hasRole = await infractionFactory.hasRole(DEFAULT_ADMIN_ROLE, inspector);
    assert.equal(hasRole, false);
  });
});
