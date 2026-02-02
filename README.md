# Casino Ethereum DApp

A decentralized casino application built on the Ethereum blockchain. This project implements a betting game where users can bet Ether on a number between 1 and 10.

## Overview

The core logic is implemented in the `Casino.sol` smart contract.

### Game Rules
1.  **Betting**: Players bet a minimum of 0.1 ETH on a number from 1 to 10.
2.  **Game Loop**: The game accepts bets until a maximum number of bets (default 10) is reached.
3.  **Winning**: Once the limit is reached, a random winning number is generated.
4.  **Payout**:
    *   The total pot (minus Oraclize fees) is distributed equally among the winners.
    *   If there are no winners, the pot goes to the contract owner.
    *   Winnings are stored in a mapping and must be explicitly withdrawn by the players.

### Smart Contract Details
*   **Contract**: `contracts/Casino.sol`
*   **Randomness**: Uses [Oraclize (now Provable)](http://www.oraclize.it/) to generate a secure random number on-chain.
*   **Security**: Uses `SafeMath` for arithmetic operations to prevent overflows/underflows. Uses a withdrawal pattern (`withdraw()` function) to prevent reentrancy attacks and gas limit issues during prize distribution.

## How It Works

1.  **Initialization**: The contract is deployed with a minimum bet amount and a maximum number of bets per game.
2.  **Placing Bets**: Users call the `bet(uint numberToBet)` function, sending Ether with the transaction.
    *   Validation checks ensure the bet is within range (1-10) and meets the minimum amount.
    *   The player is added to the list for that specific number.
3.  **Ending the Game**: When the `numberOfBets` reaches `maxAmountOfBets`, the contract triggers `generateNumberWinner()`.
    *   This function calls `oraclize_newRandomDSQuery` to request a random number.
4.  **Callback**: Oraclize processes the request and calls the `__callback` function with the random result.
    *   The result is modulo-ed to get a number between 1 and 10.
5.  **Distribution**: The `distributePrizes()` function calculates the share per winner and updates their pending winnings in the `winnings` mapping.
6.  **Reset**: The game state (bets, players) is reset for the next round.
7.  **Withdrawal**: Winners manually call `withdraw(amount)` to transfer their winnings to their wallet.

## Technology Stack

*   **Smart Contracts**: Solidity (v0.4.11)
*   **Development Framework**: Truffle
*   **Frontend**: React (configured via Webpack)

## Prerequisites

*   Node.js and npm
*   Truffle (`npm install -g truffle`)
*   Ganache or a local Ethereum node for development

## Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Compile contracts:
    ```bash
    truffle compile
    ```
    *Note: The contract imports Oraclize API via GitHub. Ensure your environment supports this or manually download `oraclizeAPI_0.4.sol` if compilation fails.*

3.  Migrate (Deploy) contracts:
    ```bash
    truffle migrate
    ```

## Project Structure

*   `contracts/`: Solidity smart contracts.
*   `migrations/`: Truffle deployment scripts.
*   `src/`: Frontend source files.
*   `test/`: Smart contract tests (currently empty).

## Troubleshooting

### Oraclize Import Error
If you encounter `Error: Could not find github.com/oraclize/ethereum-api/oraclizeAPI_0.4.sol`, it means Truffle cannot resolve the external GitHub import.
**Solution**:
1.  Download the `oraclizeAPI_0.4.sol` file manually from the [Oraclize GitHub repository](https://github.com/provable-things/ethereum-api).
2.  Place it in the `contracts/` directory.
3.  Update `Casino.sol` to import from the local file: `import "./oraclizeAPI_0.4.sol";`.

## Disclaimer

**Missing Frontend Source**: The `webpack.config.js` references an entry point at `src/js/index.js`, but the `src/js` directory is currently missing from this repository. As such, the frontend build process (`npm start` or `webpack`) will fail until the missing source code is restored or recreated.

## Future Improvements

*   **Reconstruct Frontend**: Create the missing React components (`src/js/index.js`, `App.js`) to interact with the contract.
*   **Unit Tests**: Add comprehensive tests in `test/` to verify betting logic, edge cases, and payout calculations.
*   **Oraclize Bridge**: Set up the Ethereum Bridge for local development to simulate Oraclize responses.
