import { ethers, run, network } from "hardhat";

const delay = async (time: number) => {
  return new Promise((resolve: any) => {
    setInterval(() => {
      resolve();
    }, time);
  });
};

async function main() {
  const router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const MyContract = await ethers.getContractFactory("AddLiquidity"); // Returns a contract factory,
  // which can be used to deploy new contracts using new ContractFactory(signer: Signer, bytecode: string, interface: ContractInterface)
  const myContract = await MyContract.deploy(router, factory);

  await myContract.deployed();

  console.log(`MyContract contract deployed to ${myContract.address}`);

  console.log("wait of delay...");
  await delay(30000); // delay 30 seconds
  console.log("starting verify token...");
  try {
    await run("verify:verify", {
      address: myContract!.address,
      contract: "contracts/AddLiquidity.sol:AddLiquidity",
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
