import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';
import { contractAddress } from '../hardhat.config';

task('burn', 'Burns tokens from senders account')
    .addParam('amount', 'Token amount to burn')
	.setAction(async ({amount}, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(contractAddress!);

        const contractTx: ContractTransaction = await tokenContract.burn(amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eInitiator: Address = event?.args!['from'];
        const eAmount: BigNumber = event?.args!['value'];            
    	console.log(`Burnt ${eAmount} tokens from ${eInitiator} wallet`);
})
