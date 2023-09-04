# Smart contract to add liquidity to Uniswap V2

## Description

This project is dedicated to learn interaction with other smart contracts from another smart contract.

With this contract one can add liquidity to the Uniswap V2 decentralized exchange by providing some amounts of two tokens. This smart contract allows users to add liquidity to any pair of ERC20 tokens (or creates new one automatically) on the Uniswap V2 platform. The contract transfers the desired amounts of tokens from the sender to itself, approves the Uniswap V2 Router to spend the tokens, and then calls the addLiquidity function of the Router to add liquidity to the specified token pair. The contract emits an event with the details of the liquidity added.

## Deployed contract example

You can find and test my deployed contract in goerli testnet by this address: [0xa3073345541e46944Cb55d565B08555AB76DB990](https://goerli.etherscan.io/address/0xa3073345541e46944Cb55d565B08555AB76DB990)

## Installation

Clone the repository using the following command:
Install the dependencies using the following command:

```
npm i
```

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it).
Note:

- Mnemonic is 12 words phrase you can obtain while creating a new account (in Metamask for example)
- RPC_URL may be choosen here: https://chainlist.org
- ETHERSCAN may be obtained in your account profile on etherscan

Deploy contract to the chain (mumbai testnet):

```
npx hardhat run scripts/deploy.ts --network polygon-mumbai
```

## Tasks

Create new task(s) ans save it(them) in the folder "tasks". Add a new task name in the file "tasks/index.ts".

Running a task:

```
npx hardhat addLiquidity --token-a {TOKEN_A ADDRESS} --token-b {TOKEN_B ADDRESS} --value-a 10000000 --value-b 10000000 --network goerli
```

Note: Replace {TOKEN\_\* ADDRESS} with the address of the token.

## Verification

Verify the installation by running the following command:

```
npx hardhat verify --network goerli {CONTRACT_ADDRESS}
```

Note: Replace {CONTRACT_ADDRESS} with the address of the contract
