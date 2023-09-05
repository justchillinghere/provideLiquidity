import { task } from "hardhat/config";
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from "cluster";
import { contractAddress } from "../hardhat.config";

task(
  "addLiquidity",
  "Adds liquidity for a pair of tokens. \
	If no token pair is found, creates new one automatically"
)
  .addParam("tokenA", "Address of the first token")
  .addParam("tokenB", "Address of the second token")
  .addParam("valueA", "Value to provide token A liquidity")
  .addParam("valueB", "Value to provide token B liquidity")
  .setAction(async ({ tokenA, tokenB, valueA, valueB }, { ethers }) => {
    const Contract = await ethers.getContractFactory("LiquidityProvider");
    const lpContract = Contract.attach(contractAddress!);

    const addLiquidityTx: ContractTransaction = await lpContract.addLiquidity(
      tokenA,
      tokenB,
      valueA,
      valueB
    );
    const allLiquidityReceipt: ContractReceipt = await addLiquidityTx.wait();

    const event = allLiquidityReceipt.events?.find(
      (event) => event.event === "AddedLiquidity"
    );
    const addressTokenA: Address = event?.args!["TokenA"];
    const addressTokenB: Address = event?.args!["TokenB"];
    const creator: Address = event?.args!["creator"];
    const pairAddress: Address = event?.args!["LPpair"];
    console.log("Provided liquidity for a pair of tokens");
    console.log(`Token A address: ${addressTokenA}`);
    console.log(`Token B address: ${addressTokenB}`);
    console.log(`Liquidity provider: ${creator}`);
    console.log(`Pair address: ${pairAddress}`);
  });
