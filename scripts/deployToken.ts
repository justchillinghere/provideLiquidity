import { ethers, run, network } from "hardhat";

const delay = async (time: number) => {
  return new Promise((resolve: any) => {
    setInterval(() => {
      resolve();
    }, time);
  });
};

async function main() {
  const MyToken = await ethers.getContractFactory("TokenB"); // Returns a contract factory,
  // which can be used to deploy new contracts using new ContractFactory(signer: Signer, bytecode: string, interface: ContractInterface)
  const myToken = await MyToken.deploy();

  await myToken.deployed();

  console.log(`MyToken contract deployed to ${myToken.address}`);

  console.log("wait of delay...");
  await delay(15000); // delay 15 secons
  console.log("starting verify token...");
  try {
    await run("verify:verify", {
      address: myToken!.address,
      contract: "contracts/ERC20_oz.sol:TokenB",
      constructorArguments: [],
    });
    console.log("verify success");
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
