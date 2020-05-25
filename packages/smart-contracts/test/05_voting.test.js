/* eslint-env node, mocha */
const InfractionFactory = artifacts.require('InfractionFactory');
const Infraction = artifacts.require('Infraction');
const RewardsTandil = artifacts.require('RewardsTandil');

const { expectRevert } = require('@openzeppelin/test-helpers');

const { BN } = web3.utils;
const { getNewInfraction } = require('./utils');

require('chai')
  .use(require('chai-as-promised'))
  .should();


contract('Infraction', (accounts) => {
  let infraction;
  let infractionFactory;

  beforeEach(async () => {
    const rewardsTandil = await RewardsTandil.deployed();
    infractionFactory = await InfractionFactory.new(rewardsTandil.address);
    infraction = await getNewInfraction(infractionFactory);
  });

  it('Debo poder votar positivo', async () => {
    await infraction.vote(true);
    const saidYes = await infraction.getTotalYes();
    assert.equal(saidYes, 1);
  });

  it('Debo poder votar negativo', async () => {
    await infraction.vote(false);
    const saidNo = await infraction.getTotalNo();
    assert.equal(saidNo, 1);
  });

  it('No debe poder votar más de una vez', async () => {
    await infraction.vote(false);
    await expectRevert(
      infraction.vote(false),
      'Already voted',
    );
  });
  it('Debo poder obtener el total de votos', async () => {
    const requitedVotes = await infraction.requitedVotes();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(i % 2, { from: accounts[i] });
    }
    const totalVoters = await infraction.getTotalVoters();
    assert.equal(totalVoters.toString(), requitedVotes.toString());
  });

  it('Should store addess and index in factory', async () => {
    const indexInFactory = await infractionFactory.indexOfInfractionForVote(infraction.address);
    const infractionAddressInFactoy = await infractionFactory.infractionsForVote(indexInFactory);
    assert.equal(infractionAddressInFactoy, infraction.address);
  });

  it('Al cambiar de estado, la infrcción debe ser removida de la lista de infracciones para votar', async () => {
    const requitedVotes = await infraction.requitedVotes();
    const initialStage = await infraction.stage();
    assert.equal(initialStage, 0);

    const indexInFactory = await infractionFactory.indexOfInfractionForVote(infraction.address);

    const infractionAddressInFactoy = await infractionFactory.infractionsForVote(indexInFactory);
    assert.equal(infractionAddressInFactoy, infraction.address);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(false, { from: accounts[i] });
    }

    assert.equal(await infraction.stage(), 10);
  });

  it('Al llegar a N votos positivos, debe cambiar de estado', async () => {
    const requitedVotes = await infraction.requitedVotes();
    const initialStage = await infraction.stage();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(true, { from: accounts[i] });
    }

    assert.equal(initialStage.add((new BN('1'))).toString(), (await infraction.stage()).toString());
  });

  it('Al llegar a N votos negativos, debe cambiar al estado REJECTED_BY_COMMUNITY (10)', async () => {
    const requitedVotes = await infraction.requitedVotes();
    const initialStage = await infraction.stage();
    assert.equal(initialStage, 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infraction.vote(false, { from: accounts[i] });
    }

    assert.equal(await infraction.stage(), 10);
  });

  it('Tomar la primer infracción votarla por todos. Debe actulizar los indices', async () => {
    await getNewInfraction(infractionFactory);
    await getNewInfraction(infractionFactory);

    const addresssOfFirstInfractionForVote = await infractionFactory.infractionsForVote(0);
    assert.notEqual(addresssOfFirstInfractionForVote, '');
    assert.notEqual(addresssOfFirstInfractionForVote, 0x0);
    assert.notEqual(addresssOfFirstInfractionForVote, null);
    assert.notEqual(addresssOfFirstInfractionForVote, undefined);

    const addresssOfSecondInfractionForVote = await infractionFactory.infractionsForVote(1);
    assert.notEqual(addresssOfSecondInfractionForVote, '');
    assert.notEqual(addresssOfSecondInfractionForVote, 0x0);
    assert.notEqual(addresssOfSecondInfractionForVote, null);
    assert.notEqual(addresssOfSecondInfractionForVote, undefined);

    assert.notEqual(addresssOfFirstInfractionForVote, addresssOfSecondInfractionForVote);
    const infractionToVote = await Infraction.at(addresssOfFirstInfractionForVote);

    const requitedVotes = await infraction.requitedVotes();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infractionToVote.vote(false, { from: accounts[i] });
    }

    const newFirstnfraction = await infractionFactory.infractionsForVote(0);
    assert.equal(newFirstnfraction, addresssOfSecondInfractionForVote);
  });

  it('Tomar la segunda infracción votarla por todos. Debe actulizar los indices', async () => {
    await getNewInfraction(infractionFactory);
    await getNewInfraction(infractionFactory);
    await getNewInfraction(infractionFactory);

    const totalInfrctions = await infractionFactory.getTotalInfactinsForVote();

    const infactionAddresses = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < totalInfrctions; i++) {
      // eslint-disable-next-line no-await-in-loop
      const address = await infractionFactory.infractionsForVote(i);
      infactionAddresses.push(address);
    }

    const infractionToVote = await Infraction.at(infactionAddresses[1]);

    const requitedVotes = await infraction.requitedVotes();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= requitedVotes; i++) {
      // eslint-disable-next-line no-await-in-loop
      await infractionToVote.vote(false, { from: accounts[i] });
    }

    const totalInfrctionsAfterVote = await infractionFactory.getTotalInfactinsForVote();

    const infactionAddressesAfterVote = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < totalInfrctionsAfterVote; i++) {
      // eslint-disable-next-line no-await-in-loop
      const address = await infractionFactory.infractionsForVote(i);
      infactionAddressesAfterVote.push(address);
    }
  });
});
