var Casino = artifacts.require("./Casino.sol");

contract('Casino', function(accounts) {
  let instance;
  const owner = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];
  const minBet = web3.toWei(0.1, 'ether');

  beforeEach(async () => {
    instance = await Casino.new(minBet, 10, {from: owner});
  });

  it("should initialize with correct minimum bet", async () => {
    const contractMinBet = await instance.minimumBet();
    assert.equal(contractMinBet.toString(), minBet, "Minimum bet should be 0.1 ETH");
  });

  it("should allow a user to place a bet", async () => {
    await instance.bet(5, {from: player1, value: minBet});
    const playerExists = await instance.checkPlayerExists(player1);
    const playerBetNumber = await instance.playerBetsNumber(player1);
    const numberOfBets = await instance.numberOfBets();

    assert.equal(playerExists, true, "Player should exist");
    assert.equal(playerBetNumber.toNumber(), 5, "Player bet number should be 5");
    assert.equal(numberOfBets.toNumber(), 1, "Number of bets should be 1");
  });

  it("should not allow betting below minimum amount", async () => {
    try {
      await instance.bet(5, {from: player1, value: web3.toWei(0.01, 'ether')});
      assert.fail("Should have thrown an error");
    } catch (err) {
      assert.include(err.message, "revert", "Error should be revert"); // Or 'invalid opcode' depending on Truffle/Ganache version
    }
  });

  it("should only allow owner to set new minimum bet", async () => {
    const newMinBet = web3.toWei(0.5, 'ether');

    // Owner tries to set it
    await instance.setMinimumBet(newMinBet, {from: owner});
    let currentMinBet = await instance.minimumBet();
    assert.equal(currentMinBet.toString(), newMinBet, "Owner should be able to update min bet");

    // Non-owner tries to set it
    try {
      await instance.setMinimumBet(minBet, {from: player1});
      assert.fail("Should have thrown an error");
    } catch (err) {
      assert.include(err.message, "revert", "Non-owner should not be able to update min bet");
    }
  });

  it("should only allow owner to set max amount of bets", async () => {
    const newMaxBets = 50;

    // Owner tries
    await instance.setMaxAmountOfBets(newMaxBets, {from: owner});
    let currentMaxBets = await instance.maxAmountOfBets();
    assert.equal(currentMaxBets.toNumber(), newMaxBets, "Owner should be able to update max bets");

    // Non-owner tries
    try {
      await instance.setMaxAmountOfBets(20, {from: player1});
      assert.fail("Should have thrown an error");
    } catch (err) {
      assert.include(err.message, "revert", "Non-owner should not be able to update max bets");
    }
  });
});
