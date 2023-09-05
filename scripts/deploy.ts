import { ethers, run, network } from "hardhat";
import uniswapV2Data from "../uniswapV2ContractsData.json";

const delay = async (time: number) => {
  return new Promise((resolve: any) => {
    setInterval(() => {
      resolve();
    }, time);
  });
};

async function main() {
  const router = uniswapV2Data.router.address;
  const factory = uniswapV2Data.factory.address;
  const MyContract = await ethers.getContractFactory("LiquidityProvider");
  const myContract = await MyContract.deploy(router, factory);

  await myContract.deployed();

  console.log(`The contract has been deployed to ${myContract.address}`);

  console.log("wait of delay...");
  await delay(30000); // delay 30 seconds
  console.log("starting verify token...");
  try {
    await run("verify:verify", {
      address: myContract!.address,
      contract: "contracts/LiquidityProvider.sol:LiquidityProvider",
      constructorArguments: [router, factory],
    });
    console.log("verify success");
    return;
  } catch (e: any) {
    console.log(e.message);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
