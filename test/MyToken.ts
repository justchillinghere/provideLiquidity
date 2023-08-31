import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, util } from "chai";
import {
  BigNumber,
  Contract,
  ContractReceipt,
  ContractTransaction,
} from "ethers";
import { ethers } from "hardhat";
import { MyToken } from "../src/types";

const DECIMALS = 18;
const NAME = "MyToken";
const SYMBOL = "MTK";
const INITIAL_AMOUNT = ethers.utils.parseUnits("10", "18"); // 10^18
// const bigNumberExample = BigNumber.from(1000);

describe("MyToken contract", function () {
  let MyToken;
  let myToken: Contract;
  let owner: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    users: SignerWithAddress[];

  beforeEach(async () => {
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, user1, user2, ...users] = await ethers.getSigners();
    myToken = await MyToken.deploy(NAME, SYMBOL);
  });

  describe("Initial params of contract", async () => {
    it("should have the correct name", async () => {
      const name: string = await myToken.name();
      expect(name).to.be.equal(NAME);
    });
    it("should have the correct symbol", async () => {
      const symbol: string = await myToken.symbol();
      expect(symbol).to.be.equal(SYMBOL);
    });
    it("should have the correct decimals", async () => {
      const decimals: Number = await myToken.decimals();
      expect(decimals).to.be.equal(DECIMALS);
    });
    it("should have the correct total supply", async () => {
      const totalSupply: BigNumber = await myToken.totalSupply();
      expect(totalSupply).to.be.equal(INITIAL_AMOUNT);
    });
    it("should have the correct owner", async () => {
      const contractOwnerAddress: string = await myToken.owner();
      expect(contractOwnerAddress).to.be.equal(owner.address);
    });
  });

  describe("Contract logic", function () {
    it("should mint the correct amount of tokens to any account", async () => {
      const mintedAmount: Number = 1000;
      const recipient = user1.address;
      await myToken.mint(recipient, 1000);
      const userBalance: Number = await myToken.balanceOf(recipient);
      expect(userBalance).to.be.equal(mintedAmount);
    });
    it("should allow burning tokens", async () => {
      const amount = 1000000;
      const burner = user2;
      await myToken.mint(burner.address, amount);
      await myToken.connect(burner).burn(amount);
      expect(await myToken.balanceOf(burner.address)).to.be.equal(0);
    });

    describe("Transfer and approval logic", function () {
      it("should have zero allowance initially", async () => {
        const recipient = user1.address;
        const actualAllowance = await myToken.allowance(
          owner.address,
          recipient
        );
        expect(actualAllowance).to.be.equal(0);
      });
      it("should provide allowance from owner to any user correctly", async () => {
        const amountToAllow = 1000;
        const recipient = user1.address;
        await myToken.approve(recipient, amountToAllow);
        const actualAllowance = await myToken.allowance(
          owner.address,
          recipient
        );
        expect(actualAllowance).to.be.equal(amountToAllow);
      });
      it("should provide allowance from another user to any user correctly", async () => {
        const amountToAllow = 1000;
        const senderToAllow = owner;
        const tokensOwner = user1;
        await myToken
          .connect(tokensOwner)
          .approve(senderToAllow.address, amountToAllow);

        const actualAllowance = await myToken.allowance(
          tokensOwner.address,
          senderToAllow.address
        );
        expect(actualAllowance).to.be.equal(amountToAllow);
      });
      it("should transfer from owner to any user correctly", async () => {
        const amount = 1000;
        const recipient = user1;
        const tokensOwner = owner;
        await myToken.transfer(recipient.address, amount);
        expect(await myToken.balanceOf(recipient.address)).to.be.equal(amount);
      });
      it("should transfer from approved account to another", async () => {
        const amount = 1000000;
        const senderToAllow = user2;
        const tokensOwner = user1;
        await myToken.mint(
          tokensOwner.address,
          ethers.utils.parseUnits("1", "18")
        );
        await myToken
          .connect(tokensOwner)
          .approve(senderToAllow.address, amount);
        await myToken
          .connect(senderToAllow)
          .transferFrom(tokensOwner.address, senderToAllow.address, amount);
        expect(await myToken.balanceOf(senderToAllow.address)).to.be.equal(
          amount
        );
      });
    });
  });

  describe("Negative scenarios", function () {
    it("should revert minting for not an owner", async () => {
      const mintedAmount: Number = 1000;
      const recipient = user1.address;
      await expect(myToken.connect(user1).mint(recipient, 1000)).to.be.reverted;
    });
    it("should revert when transferring more tokens than the user has", async () => {
      const recipient = user1;
      await expect(
        myToken.transfer(recipient.address, ethers.utils.parseUnits("20", "18"))
      ).to.be.revertedWith("MyToken: Not enough balance");
    });
    it("should revert when transferring more tokens than approved", async () => {
      const amount = 1000000;
      const senderToAllow = user2;
      const tokensOwner = user1;
      await myToken.mint(
        tokensOwner.address,
        ethers.utils.parseUnits("1", "18")
      );
      await myToken.connect(tokensOwner).approve(senderToAllow.address, amount);
      await expect(
        myToken
          .connect(senderToAllow)
          .transferFrom(tokensOwner.address, senderToAllow.address, 2 * amount)
      ).to.be.revertedWith("MyToken: Insufficient allowance");
    });
  });

  describe("Edge cases", function () {
    it("should transfer the minimum possible amount of tokens", async () => {
      const amount = 1;
      const recipient = user1;
      const tokensOwner = owner;
      await myToken.transfer(recipient.address, amount);
      expect(await myToken.balanceOf(recipient.address)).to.be.equal(amount);
    });
    it("should approve the maximum possible amount", async () => {
      const maxAmount = ethers.constants.MaxUint256;
      const recipient = user1.address;
      await myToken.approve(recipient, maxAmount);
      const actualAllowance = await myToken.allowance(owner.address, recipient);
      expect(actualAllowance).to.be.equal(maxAmount);
    });
  });

  describe("Event emission", function () {
    it("should emit Transfer event when tokens are transferred", async () => {
      const amount = 1000;
      const sender = owner;
      const recipient = user1;
      const transferTx: ContractTransaction = await myToken.transfer(
        recipient.address,
        amount
      );
      const transferReceipt: ContractReceipt = await transferTx.wait();
      const transferEvent = transferReceipt.events?.find(
        (event) => event.event === "Transfer"
      );
      expect(transferEvent?.args!["from"]).to.be.equal(sender.address);
      expect(transferEvent?.args!["to"]).to.be.equal(recipient.address);
      expect(transferEvent?.args!["value"]).to.be.equal(amount);
    });

    it("should emit Approval event when allowances are set", async () => {
      const amountToAllow = 1000;
      const owner = await myToken.owner();
      const spender = user2;
      const approvalTx: ContractTransaction = await myToken.approve(
        spender.address,
        amountToAllow
      );
      const approvalReceipt: ContractReceipt = await approvalTx.wait();
      const approvalEvent = approvalReceipt.events?.find(
        (event) => event.event === "Approval"
      );
      expect(approvalEvent?.args!["owner"]).to.be.equal(owner);
      expect(approvalEvent?.args!["spender"]).to.be.equal(spender.address);
      expect(approvalEvent?.args!["value"]).to.be.equal(amountToAllow);
    });
  });
});
