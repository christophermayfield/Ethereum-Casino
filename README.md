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

## Security Note

**WARNING**: This repository uses a **mock implementation** of the Oraclize API (`contracts/oraclizeAPI_0.4.sol`) for local development and testing purposes.
*   The mock allows any caller to simulate the oracle callback.
*   **DO NOT DEPLOY THIS CODE TO MAINNET** without replacing the local import in `Casino.sol` with the official Oraclize/Provable import or a secure bridge.

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
*   MetaMask browser extension

## Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Compile contracts:
    ```bash
    truffle compile
    ```
    *Note: The contract imports `oraclizeAPI_0.4.sol` locally.*

3.  Migrate (Deploy) contracts:
    ```bash
    truffle migrate
    ```

## Frontend Usage

1.  Build the frontend application:
    ```bash
    npm run build
    ```

2.  Open the application:
    *   Open `dist/index.html` in your web browser.
    *   Ensure MetaMask is installed and connected to your local Ethereum network (e.g., Localhost 8545).
    *   If using Ganache, import a Ganache account into MetaMask using the private key.

3.  Play:
    *   The dashboard shows the current game status (Minimum bet, Total bet, etc.).
    *   Click on a number to place a bet. MetaMask will prompt you to confirm the transaction.
    *   Once the max bets limit is reached, the winner will be determined (requires Oraclize bridge or manual oracle response in dev).

## Project Structure

*   `contracts/`: Solidity smart contracts.
*   `migrations/`: Truffle deployment scripts.
*   `src/js/`: React frontend source files (`index.js`, `App.js`).
*   `src/css/`: Stylesheets.
*   `test/`: Smart contract tests.
*   `dist/`: Compiled frontend assets (`index.html`, `build.js`).

## Troubleshooting

### Oraclize Import Error
The project uses a local copy of `oraclizeAPI_0.4.sol` in `contracts/` to ensure compilation succeeds even if the external GitHub import fails.

### Web3 Connection
Ensure your browser has MetaMask installed or you are running a local node on port 8545. The app attempts to connect to an injected Web3 provider (MetaMask) first, then falls back to `http://localhost:8545`.

## Future Improvements

*   **Unit Tests**: Add comprehensive tests in `test/` to verify betting logic, edge cases, and payout calculations.
*   **Oraclize Bridge**: Set up the Ethereum Bridge for local development to simulate Oraclize responses.
