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

## Disclaimer

**Missing Frontend Source**: The `webpack.config.js` references an entry point at `src/js/index.js`, but the `src/js` directory is currently missing from this repository. As such, the frontend build process (`npm start` or `webpack`) will fail until the missing source code is restored or recreated.
