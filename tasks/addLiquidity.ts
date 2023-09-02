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
    const Contract = await ethers.getContractFactory("AddLiquidity");
    const lpContract = Contract.attach(contractAddress!);

    const addLiquidityTx: ContractTransaction = await lpContract.addLiquidity(
      tokenA,
      tokenB,
      valueA,
      valueB
    );
    const allLiquidityReceipt: ContractReceipt = await addLiquidityTx.wait();
    console.dir(allLiquidityReceipt.events);

    // const event = allLiquidityReceipt.events?.find(
    //   (event) => event.event === "Approval"
    // );
    // const eInitiator: Address = event?.args!["owner"];
    // const eSpender: Address = event?.args!["spender"];
    // const eAmount: BigNumber = event?.args!["value"];
    // console.log(`Initiator: ${eInitiator}`);
    // console.log(`Spender: ${eSpender}`);
    // console.log(`Amount: ${eAmount}`);
  });
