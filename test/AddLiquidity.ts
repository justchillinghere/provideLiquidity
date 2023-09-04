import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseProvider } from "ethers/node_modules/@ethersproject/providers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import {
  MyToken,
  AddLiquidity,
  MyToken__factory,
  AddLiquidity__factory,
} from "../src/types";
import uniswapV2ContractData from "../uniswapV2ContractsData.json";

describe("AddLiquidity to Uniswap v2 contract", function () {
  let addLiquidity: AddLiquidity;
  let uniswapFactory: Contract;

  let tokenA: MyToken;
  let tokenB: MyToken;

  let amountA: BigNumber = ethers.utils.parseUnits("1", "10");
  let amountB: BigNumber = ethers.utils.parseUnits("1", "10");
  let exceedingAmount: BigNumber = ethers.utils.parseUnits("1", "20");

  let owner: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    users: SignerWithAddress[];

  const provider: BaseProvider = ethers.getDefaultProvider();

  beforeEach(async () => {
    [owner, user1, user2, ...users] = await ethers.getSigners();
    const AddLiquidity = (await ethers.getContractFactory(
      "AddLiquidity"
    )) as AddLiquidity__factory;
    addLiquidity = await AddLiquidity.deploy(
      uniswapV2ContractData.router.address,
      uniswapV2ContractData.factory.address
    );

    uniswapFactory = new ethers.Contract(
      uniswapV2ContractData.factory.address,
      uniswapV2ContractData.factory.abi,
      provider
    );
    const TokenA = (await ethers.getContractFactory(
      "MyToken"
    )) as MyToken__factory;
    const TokenB = (await ethers.getContractFactory(
      "MyToken"
    )) as MyToken__factory;
    tokenA = await TokenA.deploy("TokenA", "TKA");
    tokenB = await TokenB.deploy("TokenB", "TKB");

    await tokenA.approve(addLiquidity.address, amountA);
    await tokenB.approve(addLiquidity.address, amountB);
  });

  describe("Test correctness of uniswap contracts", function () {
    it("should check that bytecode of uniswap object factory is equal to actual one", async () => {
      expect(await provider.getCode(uniswapFactory.address)).to.equal(
        uniswapV2ContractData.factory.bytecode
      );
    });
    it("should set the correct router and factory addresses in contracts", async () => {
      expect(await addLiquidity.uniswapV2Router()).to.equal(
        uniswapV2ContractData.router.address
      );
      expect(await addLiquidity.uniswapV2Factory()).to.equal(
        uniswapV2ContractData.factory.address
      );
    });
  });

  describe("Test addLiquidity function", function () {
    it("should add liquidity and emit an event with correct arguments", async () => {
      expect(
        await addLiquidity.addLiquidity(
          tokenA.address,
          tokenB.address,
          amountA,
          amountB
        )
      )
        .to.emit(addLiquidity, "AddedLiquidity")
        .withArgs(
          tokenA.address,
          tokenB.address,
          owner.address,
          await uniswapFactory.getPair(tokenA.address, tokenB.address)
        );
    });
  });

  describe("Test provided tokens amount", function () {
    it("should revert if token A allowance is less than desired amount", async () => {
      await expect(
        addLiquidity.addLiquidity(
          tokenA.address,
          tokenB.address,
          exceedingAmount,
          amountB
        )
      ).to.be.revertedWith(
        "Allowance for token A less than desired. Please approve the required amount"
      );
    });

    it("should revert if token B allowance is less than desired amount", async () => {
      await expect(
        addLiquidity.addLiquidity(
          tokenA.address,
          tokenB.address,
          amountA,
          exceedingAmount
        )
      ).to.be.revertedWith(
        "Allowance for token B less than desired. Please approve the required amount"
      );
    });
    it("should revert if zero tokens provided", async () => {
      await expect(
        addLiquidity.addLiquidity(tokenA.address, tokenB.address, 0, amountB)
      ).to.be.revertedWith("ds-math-sub-underflow");
    });
  });
});
